async function loadProgress(){
 try{
  const response=await fetch('progress.json',{cache:'no-store'});
  if(!response.ok)throw new Error('unavailable');
  const data=await response.json();
  if(!data.data_available)throw new Error('not yet available');
  for(const [id,key] of [['papers','papers_in_vault'],['runs','recorded_runs'],['complete','complete_runs']]){
   if(!Number.isSafeInteger(data[key])||data[key]<0)throw new Error('invalid snapshot');
   document.getElementById(id).textContent=data[key].toLocaleString();
  }
  document.getElementById('automation-status').textContent=data.complete_runs>0?'successful runs verified':'no successful runs recorded';
  const evidence=data.evidence_as_of?new Date(data.evidence_as_of).toLocaleString():'No completed run recorded';
  document.getElementById('data-status').textContent=`Evidence snapshot: ${evidence}. Exported: ${new Date(data.generated_at).toLocaleString()}. Partial runs: ${data.partial_runs}; failed runs: ${data.failed_runs}. This is not a live research feed.`;
 }catch{
  document.getElementById('automation-status').textContent='statistics unavailable';
  for(const id of ['papers','runs','complete'])document.getElementById(id).textContent='—';
  document.getElementById('data-status').textContent='Verified aggregate statistics are not available in this build. No research activity has been assumed.';
 }
}
loadProgress();
