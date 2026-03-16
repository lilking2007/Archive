// NoteMind popup.js — redesigned UI
const AKEY = 'nm_akey', SKEY = 'nm_settings', TKEY = 'nm_tx', NKEY = 'nm_notes';
const SPK_LETTERS = 'ABCDEFGHIJKLMNOP';
const SPK_COLORS = [0,1,2,3,4,5];

let isRec=false, secs=0, timerInt=null, waveInt=null;
let transcript=[], spkMap={}, spkCol={}, spkCount=0;
let bars=[], notesData=null, currentTab='t1';

document.addEventListener('DOMContentLoaded', async()=>{
  buildWave();
  await loadSettings();
  bindEvents();
  checkServer();
  const saved = await chrome.storage.local.get(TKEY);
  if(saved[TKEY]?.length){ transcript=saved[TKEY]; renderTx(); updateMeta(); }
});

chrome.runtime.onMessage.addListener(msg=>{
  if(msg.type==='TRANSCRIPT_CHUNK') onChunk(msg);
  if(msg.type==='SERVER_STATUS') onServerStatus(msg);
});

function buildWave(){
  const el=document.getElementById('waveEl');
  for(let i=0;i<55;i++){const b=document.createElement('div');b.className='wb';b.style.cssText='height:3px;flex:1';el.appendChild(b);bars.push(b)}
}

function bindEvents(){
  document.getElementById('recBtn').addEventListener('click',toggleRec);
  document.getElementById('clearBtn').addEventListener('click',clearAll);
  document.getElementById('genBtn').addEventListener('click',generateNotes);
  document.getElementById('backBtn').addEventListener('click',()=>showView('main'));
  document.getElementById('exportBtn').addEventListener('click',doExport);
  document.getElementById('settingsBtn').addEventListener('click',()=>{
    const p=document.getElementById('settingsPanel');
    p.style.display=p.style.display==='none'?'block':'none';
  });
  document.getElementById('saveBtn').addEventListener('click',saveSettings);
  document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>switchTab(t.dataset.tab)));
  document.getElementById('srvLink').addEventListener('click',e=>{
    e.preventDefault();
    chrome.tabs.create({url:chrome.runtime.getURL('server_guide.html')});
  });
}

async function loadSettings(){
  const d=await chrome.storage.local.get([AKEY,SKEY]);
  if(d[AKEY]) document.getElementById('anthropicKey').value=d[AKEY];
  if(d[SKEY]){
    const s=d[SKEY];
    if(s.model) document.getElementById('whisperModel').value=s.model;
    if(s.names) document.getElementById('speakerNames').value=s.names;
    if(s.lang) document.getElementById('meetingLang').value=s.lang;
  }
}

async function saveSettings(){
  const key=document.getElementById('anthropicKey').value.trim();
  const settings={model:document.getElementById('whisperModel').value,names:document.getElementById('speakerNames').value,lang:document.getElementById('meetingLang').value};
  await chrome.storage.local.set({[AKEY]:key,[SKEY]:settings});
  const ok=document.getElementById('savedOk');ok.style.display='block';
  setTimeout(()=>ok.style.display='none',1800);
}

async function checkServer(){
  const dot=document.getElementById('srvDot');
  try{
    const ws=new WebSocket('ws://localhost:8765');
    ws.onopen=()=>{dot.className='srv-dot on';document.getElementById('srvWarn').style.display='none';ws.close()};
    ws.onerror=()=>{dot.className='srv-dot off';document.getElementById('srvWarn').style.display='block'};
  }catch{dot.className='srv-dot off'}
  setTimeout(checkServer,12000);
}

function onServerStatus(msg){
  const dot=document.getElementById('srvDot');
  if(msg.status==='connected'){dot.className='srv-dot on';document.getElementById('srvWarn').style.display='none'}
  if(msg.status==='server_offline'){dot.className='srv-dot off';document.getElementById('srvWarn').style.display='block'}
  if(msg.status==='capturing') setStatus('live','transcribing...');
  if(msg.status==='error') setStatus('','error: '+msg.message);
}

async function toggleRec(){ isRec?stopRec():startRec() }

async function startRec(){
  const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
  if(!tab) return;
  const btn=document.getElementById('recBtn');
  btn.querySelector('#recTxt').textContent='Starting...';btn.disabled=true;
  const r=await chrome.runtime.sendMessage({type:'START_CAPTURE',tabId:tab.id});
  btn.disabled=false;
  if(r?.success){
    isRec=true;setStatus('live','recording');
    btn.className='btn-rec live';
    btn.innerHTML='<svg width="10" height="10" viewBox="0 0 10 10" fill="#f87171"><rect x="1" y="1" width="8" height="8" rx="2"/></svg><span id="recTxt">Stop recording</span>';
    startTimer();animateWave(true);
  }else{
    setStatus('','failed to start');
    btn.className='btn-rec idle';
    btn.innerHTML='<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="3.5"/></svg><span id="recTxt">Record tab audio</span>';
  }
}

