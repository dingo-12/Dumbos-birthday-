const questions = [
  {q:"What's that one word that I hate the most?", options:["Okay","Banana","Hmm","Castor oil"], answer:2},
  {q:"What subreddit’s post did I send you in my DM for the first time?", options:["r/teensofmahrashtra","r/recluseindia","r/formula1","r/jeeneetards"], answer:1},
  {q:"What do you need to fix about yourself ASAP?", options:["Your habit of drinking less water","SLEEP SCHEDULE","Overspending","Late-night snacking"], answer:1},
  {q:"How many months have passed since we met?", options:["4","6","5.5","5"], answer:2},
  {q:"What did we name this 🙃 emoji?", options:["Bubu","Bibi","Bambi","Bini"], answer:0}
];
let current=0, score=0, chosen=false;
const $=id=>document.getElementById(id);
function show(viewId){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));$(viewId).classList.add('active');window.scrollTo({top:0,behavior:'smooth'});if(viewId==='presentView'){requestAnimationFrame(setupAllScratchCards);}}
function renderQuestion(){const item=questions[current];chosen=false;$('questionCount').textContent=`QUESTION ${current+1} / ${questions.length}`;$('scoreLabel').textContent=`${score} ♡`;$('progressBar').style.width=`${(current+1)/questions.length*100}%`;$('questionText').textContent=item.q;$('feedback').textContent='';$('nextQuestion').classList.add('hidden');$('nextQuestion').textContent=current===questions.length-1?'See your result →':'Next →';$('answers').innerHTML='';item.options.forEach((option,index)=>{const b=document.createElement('button');b.className='answer';b.type='button';b.textContent=`${index+1}.  ${option}`;b.addEventListener('click',()=>choose(index,b));$('answers').appendChild(b);});}
function choose(index,button){if(chosen)return;chosen=true;const correct=index===questions[current].answer;if(correct)score++;document.querySelectorAll('.answer').forEach(b=>b.disabled=true);button.classList.add('selected');$('feedback').textContent=correct?'You remembered! Dingo is impressed ♡':'Not quite, Dumbo. I’ll let you try the next one ♡';$('scoreLabel').textContent=`${score} ♡`;$('nextQuestion').classList.remove('hidden');}
$('nextQuestion').addEventListener('click',()=>{if(current<questions.length-1){current++;renderQuestion();}else{$('finalScore').textContent=`You got ${score} out of ${questions.length}. ♡`;show('resultView');}});
$('enterSite').addEventListener('click',()=>show('homeView'));
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.open)));
document.querySelectorAll('[data-home]').forEach(b=>b.addEventListener('click',()=>show('homeView')));
$('envelope').addEventListener('click',()=>{$('envelope').classList.add('open');$('letter').classList.remove('hidden');});

// Original little birthday tune generated in-browser (no copyrighted recording needed).
let audioContext=null, tuneTimer=null, tuneStep=0;
const melody=[523.25,659.25,783.99,1046.5,783.99,659.25,587.33,698.46,880,1046.5,880,698.46,523.25,659.25,783.99,1046.5];
function playNote(freq,when,duration){const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.setValueAtTime(freq,when);gain.gain.setValueAtTime(0.0001,when);gain.gain.exponentialRampToValueAtTime(.11,when+.025);gain.gain.exponentialRampToValueAtTime(.0001,when+duration);osc.connect(gain);gain.connect(audioContext.destination);osc.start(when);osc.stop(when+duration+.03);}
function startTune(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC){alert('This browser does not support the birthday tune.');return;}audioContext=audioContext||new AC();audioContext.resume();tuneStep=0;const playNext=()=>{if(!audioContext)return;const now=audioContext.currentTime;playNote(melody[tuneStep%melody.length],now,.27);if(tuneStep%4===0)playNote(melody[tuneStep%melody.length]/2,now,.38);tuneStep++;};playNext();tuneTimer=setInterval(playNext,330);$('musicToggle').textContent='♫ Birthday tune on';$('musicToggle').setAttribute('aria-pressed','true');}
function stopTune(){if(tuneTimer)clearInterval(tuneTimer);tuneTimer=null;if(audioContext)audioContext.suspend();$('musicToggle').textContent='♫ Play birthday tune';$('musicToggle').setAttribute('aria-pressed','false');}
$('musicToggle').addEventListener('click',()=>{if(tuneTimer)stopTune();else startTune();});

