(function(){
  'use strict';
  var links=[].slice.call(document.querySelectorAll('[data-screen-link]'));
  var screens=[].slice.call(document.querySelectorAll('[data-screen]'));
  function activate(name,updateHash){
    screens.forEach(function(node){node.hidden=node.getAttribute('data-screen')!==name;});
    links.forEach(function(link){var active=link.getAttribute('data-screen-link')===name;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    if(updateHash){var target=links.find(function(link){return link.getAttribute('data-screen-link')===name;});if(target)history.replaceState(null,'',target.getAttribute('href'));}
    window.scrollTo({top:0,behavior:'smooth'});
  }
  links.forEach(function(link){link.addEventListener('click',function(event){event.preventDefault();activate(link.getAttribute('data-screen-link'),true);});});
  var initial=(location.hash==='#roadmap'?'roadmap':location.hash==='#problem-review'?'problems':location.hash==='#mock-tests'?'mocks':location.hash==='#resources'?'resources':location.hash==='#settings'?'settings':'overview');
  activate(initial,false);
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
  var activity=document.createElement('section');activity.className='recent-activity';activity.setAttribute('data-screen','overview');
  activity.innerHTML='<div class="card-label">RECENT ACTIVITY</div><h2>Recent problem reviews</h2><div id="overview-activity"></div>';
  var subject=document.getElementById('subjects');subject.parentNode.insertBefore(activity,subject.nextSibling);
  function refreshActivity(){
    var target=document.getElementById('overview-activity');if(!target)return;
    var entries=[].slice.call(document.querySelectorAll('#problem-history .problem-entry')).slice(0,3);
    target.innerHTML=entries.length?entries.map(function(entry){return '<div class="activity-row">'+entry.querySelector('.problem-entry-head strong').textContent+'<span>'+entry.querySelector('.problem-entry-head span').textContent+'</span></div>';}).join(''):'<p>Nothing yet. Open Problems to log your first review.</p>';
  }
  refreshActivity();
  var observer=new MutationObserver(refreshActivity);var history=document.getElementById('problem-history');if(history)observer.observe(history,{childList:true,subtree:true});
  var week=document.getElementById('current-week');
  if(week){var current=Number((week.textContent.match(/\\d+/)||[])[0]||1)-1;var cards=[].slice.call(document.querySelectorAll('.week-card'));cards.forEach(function(card,index){card.open=index===current;});}
})();