async function stopRec(){
  await chrome.runtime.sendMessage({type:'STOP_CAPTURE'});
  isRec=false;
  setStatus('done','complete');
  const btn=document.getElementById('recBtn');
  btn.className='btn-rec idle';
  btn.innerHTML='<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="3.5"/></svg><span id="recTxt">Record tab audio</span>';
  stopTimer();animateWave(false);
  if(transcript.length) document.getElementById('genBar').style.display='flex';
}

function setStatus(state, txt){
  const dot=document.getElementById('stDot');
  dot.className='st-dot'+(state?' '+state:'');
  document.getElementById('stTxt').textContent=txt||'ready';
}

function onChunk(msg){
  const {speaker,speakerLabel,text,isFinal}=msg;
  if(speaker && !spkMap[speaker]){
    const names=document.getElementById('speakerNames').value.split(',').map(s=>s.trim()).filter(Boolean);
    spkMap[speaker]=names[spkCount]||`Speaker ${SPK_LETTERS[spkCount]||spkCount+1}`;
    spkCol[speaker]=spkCount%6;
    spkCount++;
    renderSpkRow();
  }
  if(isFinal && text?.trim()){
    transcript.push({speaker:speaker||'_',label:spkMap[speaker]||speakerLabel||'Speaker',col:spkCol[speaker]||0,text:text.trim(),ts:Date.now()});
    chrome.storage.local.set({[TKEY]:transcript});
    renderTx();updateMeta();
  }
}

function renderSpkRow(){
  const row=document.getElementById('spkRow');
  row.style.display='flex';
  row.innerHTML=Object.entries(spkMap).map(([id,label])=>`<div class="spk-pill sp${spkCol[id]}">${esc(label)}</div>`).join('');
  const cnt=Object.keys(spkMap).length;
  document.getElementById('spkMeta').textContent=`· ${cnt} speaker${cnt!==1?'s':''}`;
}

function renderTx(){
  const el=document.getElementById('txEl');
  if(!transcript.length){el.innerHTML='<div class="tx-ph">Start recording — transcript appears here with speaker labels...</div>';return}
  const grp=[];
  transcript.forEach(t=>{
    const last=grp[grp.length-1];
    if(last&&last.speaker===t.speaker) last.text+=' '+t.text;
    else grp.push({...t});
  });
  el.innerHTML=grp.map(t=>`<div class="tl"><span class="tsp s${t.col}">${esc(t.label)}</span><span class="tt">${esc(t.text)}</span></div>`).join('');
  el.scrollTop=el.scrollHeight;
}

function updateMeta(){
  const wc=transcript.reduce((a,t)=>a+t.text.split(/\s+/).length,0);
  document.getElementById('wcLabel').textContent=`${wc} word${wc!==1?'s':''}`;
  if(wc>10) document.getElementById('genBar').style.display='flex';
}

async function generateNotes(){
  const d=await chrome.storage.local.get(AKEY);
  const apiKey=d[AKEY];
  if(!apiKey){alert('Add your Anthropic API key in Settings first.');document.getElementById('settingsPanel').style.display='block';return}
  showView('notes');
  const btn=document.getElementById('genBtn');btn.disabled=true;
  document.getElementById('noteTitle').textContent='Generating...';
  document.getElementById('t1').innerHTML='<div class="loading-row"><div class="ld"></div><div class="ld"></div><div class="ld"></div><span>Claude is analysing your meeting...</span></div>';
  ['t2','t3'].forEach(id=>document.getElementById(id).innerHTML='');
  switchTab('t1');

  const txText=transcript.map(t=>`${t.label}: ${t.text}`).join('\n');
  const speakers=[...new Set(transcript.map(t=>t.label))];
  const prompt=`You are a professional meeting note-taker. Analyse this transcript carefully.

SPEAKERS: ${speakers.join(', ')}

TRANSCRIPT:
"""
${txText}
"""

Return ONLY valid JSON (no markdown, no fences):
{
  "title": "Brief descriptive meeting title",
  "summary": "Detailed 3-5 sentence summary covering context, discussion, and outcomes",
  "keyPoints": ["up to 8 key points"],
  "actionItems": ["specific tasks with owner if mentioned"],
  "decisions": ["decisions made or agreed upon"],
  "topics": ["3-6 topic tags"],
  "sentiment": "positive | neutral | mixed | tense",
  "speakerSummaries": {"Speaker Name": "1-2 sentence contribution summary"}
}`;

  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1500,messages:[{role:'user',content:prompt}]})
    });
    const data=await res.json();
    const raw=data.content.map(c=>c.text||'').join('');
    notesData=JSON.parse(raw.replace(/```json|```/g,'').trim());
    notesData.rawTx=txText;notesData.ts=new Date().toLocaleString();
    await chrome.storage.local.set({[NKEY]:notesData});
    renderNotes(notesData);
  }catch(e){
    document.getElementById('t1').innerHTML=`<div style="color:var(--red);font-size:12px;padding:1rem">Error: ${esc(e.message)}</div>`;
  }
  btn.disabled=false;
}