// Scratch-to-reveal panel. Once enough is scratched away, the cake button unlocks.
const canvas=$('scratchCanvas'),ctx=canvas.getContext('2d');let scratching=false,revealed=false;
function setupScratch(){
  const rect=canvas.getBoundingClientRect();
  if(rect.width<2||rect.height<2)return;
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.round(rect.width*dpr);
  canvas.height=Math.round(rect.height*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const grad=ctx.createLinearGradient(0,0,rect.width,rect.height);
  grad.addColorStop(0,'#9b7448');grad.addColorStop(.45,'#e4c98e');grad.addColorStop(1,'#805735');
  ctx.globalCompositeOperation='source-over';ctx.fillStyle=grad;ctx.fillRect(0,0,rect.width,rect.height);
  ctx.fillStyle='rgba(255,255,255,.34)';
  for(let i=0;i<260;i++){const x=(i*73)%rect.width,y=(i*47)%rect.height;ctx.beginPath();ctx.arc(x,y,((i%4)+.8)*.65,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#fff4d9';ctx.font='600 20px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('SCRATCH HERE ✧',rect.width/2,rect.height/2);
}

function scratchPoint(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
function eraseAt(x,y){ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(x,y,24,0,Math.PI*2);ctx.fill();ctx.globalCompositeOperation='source-over';}
function scratchProgress(){const img=ctx.getImageData(0,0,canvas.width,canvas.height).data;let clear=0;for(let i=3;i<img.length;i+=4)if(img[i]<40)clear++;return clear/(img.length/4);}
function revealCake(){if(revealed)return;revealed=true;canvas.style.opacity='0';canvas.style.pointerEvents='none';$('openCake').disabled=false;$('scratchHint').textContent='Surprise revealed! Now tap the cake button. ♡';}
canvas.addEventListener('pointerdown',e=>{scratching=true;canvas.setPointerCapture(e.pointerId);const p=scratchPoint(e);eraseAt(p.x,p.y);});
canvas.addEventListener('pointermove',e=>{if(!scratching||revealed)return;const p=scratchPoint(e);eraseAt(p.x,p.y);if(scratchProgress()>.30)revealCake();});
['pointerup','pointercancel','lostpointercapture'].forEach(ev=>canvas.addEventListener(ev,()=>scratching=false));

$('openCake').addEventListener('click',()=>show('cakeView'));
renderQuestion();

// Reusable touch-friendly scratch layers for the drawing and bouquet.
function paintScratchLayer(c){const r=c.getBoundingClientRect();if(r.width<2||r.height<2)return;const dpr=Math.min(window.devicePixelRatio||1,2),cx=c.getContext('2d');c.width=Math.round(r.width*dpr);c.height=Math.round(r.height*dpr);cx.setTransform(dpr,0,0,dpr,0,0);const g=cx.createLinearGradient(0,0,r.width,r.height);g.addColorStop(0,'#9b7448');g.addColorStop(.48,'#e4c98e');g.addColorStop(1,'#805735');cx.fillStyle=g;cx.fillRect(0,0,r.width,r.height);cx.fillStyle='rgba(255,255,255,.38)';for(let i=0;i<220;i++){cx.beginPath();cx.arc((i*71)%r.width,(i*43)%r.height,(i%4+1)*.7,0,Math.PI*2);cx.fill();}cx.fillStyle='#fff4d9';cx.font='600 18px Georgia';cx.textAlign='center';cx.textBaseline='middle';cx.fillText('SCRATCH HERE ✧',r.width/2,r.height/2);}
function setupAllScratchCards(){if(!revealed)setupScratch();document.querySelectorAll('.reveal-canvas').forEach(c=>{if(c.dataset.ready==='yes')return;paintScratchLayer(c);c.dataset.ready='yes';let down=false;const point=e=>{const r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};const erase=e=>{const p=point(e),cx=c.getContext('2d');cx.globalCompositeOperation='destination-out';cx.beginPath();cx.arc(p.x,p.y,25,0,Math.PI*2);cx.fill();cx.globalCompositeOperation='source-over';};const progress=()=>{const cx=c.getContext('2d'),a=cx.getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<a.length;i+=4)if(a[i]<40)n++;return n/(a.length/4);};c.addEventListener('pointerdown',e=>{down=true;c.setPointerCapture(e.pointerId);erase(e);});c.addEventListener('pointermove',e=>{if(!down)return;erase(e);if(progress()>.28){c.style.opacity='0';c.style.pointerEvents='none';}});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>c.addEventListener(ev,()=>down=false));});}
window.addEventListener('load',()=>{if($('presentView').classList.contains('active'))setupAllScratchCards();});window.addEventListener('resize',()=>{if($('presentView').classList.contains('active')){document.querySelectorAll('.reveal-canvas').forEach(c=>{c.dataset.ready='';c.style.opacity='1';c.style.pointerEvents='auto';});setupAllScratchCards();if(!revealed)setupScratch();}});
