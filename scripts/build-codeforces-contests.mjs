// Build codeforces-red/contests.json after scripts/build-codeforces-catalogue.mjs.
// Node 18+: node scripts/build-codeforces-contests.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const arg=name=>{const i=process.argv.indexOf(name);return i>-1?process.argv[i+1]:null;};
const cataloguePath=arg('--catalogue')||resolve(root,'codeforces-red/catalogue.json');
const outPath=arg('--out')||resolve(root,'codeforces-red/contests.json');
const source=readFileSync(resolve(root,'codeforces-red/codeforces-problems.js'),'utf8');
function slice(from,to){const a=source.indexOf(from),b=source.indexOf(to,a);if(a<0||b<0)throw new Error('Cannot locate '+from+' in codeforces-problems.js');return source.slice(a,b);}
const categoriesFor=new Function(slice('  const CATEGORIES','  function readSaved')+'\n'+slice('  function categoriesFor','  function esc(')+'\nreturn categoriesFor;')();
const BANDS=[
{id:'800-1200',label:'800–1200',durationMinutes:120,ratings:[800,800,900,1000,1100,1200]},
{id:'1200-1600',label:'1200–1600',durationMinutes:120,ratings:[1200,1200,1300,1400,1500,1600]},
{id:'1600-2000',label:'1600–2000',durationMinutes:150,ratings:[1600,1700,1800,1900,2000]},
{id:'2000-2400',label:'2000–2400',durationMinutes:180,ratings:[2000,2100,2200,2300,2400]}
];
const EARLY={'Implementation & Basics':.05,Strings:.15,Mathematics:.3,'Greedy & Constructive':.4,Other:.5,'Games & Miscellaneous':.55,'Search & Techniques':.55,'Data Structures':.7,Graphs:.8,'Dynamic Programming':.9};
const damp={'Implementation & Basics':.3,Strings:.6};
function rng(seed){return()=>{let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
const raw=JSON.parse(readFileSync(cataloguePath,'utf8'));
const catalogue=(Array.isArray(raw)?raw:raw.problems||[]).filter(p=>p.contestId&&Number.isFinite(p.rating)&&!(p.tags||[]).includes('interactive'));
if(!catalogue.length)throw new Error('Catalogue has no rated, non-interactive problems: '+cataloguePath);
const byRating=new Map();
for(const p of catalogue){if(!byRating.has(p.rating))byRating.set(p.rating,[]);byRating.get(p.rating).push(p);}
for(const list of byRating.values())list.sort((a,b)=>(b.catalogueSolvedCount||0)-(a.catalogueSolvedCount||0)||(a.name||'').localeCompare(b.name||''));
const random=rng(1729);
function buildContest(band,used,seriesUse){
 const n=band.ratings.length,high=band.ratings[0]>=1600;
 for(let attempt=0;attempt<500;attempt++){
  const picked=[],contestIds=new Set(),topicUse={};let failed=false;
  for(let i=0;i<n;i++){
   const rating=band.ratings[i],position=i/(n-1),pool=byRating.get(rating)||[];
   const topics=[...new Set(pool.flatMap(p=>categoriesFor(p.tags)))];
   const weights=topics.map(topic=>{
    if((topicUse[topic]||0)>=2)return 0;
    const free=pool.filter(p=>!used.has(p.contestId+'-'+p.index)&&!contestIds.has(p.contestId)&&categoriesFor(p.tags).includes(topic));
    if(!free.length)return 0;
    let w=Math.exp(-Math.pow((position-(EARLY[topic]??.5))/.28,2))+.04;
    if(high&&damp[topic])w*=damp[topic];
    w*=Math.pow(pool.filter(p=>categoriesFor(p.tags).includes(topic)).length,.6);
    w/=1+.5*(seriesUse[topic]||0);return w;
   });
   const total=weights.reduce((a,b)=>a+b,0);if(!total){failed=true;break;}
   let r=random()*total,topic=topics[topics.length-1];
   for(let j=0;j<topics.length;j++){r-=weights[j];if(r<=0){topic=topics[j];break;}}
   const free=pool.filter(p=>!used.has(p.contestId+'-'+p.index)&&!contestIds.has(p.contestId)&&categoriesFor(p.tags).includes(topic));
   const problem=free[Math.floor(Math.pow(random(),2)*Math.min(free.length,60))];
   if(!problem){failed=true;break;}
   picked.push({problem,topic});contestIds.add(problem.contestId);topicUse[topic]=(topicUse[topic]||0)+1;
  }
  if(failed||Object.keys(topicUse).length<Math.min(4,n))continue;
  for(const x of picked){used.add(x.problem.contestId+'-'+x.problem.index);seriesUse[x.topic]=(seriesUse[x.topic]||0)+1;}
  return picked.map(({problem:p,topic})=>({contestId:p.contestId,index:p.index,name:p.name,rating:p.rating,tags:p.tags||[],topic}));
 }
 const inventory=band.ratings.map(r=>r+': '+(byRating.get(r)||[]).length).join(', ');
 throw new Error('Could not build '+band.id+' after 500 attempts. Available rated inventory: '+inventory+'. Refresh the catalogue or adjust the band.');
}
const bands=BANDS.map(band=>{
 const used=new Set(),seriesUse={},contests=[];
 for(let i=1;i<=8;i++)contests.push({id:band.id+'-'+i,title:'Virtual Contest '+i,problems:buildContest(band,used,seriesUse)});
 return{id:band.id,label:band.label,durationMinutes:band.durationMinutes,ratings:band.ratings,contests,topicTotals:seriesUse};
});
writeFileSync(outPath,JSON.stringify({generatedAt:new Date().toISOString(),bands})+'\n');
for(const b of bands)console.log(b.label+': '+b.contests.length+' contests, '+b.contests.reduce((s,c)=>s+c.problems.length,0)+' problems');
console.log('Wrote '+outPath);
