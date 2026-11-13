let loadingProgress=false;
async function loadProgress(){
 if(loadingProgress)return;
 loadingProgress=true;
 try{
  const response=await fetch('progress.json?updated='+Date.now(),{cache:'no-store'});
  if(!response.ok)throw new Error('unavailable');
  const data=await response.json();
  if(!data.data_available)throw new Error('not yet available');
  for(const [id,key] of [['papers','papers_in_vault'],['runs','recorded_runs'],['complete','complete_runs']]){
   if(!Number.isSafeInteger(data[key])||data[key]<0)throw new Error('invalid snapshot');
  }
  const evidence=new Date(data.evidence_as_of);
  if(!Number.isFinite(evidence.getTime()))throw new Error('invalid date');
  for(const [id,key] of [['papers','papers_in_vault'],['runs','recorded_runs'],['complete','complete_runs']]){
   document.getElementById(id).textContent=data[key].toLocaleString();
  }
  document.getElementById('automation-status').textContent=data.complete_runs>0?'Research underway':'Research beginning';
  document.getElementById('data-status').textContent='Research updated: '+evidence.toLocaleString()+'. Counts reflect collected publications and recorded scans, not verified discoveries. This page checks for updates every minute.';
  document.getElementById('update-title').textContent=data.complete_runs>0?'Building the evidence collection':'The search begins.';
  document.getElementById('update-body').textContent='The Dennis Initiative has collected '+data.papers_in_vault.toLocaleString()+' publication records across '+data.complete_runs.toLocaleString()+' completed research scans. These records provide a foundation for investigating scientific questions.';
 }catch{
  document.getElementById('automation-status').textContent='Update unavailable';
  // Preserve already verified visible counts during a transient refresh failure.
  document.getElementById('data-status').textContent='A fresh statistics check is temporarily unavailable. Any counts already displayed are from the last successful check.';
  document.getElementById('update-title').textContent='The search begins.';
  document.getElementById('update-body').textContent='Follow The Dennis Initiative as we build our scientific evidence collection.';
 }finally{loadingProgress=false;}
}
loadProgress();
setInterval(()=>{if(!document.hidden)loadProgress();},60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)loadProgress();});

// Optional founder-approved wording. Only fixed text nodes can change; statistics stay separately validated.
async function loadApprovedWording(){
 try{
  const r=await fetch('content.json?updated='+Date.now(),{cache:'no-store'});if(!r.ok)return;
  const data=await r.json();if(data.schema_version!==1||!data.content||typeof data.content!=='object')return;
  const fields={intro:['.intro',1400],mission_title:['#mission h3',160],mission_story:['#mission .mission-grid > div > p',1400],support:['#support > div > p:not(.eyebrow)',1200],memorial:['#dennis blockquote',1600],roadmap:['#journey .timeline article:last-child p',1200]};
  for(const [key,[selector,max]] of Object.entries(fields)){const value=data.content[key];if(typeof value==='string'&&value.length>=5&&value.length<=max&&!/[<>\x00-\x08]/.test(value)){const target=document.querySelector(selector);if(target)target.textContent=value;}}
 }catch{ /* Keep the published design and wording available on refresh failure. */ }
}
loadApprovedWording();
