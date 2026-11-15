export const ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "coverage", "theory_updates", "illustrations", "worked_examples", "source_questions", "review_items"],
  properties: {
    summary: { type: "string" },
    coverage: { type: "array", items: { type: "object", additionalProperties: false, required: ["source_heading","source_pages","topic_id","subtopic","disposition","rationale","confidence"], properties: {
      source_heading: { type: "string" }, source_pages: { type: "array", items: { type: "integer" } }, topic_id: { type: "string" }, subtopic: { type: "string" },
      disposition: { type: "string", enum: ["new","already-covered","expansion","possible-correction","unmapped"] }, rationale: { type: "string" }, confidence: { type: "number" }
    }}},
    theory_updates: { type: "array", items: { type: "object", additionalProperties: false, required: ["topic_id","heading","proposed_markdown","source_pages","relation","confidence","status"], properties: {
      topic_id: { type: "string" }, heading: { type: "string" }, proposed_markdown: { type: "string" }, source_pages: { type: "array", items: { type: "integer" } },
      relation: { type: "string", enum: ["new","expansion","correction","duplicate"] }, confidence: { type: "number" }, status: { type: "string", enum: ["ready","review","hold"] }
    }}},
    illustrations: { type: "array", items: { type: "object", additionalProperties: false, required: ["topic_id","kind","source_page","description","caption","action","confidence"], properties: {
      topic_id: { type: "string" }, kind: { type: "string", enum: ["diagram","graph","table","photograph","micrograph","other"] }, source_page: { type: "integer" },
      description: { type: "string" }, caption: { type: "string" }, action: { type: "string", enum: ["add","reuse","replace","review"] }, confidence: { type: "number" }
    }}},
    worked_examples: { type: "array", items: { type: "object", additionalProperties: false, required: ["topic_id","title","source_page","problem","solution","final_answer","units","confidence","status"], properties: {
      topic_id: { type: "string" }, title: { type: "string" }, source_page: { type: "integer" }, problem: { type: "string" }, solution: { type: "string" },
      final_answer: { type: "string" }, units: { type: "string" }, confidence: { type: "number" }, status: { type: "string", enum: ["ready","review","hold"] }
    }}},
    source_questions: { type: "array", items: { type: "object", additionalProperties: false, required: ["topic_id","subtopic","source_page","source_question_text","evidence_quote","type","difficulty","options","assertion","reason","statements","table_rows","answer","explanation","distractor_explanations","concept","tags","confidence","status"], properties: {
      topic_id: { type: "string" }, source_page: { type: "integer" }, subtopic: { type: "string" }, source_question_text: { type: "string" }, evidence_quote: { type: "string" },
      type: { type: "string", enum: ["recall","concept","compare","apply","numerical","assertreason","statement","match","sequence","graph","higher","unknown"] },
      difficulty: { type: "integer" }, options: { type: "array", items: { type: "string" } }, assertion: { type: "string" }, reason: { type: "string" }, statements: { type: "array", items: { type: "string" } }, table_rows: { type: "array", items: { type: "array", items: { type: "string" } } }, answer: { type: "string" }, explanation: { type: "string" }, distractor_explanations: { type: "array", items: { type: "object", additionalProperties: false, required: ["label","explanation"], properties: { label: { type: "string" }, explanation: { type: "string" } } } }, concept: { type: "string" }, tags: { type: "array", items: { type: "string" } },
      confidence: { type: "number" }, status: { type: "string", enum: ["ready","review","hold"] }
    }}},
    review_items: { type: "array", items: { type: "object", additionalProperties: false, required: ["severity","source_reference","issue","recommended_action"], properties: {
      severity: { type: "string", enum: ["info","minor","major"] }, source_reference: { type: "string" }, issue: { type: "string" }, recommended_action: { type: "string" }
    }}}
  }
};
export const TOPIC_IDS = new Set(["t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11"]);
