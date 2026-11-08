(function () {
  'use strict';
  const STORAGE = 'limitless.codeforces.virtual-contests.v1';
  const $ = id => document.getElementById(id);
  const state = { bands: [], bandId: null, openId: null, saved: {}, timer: null };
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function readSaved() { try { const data=JSON.parse(localStorage.getItem(STORAGE)||'{}'); state.saved=data&&typeof data==='object'?data:{}; } catch (_) { state.saved={}; } }
  function persist() { try { localStorage.setItem(STORAGE,JSON.stringify(state.saved)); } catch (_) {} }
  const key=p=>p.contestId+p.index, letter=i=>String.fromCharCode(65+i);
  const currentBand=()=>state.bands.find(b=>b.id===state.bandId)||state.bands[0];
  function findContest(id) { for(const band of state.bands){const contest=band.contests.find(c=>c.id===id);if(contest)return{band,contest};}return null; }
  function formatClock(ms) { const t=Math.max(0,Math.floor(ms/1000)),h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=t%60;return(h?h+':'+String(m).padStart(2,'0'):String(m))+':'+String(s).padStart(2,'0'); }
  function settle(id,band) { const rec=state.saved[id];if(rec&&rec.startedAt&&!rec.finishedAt&&Date.now()>=rec.startedAt+band.durationMinutes*60000){rec.finishedAt=rec.startedAt+band.durationMinutes*60000;persist();}return state.saved[id]||null; }
  const phaseOf=rec=>!rec||!rec.startedAt?'new':rec.finishedAt?'done':'live';
  const solvedCount=rec=>Object.keys((rec&&rec.solved)||{}).length;
  const penalty=rec=>Object.values((rec&&rec.solved)||{}).reduce((a,b)=>a+b,0);
  function renderBandSelect(){ $('cf-vc-band').innerHTML=state.bands.map(b=>'<option value="'+esc(b.id)+'">'+esc(b.label)+'</option>').join('');$('cf-vc-band').value=state.bandId; }
  function renderList(){
    const band=currentBand();
    $('cf-vc-list').innerHTML=band.contests.map(contest=>{
      const rec=settle(contest.id,band),phase=phaseOf(rec),solved=solvedCount(rec);
      const chip=phase==='new'?'Not started':(phase==='live'?'In progress':'Finished')+' · '+solved+'/'+contest.problems.length+' solved';
      return '<article class="cf-problem-card cf-vc-card"><div><strong class="cf-vc-title">'+esc(contest.title)+'</strong><div class="cf-problem-meta"><span class="cf-chip rating">'+band.durationMinutes+' min</span><span class="cf-chip">'+contest.problems.length+' problems</span><span class="cf-chip '+(phase==='done'?'solved':'')+'">'+chip+'</span></div></div><button class="action-button" type="button" data-open="'+esc(contest.id)+'">'+(phase==='new'?'Open':phase==='live'?'Resume':'Review')+'</button></article>';
    }).join('');
    $('cf-vc-status').textContent=band.label+' · '+band.contests.length+' fixed contests · '+band.durationMinutes+' minutes each · problem ratings: '+band.ratings.join(', ')+'.';
  }
  function problemRow(problem,index,rec,phase){
    const k=key(problem),solvedAt=rec&&rec.solved?rec.solved[k]:undefined,started=phase!=='new';
    const isGym=Number(problem.contestId)>=100000;
    const url='https://codeforces.com/'+(isGym?'gym/'+problem.contestId+'/problem/':'problemset/problem/'+problem.contestId+'/')+encodeURIComponent(problem.index);
    const title=started?'<a class="cf-problem-title" href="'+url+'" target="_blank" rel="noopener noreferrer">'+esc(problem.name)+' ↗</a>':'<span class="cf-problem-title">Locked until you start the contest</span>';
    const chips=(phase==='done'?'<span class="cf-chip rating">'+problem.rating+'</span><span class="cf-chip">'+esc(problem.topic)+'</span>':'')+(solvedAt!=null?'<span class="cf-chip solved">Solved at '+solvedAt+' min</span>':'');
    const action=phase==='live'?'<button class="cf-save-problem" type="button" data-solve="'+esc(k)+'" aria-pressed="'+(solvedAt!=null)+'">'+(solvedAt!=null?'✓ Solved · Undo':'Mark solved')+'</button>':'';
    return '<article class="cf-problem-card"><div><span class="cf-vc-letter">'+letter(index)+'</span> '+title+(chips?'<div class="cf-problem-meta">'+chips+'</div>':'')+'</div><div class="cf-problem-right">'+action+'</div></article>';
  }
  function renderContest(){
    const found=findContest(state.openId);if(!found)return closeContest();
    const {band,contest}=found,rec=settle(contest.id,band),phase=phaseOf(rec);let header;
    if(phase==='new')header='<p class="cf-vc-note">'+contest.problems.length+' problems · '+band.durationMinutes+' minutes. Names unlock when you start; ratings and topics are revealed when the contest ends.</p><button class="action-button cf-vc-primary" type="button" data-action="start">Start contest</button>';
    else if(phase==='live')header='<p class="cf-vc-clock" id="cf-vc-clock" role="timer"></p><button class="action-button" type="button" data-action="finish">Finish now</button>';
    else header='<p class="cf-vc-note"><strong>Finished:</strong> '+solvedCount(rec)+'/'+contest.problems.length+' solved · recorded solve-time total '+penalty(rec)+' min.</p><button class="action-button" type="button" data-action="reset">Reset contest</button>';
    $('cf-vc-contest').innerHTML='<div class="cf-vc-contest-head"><button class="action-button" type="button" data-action="back">← All contests</button><h3>'+esc(contest.title)+' · '+esc(band.label)+'</h3></div><div class="cf-vc-controls">'+header+'</div><div class="cf-problem-list">'+contest.problems.map((p,i)=>problemRow(p,i,rec,phase)).join('')+'</div>';
    $('cf-vc-list-view').hidden=true;$('cf-vc-contest').hidden=false;clearInterval(state.timer);if(phase==='live'){tick();state.timer=setInterval(tick,1000);}
  }
  function tick(){const found=findContest(state.openId);if(!found)return;const rec=settle(found.contest.id,found.band);if(phaseOf(rec)!=='live'){renderContest();return;}const remaining=rec.startedAt+found.band.durationMinutes*60000-Date.now(),clock=$('cf-vc-clock');if(clock)clock.textContent='Time left '+formatClock(remaining)+' · '+solvedCount(rec)+'/'+found.contest.problems.length+' solved';}
  function openContest(id){state.openId=id;renderContest();}
  function closeContest(){clearInterval(state.timer);state.openId=null;$('cf-vc-contest').hidden=true;$('cf-vc-list-view').hidden=false;renderList();}
  function onClick(event){
    const target=event.target.closest('[data-open],[data-solve],[data-action]');if(!target)return;
    if(target.dataset.open)return openContest(target.dataset.open);
    const found=findContest(state.openId);if(!found)return;
    const id=found.contest.id,rec=state.saved[id];
    if(target.dataset.solve&&rec&&phaseOf(settle(id,found.band))==='live'){rec.solved=rec.solved||{};if(rec.solved[target.dataset.solve]!=null)delete rec.solved[target.dataset.solve];else rec.solved[target.dataset.solve]=Math.max(0,Math.floor((Date.now()-rec.startedAt)/60000));persist();renderContest();}
    else if(target.dataset.action==='start'){state.saved[id]={startedAt:Date.now(),finishedAt:null,solved:{}};persist();renderContest();}
    else if(target.dataset.action==='finish'){if(rec&&window.confirm('Finish this contest now? Ratings and topics will be revealed.')){rec.finishedAt=Date.now();persist();renderContest();}}
    else if(target.dataset.action==='reset'){if(window.confirm('Reset this contest? Your result will be cleared.')){delete state.saved[id];persist();renderContest();}}
    else if(target.dataset.action==='back')closeContest();
  }
  async function init(){
    if(!$('cf-vc-list'))return;readSaved();$('cf-vc-section').addEventListener('click',onClick);
    try{const response=await fetch('./contests.json',{cache:'no-cache'});if(!response.ok)throw new Error('missing');const data=await response.json();state.bands=Array.isArray(data.bands)?data.bands.filter(b=>b&&Array.isArray(b.contests)&&b.contests.length):[];if(!state.bands.length)throw new Error('empty');}
    catch(_){$('cf-vc-status').textContent='Virtual contests are not published yet. Build the catalogue and contest set with the two scripts in the repository README.';$('cf-vc-band').disabled=true;return;}
    state.bandId=state.bands[0].id;renderBandSelect();renderList();$('cf-vc-band').addEventListener('change',()=>{state.bandId=$('cf-vc-band').value;renderList();});
  }
  init();
})();
