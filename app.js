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
  for(const id of ['papers','runs','complete'])document.getElementById(id).textContent='—';
  document.getElementById('data-status').textContent='Research statistics are temporarily unavailable.';
  document.getElementById('update-title').textContent='The search begins.';
  document.getElementById('update-body').textContent='Follow The Dennis Initiative as we build our scientific evidence collection.';
 }finally{loadingProgress=false;}
}
loadProgress();
setInterval(()=>{if(!document.hidden)loadProgress();},60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)loadProgress();});
