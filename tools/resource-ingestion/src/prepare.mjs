import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import ts from "typescript";

const TYPES = new Set(["recall","concept","compare","apply","numerical","assertreason","statement","match","sequence","graph","higher"]);
const LABELS = ["a","b","c","d","e","f"];
const norm = (v) => String(v ?? "").normalize("NFKC").replace(/\s+/g," ").trim().toLowerCase();
const digest = (s) => crypto.createHash("sha256").update(s).digest("hex");
function prop(node, key) {
  if (!node || !ts.isObjectLiteralExpression(node)) return;
  return node.properties.find((p) => ts.isPropertyAssignment(p) && (p.name.getText().replace(/["']/g,"") === key))?.initializer;
}
function str(node) { return node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : undefined; }
function objects(node) { return node && ts.isArrayLiteralExpression(node) ? node.elements.filter(ts.isObjectLiteralExpression) : []; }
function inspect(source, file, topicId) {
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const out = { ids: [], questions: [], subs: new Set() };
  const visit = (n) => {
    if (ts.isObjectLiteralExpression(n) && str(prop(n,"id")) === topicId) {
      for (const s of objects(prop(n,"subs"))) { const id = str(prop(s,"id")); if (id) out.subs.add(id); }
      for (const q of objects(prop(n,"questions"))) {
        const id = str(prop(q,"id"));
        if (id) out.ids.push(id);
        out.questions.push({ id, text: str(prop(q,"text")) || str(prop(q,"assertion")) || "" });
      }
    }
    ts.forEachChild(n,visit);
  };
  visit(sf);
  return out;
}
function mapQuestion(item, id, topic) {
  const errors = [];
  if (!TYPES.has(item.type)) errors.push("unsupported MT203 question type");
  if (!Number.isInteger(item.difficulty) || item.difficulty < 1 || item.difficulty > 4) errors.push("difficulty must be 1–4");
  if (!item.subtopic || !topic.subs.has(item.subtopic)) errors.push("subtopic does not match a current MT203 subtopic ID");
  if (!item.answer?.trim()) errors.push("answer key is missing");
  if (!item.explanation?.trim()) errors.push("explanation is missing");
  if (!Array.isArray(item.options) || item.options.length !== 4) errors.push("single-correct MT203 MCQs must have exactly four options");
  const options = (item.options ?? []).map((text,i)=>({label:LABELS[i],text}));
  const a = String(item.answer ?? "").trim().toLowerCase();
  const answer = options.some(o=>o.label===a) ? a : options.find(o=>norm(o.text)===norm(a))?.label;
  if (!answer) errors.push("answer does not match an option label or exact option text");
  if (item.type==="assertreason" && (!item.assertion || !item.reason)) errors.push("assertion–reason requires assertion and reason");
  if (item.type==="statement" && !item.statements?.length) errors.push("statement question requires statements");
  if (item.type==="match" && !item.table_rows?.length) errors.push("match question requires table rows");
  if (item.type==="numerical" && !item.concept) errors.push("numerical question requires a concept/equation reference");
  const question = {
    id, type:item.type, diff:item.difficulty,
    ...(item.source_question_text ? {text:item.source_question_text}:{}),
    ...(item.assertion ? {assertion:item.assertion}:{}), ...(item.reason ? {reason:item.reason}:{}),
    ...(item.statements?.length ? {statements:item.statements.map((text,i)=>({num:i+1,text}))}:{}),
    ...(item.table_rows?.length ? {tableRows:item.table_rows}:{}),
    options, answer, why:item.explanation,
    ...(item.distractor_explanations?.length ? {distractors:Object.fromEntries(item.distractor_explanations.map(d=>[d.label.toLowerCase(),d.explanation]))}:{}),
    ...(item.concept ? {concept:item.concept}:{}), tags:[...new Set([...(item.tags??[]),"source-extracted"])], sub:item.subtopic
  };
  return {question,errors,key:norm(item.source_question_text || item.assertion)};
}
export async function prepareMt203Patch({artifact,courseRoot}) {
  if (artifact?.course?.id!=="mt203" || !artifact.analysis) throw new Error("Expected a completed MT203 analysis artifact.");
  const proposals=[],blocked=[],byTopic={};
  for (const topicId of ["t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11"]) {
    const relative="app/data/qbank/"+topicId+".ts", file=path.join(courseRoot,relative);
    const source=await fs.readFile(file,"utf8"), current=inspect(source,file,topicId);
    const used=new Set(current.ids), existing=new Set(current.questions.map(q=>norm(q.text)).filter(Boolean));
    let next=Math.max(0,...current.ids.map(id=>Number(id.match(/-(\d+)$/)?.[1]??0)))+1;
    for (const item of artifact.analysis.source_questions.filter(q=>q.topic_id===topicId)) {
      const ref={topic_id:topicId,source_page:item.source_page,source_question_text:item.source_question_text};
      if(item.status!=="ready" || item.confidence<0.9) {blocked.push({...ref,reason:"not high-confidence ready; targeted review required"});continue;}
      const id=topicId+"-"+String(next).padStart(2,"0"), mapped=mapQuestion(item,id,current);
      if(mapped.errors.length){blocked.push({...ref,reason:mapped.errors.join("; ")});continue;}
      if(existing.has(mapped.key)){blocked.push({...ref,reason:"exact normalized question stem already exists"});continue;}
      if(used.has(id)){blocked.push({...ref,reason:"generated question ID collides with existing ID"});continue;}
      proposals.push({target:"metallurgy-source/"+relative,expected_file_sha256:digest(source),proposed_id:id,source:{sha256:artifact.source.sha256,page:item.source_page,evidence_quote:item.evidence_quote},question:mapped.question});
      used.add(id);existing.add(mapped.key);next++;
    }
    byTopic[topicId]={current_questions:current.questions.length,proposed_additions:proposals.filter(p=>p.question.id.startsWith(topicId+"-")).length,subtopics:[...current.subs]};
  }
  const meta=await fs.readFile(path.join(courseRoot,"app/data/qbank/meta.ts"),"utf8");
  const counts=Object.fromEntries([...meta.matchAll(/\{\s*id:\s*"(t\d+)"[^}]*count:\s*(\d+)/g)].map(m=>[m[1],Number(m[2])]));
  for(const [id,entry] of Object.entries(byTopic)){
    entry.metadata_count=counts[id]??null;entry.metadata_matches_source=entry.metadata_count===entry.current_questions;
    if(!entry.metadata_matches_source) blocked.push({topic_id:id,reason:"metadata count differs from parsed source; metadata will not be auto-adjusted",source_count:entry.current_questions,metadata_count:entry.metadata_count});
  }
  return {schema_version:"1.0",mode:"proposal-only",source:{filename:artifact.source.filename,sha256:artifact.source.sha256},course:{id:"mt203",name:"Polymer Science and Technology"},summary:{proposals:proposals.length,blocked:blocked.length,by_topic:byTopic},proposals,blocked,safeguards:["No source files were modified.","Existing IDs are not changed or reused.","Only source-extracted questions are proposed.","Every proposal includes source page and evidence quote.","Target SHA-256 fingerprints are included; stale targets must be re-read before any write.","Metadata counts are never adjusted automatically."]};
}
