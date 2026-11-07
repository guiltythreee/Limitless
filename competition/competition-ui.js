(function(){
  'use strict';
  var links=[].slice.call(document.querySelectorAll('[data-screen-link]'));
  var screens=[].slice.call(document.querySelectorAll('[data-screen]'));
  function activate(name,updateHash){
    var settingsCard=document.getElementById('settings');
    if(settingsCard)settingsCard.open=name==='settings';
    screens.forEach(function(node){node.hidden=node.getAttribute('data-screen')!==name;});
    links.forEach(function(link){var active=link.getAttribute('data-screen-link')===name;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    if(updateHash){var target=links.find(function(link){return link.getAttribute('data-screen-link')===name;});if(target)history.replaceState(null,'',target.getAttribute('href'));}
    window.scrollTo({top:0,behavior:'smooth'});
  }
  links.forEach(function(link){link.addEventListener('click',function(event){event.preventDefault();activate(link.getAttribute('data-screen-link'),true);});});
  var initial=(location.hash==='#roadmap'?'roadmap':location.hash==='#problem-review'?'problems':location.hash==='#mock-tests'?'mocks':location.hash==='#resources'?'resources':location.hash==='#settings'?'settings':'overview');
  activate(initial,false);

  var overviewGrid=document.querySelector('.overview-grid');
  var hero=document.querySelector('.competition-heading');
  if(overviewGrid&&hero)hero.appendChild(overviewGrid);
  var todayPanel=document.createElement('section');todayPanel.className='today-panel';todayPanel.setAttribute('data-screen','overview');
  screens.push(todayPanel);
  todayPanel.innerHTML='<div class="card-label">TODAY / THIS WEEK</div><h2 id="today-week-title">This week</h2><div id="today-task-list"></div><a href="#roadmap" class="today-roadmap-link" data-screen-link="roadmap">Open full roadmap →</a>';
  if(overviewGrid)overviewGrid.parentNode.insertBefore(todayPanel,overviewGrid.nextSibling);
  todayPanel.hidden=initial!=='overview';
  function renderToday(){
    var weekNode=document.querySelector('.week-card[open]')||document.querySelector('.week-card');
    var title=document.getElementById('today-week-title'),list=document.getElementById('today-task-list');
    if(!weekNode||!list)return;
    var weekLabel=weekNode.querySelector('.week-title');
    if(title)title.textContent=(document.getElementById('current-week')||{}).textContent+' · '+(weekLabel?weekLabel.textContent:'Foundations');
    var rows=[].slice.call(weekNode.querySelectorAll('.roadmap-topic')).slice(0,3);
    list.innerHTML=rows.map(function(row){var name=row.querySelector('strong'),subject=row.querySelector('small');return '<div class="today-task-row"><span class="today-check">○</span><strong>'+ (name?name.textContent:'') +'</strong><span class="today-subject">'+(subject?subject.textContent:'')+'</span></div>';}).join('');
  }
  var roadmapJump=todayPanel.querySelector('[data-screen-link="roadmap"]');
  if(roadmapJump)roadmapJump.addEventListener('click',function(event){event.preventDefault();activate('roadmap',true);});
  renderToday();
  var roadmap=document.getElementById('week-list');if(roadmap){var roadmapObserver=new MutationObserver(renderToday);roadmapObserver.observe(roadmap,{childList:true,subtree:true,attributes:true,attributeFilter:['open']});}
  var campaignMeta=document.querySelector('.campaign-meta');
  var settingsContent=document.querySelector('.settings-card-content');
  if(campaignMeta&&settingsContent)settingsContent.insertBefore(campaignMeta,settingsContent.firstChild);
  var problemForm=document.getElementById('problem-form');
  var mockForm=document.getElementById('mock-form');
  function addAction(section,form,label){
    if(!section||!form)return;
    var heading=section.querySelector('.section-heading-row');
    var button=document.createElement('button');button.type='button';button.className='action-button';button.textContent=label;
    heading.appendChild(button);
    var details=document.createElement('details');details.className='entry-drawer';
    var summary=document.createElement('summary');summary.textContent=label;
    details.appendChild(summary);details.appendChild(form);section.insertBefore(details,section.querySelector(form.id==='problem-form'?'#problem-history':'#mock-history'));
    button.addEventListener('click',function(){details.open=!details.open;if(details.open)details.scrollIntoView({behavior:'smooth',block:'nearest'});});
  }
  addAction(document.getElementById('problem-review'),problemForm,'Log problem');
  addAction(document.getElementById('mock-tests'),mockForm,'Add test');
  function compactForm(form,keepIds,label){
    if(!form)return;
    var labels=[].slice.call(form.querySelectorAll(':scope > label'));
    var more=document.createElement('details');more.className='form-more-details';
    var summary=document.createElement('summary');summary.textContent=label;more.appendChild(summary);
    labels.forEach(function(field){
      var control=field.querySelector('input,select,textarea');
      if(control&&keepIds.indexOf(control.id)!==-1)return;
      if(control&&control.id==='problem-observation')control.required=false;
      more.appendChild(field);
    });
    var submit=form.querySelector('button[type="submit"]');
    form.insertBefore(more,submit);
  }
  compactForm(problemForm,['problem-name','problem-outcome','problem-time'],'More details');
  compactForm(mockForm,['mock-date','mock-one-score','mock-two-score','mock-note'],'More details');

  /* Live Codeforces problem explorer with local review status. */
  var problemSection=document.getElementById('problem-review');
  var historyNode=document.getElementById('problem-history');
  var explorer=document.createElement('section');explorer.className='problem-explorer';
  explorer.innerHTML='<div class="explorer-toolbar"><input id="cf-search" type="search" placeholder="Search problems..." aria-label="Search problems"><select id="cf-rating" aria-label="Filter by rating"><option value="">Any rating</option><option value="800-1200">800–1200</option><option value="800">800</option><option value="900">900</option><option value="1000">1000</option><option value="1100">1100</option><option value="1200">1200</option></select><select id="cf-tag" aria-label="Filter by tag"><option value="">All tags</option></select><button type="button" id="cf-advanced" class="action-button">Advanced</button></div><div id="cf-problems" class="cf-problem-list"><p>Loading Codeforces problems…</p></div><div class="cf-pagination"><button type="button" id="cf-prev" class="action-button">‹ Prev</button><span id="cf-page">Page 1</span><button type="button" id="cf-next" class="action-button">Next ›</button></div>';
  if(problemSection&&historyNode)problemSection.insertBefore(explorer,historyNode);
  var cfItems=[],cfPage=0,cfTags=[],cfAdvanced=false;
  function escapeHTML(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function localProblemState(problem){
    var id=String(problem.contestId||'')+(problem.index||'');
    var entries=[].slice.call(document.querySelectorAll('#problem-history .problem-entry'));
    var found=entries.find(function(entry){var node=entry.querySelector('strong');return node&&(node.textContent===id||node.textContent===problem.name||node.textContent===id+' · '+problem.name);});
    if(!found)return 'Unsolved';
    var result=found.getAttribute('data-result');
    return result==='independent'?'Solved':result==='unsolved'?'Unsolved':'Reviewed';
  }
  function renderCF(){
    var q=(document.getElementById('cf-search').value||'').toLowerCase();
    var rating=document.getElementById('cf-rating').value,tag=document.getElementById('cf-tag').value;
    var filtered=cfItems.filter(function(p){
      var id=String(p.contestId||'')+(p.index||'');
      if(q&&!(p.name+' '+id).toLowerCase().includes(q))return false;
      if(rating==='800-1200'&&!(p.rating>=800&&p.rating<=1200))return false;
      if(rating&&rating!=='800-1200'&&Number(p.rating)!==Number(rating))return false;
      if(tag&&p.tags.indexOf(tag)<0)return false;
      return true;
    });
    var pageItems=filtered.slice(cfPage*20,cfPage*20+20);
    document.getElementById('cf-problems').innerHTML=pageItems.length?pageItems.map(function(p){
      var id=String(p.contestId||'')+(p.index||'');
      var tags=p.tags||[];
      var tagHtml=cfAdvanced?'<details class="cf-tags"><summary>Show tags</summary><span>'+tags.map(function(t){return '<i>'+escapeHTML(t)+'</i>';}).join(' ')+'</span></details>':'';
      return '<article class="cf-problem-row"><a class="cf-problem-name" href="https://codeforces.com/problemset/problem/'+encodeURIComponent(p.contestId)+'/'+encodeURIComponent(p.index)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(p.name)+'</a><span class="cf-rating">'+(p.rating||'—')+'</span><span class="cf-status '+(localProblemState(p)==='Solved'?'is-solved':'')+'">'+localProblemState(p)+'</span>'+tagHtml+'<button type="button" class="action-button" data-cf-log="'+escapeHTML(id)+'">Log</button></article>';
    }).join(''):'<p class="empty-state">No problems match these filters.</p>';
    document.getElementById('cf-page').textContent='Page '+(cfPage+1)+' · '+filtered.length+' problems';
    document.getElementById('cf-prev').disabled=cfPage===0;
    document.getElementById('cf-next').disabled=(cfPage+1)*20>=filtered.length;
    document.querySelectorAll('[data-cf-log]').forEach(function(button){
      button.addEventListener('click',function(){
        var p=pageItems.find(function(item){return String(item.contestId||'')+(item.index||'')===button.dataset.cfLog;});
        if(!p)return;
        var form=document.getElementById('problem-form'),drawer=form&&form.closest('.entry-drawer');
        document.getElementById('problem-name').value=String(p.contestId||'')+(p.index||'')+' · '+p.name;
        document.getElementById('problem-difficulty').value=p.rating||'';
        var tags=(p.tags||[]).join(' ');
        document.getElementById('problem-concept').value=tags;
        if(drawer)drawer.open=true;
        form.scrollIntoView({behavior:'smooth',block:'center'});
      });
    });
  }
  function loadCF(){
    fetch('https://codeforces.com/api/problemset.problems')
      .then(function(response){if(!response.ok)throw new Error('Codeforces is unavailable');return response.json();})
      .then(function(data){
        if(data.status!=='OK')throw new Error('Codeforces did not return a problem set');
        cfItems=(data.result.problems||[]).filter(function(p){return !!p.name;});
        cfTags=Array.from(new Set(cfItems.reduce(function(all,p){return all.concat(p.tags||[]);},[]))).sort();
        var tagSelect=document.getElementById('cf-tag');
        tagSelect.innerHTML='<option value="">All tags</option>'+cfTags.map(function(t){return '<option value="'+escapeHTML(t)+'">'+escapeHTML(t)+'</option>';}).join('');
        renderCF();
      }).catch(function(){document.getElementById('cf-problems').innerHTML='<p class="empty-state">Could not load Codeforces right now. You can still log a problem manually below.</p>';});
  }
  ['cf-search','cf-rating','cf-tag'].forEach(function(id){document.getElementById(id).addEventListener(id==='cf-search'?'input':'change',function(){cfPage=0;renderCF();});});
  document.getElementById('cf-advanced').addEventListener('click',function(){cfAdvanced=!cfAdvanced;this.textContent=cfAdvanced?'Hide tags':'Advanced';renderCF();});
  document.getElementById('cf-prev').addEventListener('click',function(){cfPage=Math.max(0,cfPage-1);renderCF();});
  document.getElementById('cf-next').addEventListener('click',function(){cfPage++;renderCF();});
  loadCF();
  var activity=document.createElement('section');activity.className='recent-activity';activity.setAttribute('data-screen','overview');
  activity.innerHTML='<div class="card-label">RECENT ACTIVITY</div><h2>Recent problem reviews</h2><div id="overview-activity"></div>';
  screens.push(activity);activity.hidden=initial!=='overview';
  var subject=document.getElementById('subjects');subject.parentNode.insertBefore(activity,subject.nextSibling);
  function refreshActivity(){
    var target=document.getElementById('overview-activity');if(!target)return;
    var entries=[].slice.call(document.querySelectorAll('#problem-history .problem-entry')).slice(0,3);
    target.innerHTML=entries.length?entries.map(function(entry){return '<div class="activity-row">'+entry.querySelector('.problem-entry-head strong').textContent+'<span>'+entry.querySelector('.problem-entry-head span').textContent+'</span></div>';}).join(''):'<p>Nothing yet. Open Problems to log your first review.</p>';
  }
  refreshActivity();
  var observer=new MutationObserver(function(){refreshActivity();if(cfItems.length)renderCF();});var history=document.getElementById('problem-history');if(history)observer.observe(history,{childList:true,subtree:true});
  var week=document.getElementById('current-week');
  if(week){var current=Number((week.textContent.match(/\\d+/)||[])[0]||1)-1;var cards=[].slice.call(document.querySelectorAll('.week-card'));cards.forEach(function(card,index){card.open=index===current;});renderToday();}
})();