function renderNotes(d){
  document.getElementById('noteTitle').textContent=d.title||'Meeting notes';

  const sentClass=d.sentiment==='positive'?'pos':d.sentiment==='tense'||d.sentiment==='negative'?'neg':'';
  const tags=(d.topics||[]).map(t=>`<span class="ntag">${esc(t)}</span>`).join('')+(d.sentiment?`<span class="ntag ${sentClass}">${esc(d.sentiment)}</span>`:'');

  // Tab 1: Summary + key points
  document.getElementById('t1').innerHTML=`
    <div class="n-tags">${tags}</div>
    <div class="nsec"><div class="nsl">summary</div><p class="nsumm">${esc(d.summary)}</p></div>
    ${d.keyPoints?.length?`<div class="nsec"><div class="nsl">key points</div><ul class="nlist">${d.keyPoints.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>`:''}
    <div class="nfooter">${d.ts} · ${transcript.length} segments · ${Object.keys(spkMap).length} speakers</div>`;

  // Tab 2: Speakers
  const spkHTML=(d.speakerSummaries&&Object.keys(d.speakerSummaries).length)
    ?`<div class="spk-cards">${Object.entries(d.speakerSummaries).map(([name,sum],i)=>
        `<div class="spk-card"><span class="spk-card-name tsp s${i%6}" style="display:inline-block;padding:1px 8px;border-radius:3px">${esc(name)}</span><p class="spk-card-text">${esc(sum)}</p></div>`
      ).join('')}</div>`
    :'<div style="font-size:12px;color:var(--t3);padding:1rem 0">No speaker data available</div>';
  document.getElementById('t2').innerHTML=spkHTML;

  // Tab 3: Actions + decisions
  const actHTML=(d.actionItems?.length?`<div class="nsec"><div class="nsl">action items</div><ul class="nlist">${d.actionItems.map(a=>`<li><span class="atag">todo</span>${esc(a)}</li>`).join('')}</ul></div>`:'')
    +(d.decisions?.length?`<div class="nsec"><div class="nsl">decisions</div><ul class="nlist">${d.decisions.map(dec=>`<li><span class="dtag">decided</span>${esc(dec)}</li>`).join('')}</ul></div>`:'')
    ||'<div style="font-size:12px;color:var(--t3);padding:1rem 0">No actions or decisions recorded</div>';
  document.getElementById('t3').innerHTML=actHTML;
}

function switchTab(id){
  document.querySelectorAll('.tab').forEach(t=>{t.classList.toggle('active',t.dataset.tab===id)});
  ['t1','t2','t3'].forEach(t=>{document.getElementById(t).style.display=t===id?'block':'none'});
  currentTab=id;
}

function showView(view){
  document.getElementById('mainView').style.display=view==='main'?'block':'none';
  document.getElementById('notesView').style.display=view==='notes'?'block':'none';
}

function clearAll(){
  if(isRec) stopRec();
  transcript=[];spkMap={};spkCol={};spkCount=0;secs=0;notesData=null;
  document.getElementById('timerEl').textContent='00:00';
  document.getElementById('spkRow').style.display='none';
  document.getElementById('genBar').style.display='none';
  setStatus('','ready');renderTx();
  chrome.storage.local.remove([TKEY,NKEY]);
}

async function doExport(){
  const d=notesData||(await chrome.storage.local.get(NKEY))[NKEY];
  if(!d) return;
  let txt=`MEETING NOTES — ${d.title||'Untitled'}\n${d.ts}\n${'─'.repeat(50)}\n\nSUMMARY\n${d.summary}\n\n`;
  if(d.keyPoints?.length) txt+=`KEY POINTS\n${d.keyPoints.map((p,i)=>`${i+1}. ${p}`).join('\n')}\n\n`;
  if(d.actionItems?.length) txt+=`ACTION ITEMS\n${d.actionItems.map(a=>`[ ] ${a}`).join('\n')}\n\n`;
  if(d.decisions?.length) txt+=`DECISIONS\n${d.decisions.map(dec=>`• ${dec}`).join('\n')}\n\n`;
  if(d.speakerSummaries) txt+=`SPEAKERS\n${Object.entries(d.speakerSummaries).map(([n,s])=>`${n}: ${s}`).join('\n')}\n\n`;
  txt+=`FULL TRANSCRIPT\n${'─'.repeat(30)}\n${d.rawTx||''}`;
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));
  a.download=`notemind-${Date.now()}.txt`;a.click();
}

function startTimer(){timerInt=setInterval(()=>{secs++;const m=String(Math.floor(secs/60)).padStart(2,'0');const s=String(secs%60).padStart(2,'0');document.getElementById('timerEl').textContent=`${m}:${s}`},1000)}
function stopTimer(){clearInterval(timerInt)}
function animateWave(on){
  if(waveInt)clearInterval(waveInt);
  if(!on){bars.forEach(b=>{b.style.height='3px';b.className='wb'});return}
  waveInt=setInterval(()=>bars.forEach(b=>{b.style.height=(Math.random()*22+2)+'px';b.className='wb on'}),85);
}
function esc(str){if(!str)return '';return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
