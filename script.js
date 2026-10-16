(() => {
'use strict';
const $ = id => document.getElementById(id);
const screens = ['menuScreen','howScreen','skinScreen','gameScreen','resultScreen'];
const bosses = [
 {key:'alexandre',name:'ALEXANDRE',subject:'FÍSICA',tag:'FÍSICA',forms:['alexandreinicio.png','alexandremeio.png','alexandrefim.png'],maxHp:100,baseSpeed:27,questions:[
  ['Qual destes objetos usa energia elétrica para funcionar?',['Uma pedra','Uma lâmpada','Uma folha','Uma nuvem'],1],
  ['O que acontece quando soltamos uma bola?',['Ela cai por causa da gravidade','Ela sobe para sempre','Ela vira luz','Ela para no ar'],0],
  ['Qual fonte fornece luz e calor para a Terra?',['A Lua','Marte','O Sol','Uma estrela-do-mar'],2],
  ['Qual destes materiais costuma ser atraído por um ímã?',['Madeira','Papel','Plástico','Ferro'],3],
  ['Qual ação ajuda a economizar energia?',['Deixar tudo ligado','Apagar a luz ao sair','Abrir a geladeira sem motivo','Ligar a TV sem assistir'],1],
  ['O som é produzido principalmente por…',['Vibrações','Sombras','Cores','Cheiros'],0],
  ['Qual objeto facilita mover uma carga usando uma roda e uma corda?',['Um espelho','Uma polia','Uma almofada','Um copo'],1],
  ['Quando a luz bate em um espelho, ela pode…',['Desaparecer','Virar som','Ser refletida','Virar água'],2],
  ['Qual estado da água é o gelo?',['Gasoso','Sólido','Líquido','Elétrico'],1],
  ['Qual destes é um exemplo de energia em movimento?',['Uma bicicleta andando','Um livro parado','Uma parede','Uma cadeira guardada'],0]
 ]},
 {key:'cieli',name:'CIELI',subject:'MATEMÁTICA',tag:'MATEMÁTICA',forms:['cieliinicio.png','cielimeio.png','cielifim.png'],maxHp:120,baseSpeed:31,questions:[
  ['Quanto é 7 × 6?',['36','42','48','56'],1],
  ['Qual é a metade de 18?',['6','8','9','12'],2],
  ['Um triângulo tem quantos lados?',['2','3','4','5'],1],
  ['Quanto é 100 − 37?',['53','63','73','67'],1],
  ['Qual fração representa metade?',['1/3','1/4','2/3','1/2'],3],
  ['Se 3 caixas têm 4 lápis cada, quantos lápis há?',['7','12','14','16'],1],
  ['Qual número é par?',['17','21','28','35'],2],
  ['Um quadrado tem lados de 5 cm. Qual é seu perímetro?',['10 cm','15 cm','20 cm','25 cm'],2],
  ['Quanto é 81 ÷ 9?',['7','8','9','10'],2],
  ['Qual número completa a sequência: 5, 10, 15, __?',['18','20','25','30'],1]
 ]},
 {key:'buiu',name:'BUIU',subject:'PROGRAMAÇÃO',tag:'CÓDIGO',forms:['buiuinicio.png','buiumeio.png','buiufim.png'],maxHp:145,baseSpeed:36,questions:[
  ['Em programação, o que é um algoritmo?',['Uma sequência de passos','Um tipo de monitor','Um cabo de energia','Um desenho aleatório'],0],
  ['Qual destes é um dispositivo de entrada?',['Monitor','Caixa de som','Teclado','Projetor'],2],
  ['O que acontece em um laço de repetição?',['O programa apaga tudo','Uma ação pode se repetir','O computador desliga','A tela fica maior'],1],
  ['Qual valor é um número inteiro?',['"olá"','3','verdadeiro','@'],1],
  ['Para que serve uma condição SE (IF)?',['Para escolher com base em uma condição','Para aumentar o volume','Para imprimir sempre','Para carregar a bateria'],0],
  ['Qual é a ordem lógica para fazer um sanduíche?',['Comer, montar, pegar pão','Montar, pegar ingredientes, comer','Pegar ingredientes, montar, comer','Comer, comprar, montar'],2],
  ['O que é um bug?',['Um erro no programa','Um tipo de mouse','Uma senha','Uma fonte de energia'],0],
  ['Em um programa, uma variável serve para…',['Guardar um valor','Limpar a tela física','Conectar à tomada','Aumentar o brilho'],0],
  ['Qual comando é usado em muitos programas para mostrar texto?',['PRINT','PAUSE FOREVER','COLOR ONLY','TURN OFF'],0],
  ['Se uma sequência é 2, 4, 6, 8, qual vem depois?',['9','10','11','12'],1]
 ]}
];
const skins=[
 {id:'m1',name:'RANGER',title:'PIXEL RANGER',group:'HERÓIS'},
 {id:'m2',name:'BLAZE',title:'PIXEL BLAZE',group:'HERÓIS'},
 {id:'m3',name:'TERRA',title:'PIXEL TERRA',group:'HERÓIS'},
 {id:'f1',name:'STELLA',title:'PIXEL STELLA',group:'HEROÍNAS'},
 {id:'f2',name:'LUNA',title:'PIXEL LUNA',group:'HEROÍNAS'},
 {id:'f3',name:'SOLARA',title:'PIXEL SOLARA',group:'HEROÍNAS'}
];
let state = {skin:'m1',phase:0,hp:100,lives:3,score:0,hits:0,misses:0,combo:0,bestCombo:0,questionIndex:0,question:null,answers:[],running:false,paused:false,started:false,transformed:false,form:0,timeLeft:12,lastTime:0,raf:0,spawned:false,shotCooldown:0,chaos:0,unlocked:0,muted:false,audioCtx:null,oscillators:[],answerSpeed:28,answered:false,questionToken:0,gameId:0,deck:[],lastQuestion:-1,deferred:[],hazardCountdown:4,hazardState:'idle',hazardTime:0,hazardX:0,hazardWidth:0};
const SAVE_KEY='professorExeSaveV1';
function loadSave(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}');state.unlocked=Math.max(0,Math.min(3,Number(s.unlocked)||0));state.score=Math.max(0,Number(s.score)||0);state.skin=skins.some(k=>k.id===s.skin)?s.skin:'m1';}catch{state.unlocked=0;state.score=0;state.skin='m1';}}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({unlocked:state.unlocked,score:state.score,skin:state.skin}));}catch{}}
function showScreen(id){screens.forEach(s=>$(s).classList.toggle('hidden',s!==id));$('pauseOverlay').classList.add('hidden');}
function audioContext(){if(state.muted)return null;try{if(!state.audioCtx)state.audioCtx=new(window.AudioContext||window.webkitAudioContext)();if(state.audioCtx.state==='suspended')state.audioCtx.resume();return state.audioCtx;}catch{return null;}}
function tone(freq=440,duration=.1,type='square',volume=.035,slide=0){const ctx=audioContext();if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,ctx.currentTime);if(slide)o.frequency.linearRampToValueAtTime(Math.max(30,freq+slide),ctx.currentTime+duration);g.gain.setValueAtTime(volume,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+duration+.02);}
function sfx(kind){if(state.muted)return;const seq={shoot:[[660,.06,120],[880,.05,0]],hit:[[220,.12,-100],[110,.18,-30]],wrong:[[180,.15,-80]],correct:[[660,.08,120],[990,.12,0]],transform:[[110,.18,180],[220,.2,250],[440,.25,0]],win:[[523,.12,0],[659,.12,0],[784,.22,0]],lose:[[330,.18,-100],[220,.25,-120]]};(seq[kind]||[]).forEach((n,i)=>setTimeout(()=>tone(n[0],n[1],'square',.035,n[2]),i*75));}
function updateSoundButton(){$('soundToggle').textContent=state.muted?'♪̸':'♫';$('soundToggle').setAttribute('aria-label',state.muted?'Ativar som':'Desativar som');}
function playBossMusic(){if(state.muted)return;const ctx=audioContext();if(!ctx)return;stopMusic();const patterns=[[110,0,165,0,220,165,0,146],[98,147,196,147,110,165,220,165],[73,110,146,220,164,123,196,246]];const pattern=patterns[state.phase];let step=0;state.musicTimer=setInterval(()=>{if(!state.running||state.paused||state.muted)return;const f=pattern[step%pattern.length];tone(f,.16,'square',.012);if(step%4===0)tone(f/2,.12,'triangle',.012);step++;},state.phase===2?180:state.phase===1?230:280);}
function stopMusic(){if(state.musicTimer)clearInterval(state.musicTimer);state.musicTimer=null;}
function setBossForm(form){const boss=bosses[state.phase];state.form=form;$('arena').dataset.boss=boss.key;$('bossHudImage').src=boss.forms[form];$('bossArenaImage').src=boss.forms[form];$('phaseLabel').textContent=['FORMA HUMANA // FASE 1','TRANSFORMAÇÃO // FASE 2','FORMA FINAL // FASE 3'][form];$('arena').classList.toggle('transformed',form>0);}
function startGame(phase=0){cancelAnimationFrame(state.raf);stopMusic();state.gameId++;state.deferred=[];state.deck=bosses[phase].questions.map((_,i)=>i).reverse();state.lastQuestion=-1;state.phase=phase;state.hp=bosses[phase].maxHp;state.lives=3;state.hits=0;state.misses=0;state.combo=0;state.bestCombo=0;state.questionIndex=0;state.running=true;state.paused=false;resetPauseUI();state.started=true;state.transformed=false;state.form=0;state.timeLeft=12;state.chaos=0;state.answered=false;state.questionToken=0;state.score=Number(state.score)||0;state.answerSpeed=bosses[phase].baseSpeed;state.hazardCountdown=3+Math.random()*3;state.hazardState='idle';state.hazardTime=0;$('arena').querySelectorAll('.danger-column,.danger-mark').forEach(n=>n.remove());$('levelChip').textContent=`FASE 0${phase+1} / 03`;$('bossName').textContent=bosses[phase].name;$('bossSubject').textContent=`CHEFE DE ${bosses[phase].subject}`;$('questionTag').textContent=bosses[phase].tag;$('bossWarning').classList.add('hidden');$('arena').className='arena';$('toast').classList.add('hidden');$('hits').textContent='0';$('misses').textContent='0';$('chaosLabel').textContent='NÍVEL DE CAOS: 01';updateScore();updateLives();setBossForm(0);showScreen('gameScreen');playBossMusic();nextQuestion();state.lastTime=performance.now();state.raf=requestAnimationFrame(loop);}
function later(fn,ms){const id=state.gameId;setTimeout(()=>{if(id!==state.gameId)return;if(state.paused){state.deferred.push(fn);return;}fn();},ms);}
function updateScore(){$('score').textContent=String(state.score).padStart(6,'0');$('streak').textContent=`COMBO ×${state.combo}`;$('hits').textContent=state.hits;$('misses').textContent=state.misses;}
function updateLives(){$('lives').textContent=Array.from({length:3},(_,i)=>i<state.lives?'♥':'♡').join(' ');$('lives').setAttribute('aria-label',`${state.lives} de 3 vidas restantes`);}
function shuffledIndexes(n){const a=Array.from({length:n},(_,i)=>i);for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function getQuestion(){
 const list=bosses[state.phase].questions;
 // Baralho de perguntas: nenhuma pergunta se repete até todas terem saído; depois reembaralha sem repetir a última em sequência.
 if(!state.deck.length){
  state.deck=shuffledIndexes(list.length);
  const last=state.deck.length-1;
  if(list.length>1&&state.deck[last]===state.lastQuestion){const j=Math.floor(Math.random()*last);[state.deck[j],state.deck[last]]=[state.deck[last],state.deck[j]];}
 }
 const idx=state.deck.pop();state.lastQuestion=idx;state.questionIndex++;
 const q=list[idx];
 return {text:q[0],options:q[1].slice(),correct:q[2]};
}
function nextQuestion(){
 if(!state.running)return;
 state.questionToken++;state.question=getQuestion();state.timeLeft=12;state.answered=false;state.spawned=false;
 $('questionText').textContent=state.question.text;$('fallingAnswers').innerHTML='';$('toast').classList.add('hidden');$('timerNum').textContent='12';$('timerRing').style.strokeDashoffset='0';$('timerRing').style.stroke='var(--cyan)';
 const order=[0,1,2,3].sort(()=>Math.random()-.5),arena=$('arena'),width=arena.clientWidth,height=arena.clientHeight,mobile=width<600;
 const cols=mobile?2:4,rows=mobile?2:1,gap=mobile?10:12,pad=mobile?12:18;
 const cardWidth=(width-pad*2-gap*(cols-1))/cols,cardHeight=mobile?68:78;
 const targetStartY=mobile?Math.max(125,height*.31):Math.max(150,height*.43);
 state.answers=[];
 order.forEach((optionIndex,i)=>{
  const el=document.createElement('button');el.className='answer answer-rising';el.type='button';el.dataset.option=String(optionIndex);el.setAttribute('aria-label',`Alternativa ${String.fromCharCode(65+i)}: ${state.question.options[optionIndex]}`);
  el.innerHTML=`<span class="letter">${String.fromCharCode(65+i)}</span><span class="answer-text"></span>`;el.querySelector('.answer-text').textContent=state.question.options[optionIndex];
  el.style.width=`${cardWidth}px`;el.style.minHeight=`${cardHeight}px`;
  const col=i%cols,row=Math.floor(i/cols),left=pad+col*(cardWidth+gap),targetY=targetStartY+row*(cardHeight+18),startY=height-100;
  el.style.left=`${left}px`;el.style.top=`${startY}px`;el.style.opacity='1';el.addEventListener('click',e=>{e.stopPropagation();const r=$('arena').getBoundingClientRect(),b=el.getBoundingClientRect();fireFromScreen(b.left+b.width/2-r.left);});$('fallingAnswers').appendChild(el);
  state.answers.push({el,optionIndex,y:startY,x:left,active:true,delay:i*.07,phaseOffset:i*Math.PI/2,amplitude:Math.min(150,height*.31),baseY:targetY,startY,targetY,rise:0,cycle:0});
 });
 state.answerSpeed=bosses[state.phase].baseSpeed+state.chaos*5;
}
function fireAtAnswer(answerEl){
 if(!state.running||state.paused||state.answered||!answerEl||!answerEl.isConnected)return;
 const rect=answerEl.getBoundingClientRect(),arenaRect=$('arena').getBoundingClientRect(),targetX=rect.left+rect.width/2-arenaRect.left,targetY=rect.top+rect.height/2-arenaRect.top;
 const player=$('heroPlayer');player.style.left=`${Math.max(25,Math.min(arenaRect.width-25,targetX))}px`;
 const shot=document.createElement('i');shot.className='shot';shot.style.left=`${targetX}px`;shot.style.top=`${arenaRect.height-67}px`;$('shots').appendChild(shot);sfx('shoot');
 shot.animate([{top:`${arenaRect.height-67}px`},{top:`${targetY}px`}],{duration:210,easing:'linear'}).onfinish=()=>{shot.remove();if(state.running&&!state.paused&&!state.answered)resolveAnswer(Number(answerEl.dataset.option),answerEl);};
}
function fireFromScreen(x){
 if(!state.running||state.paused||state.answered)return;
 const active=state.answers.filter(a=>a.el.isConnected&&!a.el.disabled);
 if(!active.length)return;
 // Select the nearest fixed answer by horizontal lane; the player never needs to click a moving card.
 const arenaRect=$('arena').getBoundingClientRect();
 const target=active.reduce((best,a)=>{const r=a.el.getBoundingClientRect(),cx=r.left+r.width/2-arenaRect.left;return !best||Math.abs(cx-x)<best.distance?{a,distance:Math.abs(cx-x)}:best;},null);
 if(target)fireAtAnswer(target.a.el);
}
function triggerDangerColumn(){
 if(!state.running||state.paused||state.form<1||state.answered)return;
 const arena=$('arena'),w=arena.clientWidth,colW=Math.max(48,Math.min(88,w*.12));
 const maxX=Math.max(0,w-colW);state.hazardX=Math.floor(Math.random()*(maxX+1));state.hazardWidth=colW;state.hazardState='warning';state.hazardTime=1.25;
 const mark=document.createElement('div');mark.className='danger-mark';mark.textContent='!';mark.style.left=`${state.hazardX+colW/2}px`;arena.appendChild(mark);
 const col=document.createElement('div');col.className='danger-column';col.style.left=`${state.hazardX}px`;col.style.width=`${colW}px`;col.dataset.state='warning';arena.appendChild(col);
 state.hazardMark=mark;state.hazardColumn=col;
}
function updateDangerColumn(dt){
 if(state.form<1||state.answered)return;
 state.hazardCountdown-=dt;
 if(state.hazardState==='idle'&&state.hazardCountdown<=0){triggerDangerColumn();return;}
 if(state.hazardState==='warning'){
  state.hazardTime-=dt;
  if(state.hazardColumn)state.hazardColumn.dataset.state='warning';
  if(state.hazardTime<=0){state.hazardState='active';state.hazardTime=.72;if(state.hazardMark)state.hazardMark.remove();state.hazardMark=null;if(state.hazardColumn)state.hazardColumn.dataset.state='active';
   const arenaRect=$('arena').getBoundingClientRect(),heroRect=$('heroPlayer').getBoundingClientRect(),heroX=heroRect.left+heroRect.width/2-arenaRect.left;
   if(heroX>=state.hazardX&&heroX<=state.hazardX+state.hazardWidth){state.lives--;state.combo=0;sfx('hit');showToast('COLUNA DE ENERGIA! -1 VIDA');$('arena').classList.add('damage');setTimeout(()=>$('arena').classList.remove('damage'),250);flash();updateLives();if(state.lives<=0){state.hazardState='idle';later(finishGameOver,400);}}
  }
 }else if(state.hazardState==='active'){
  state.hazardTime-=dt;
  if(state.hazardColumn)state.hazardColumn.dataset.state='active';
  if(state.hazardTime<=0){if(state.hazardColumn)state.hazardColumn.remove();state.hazardColumn=null;state.hazardState='idle';state.hazardCountdown=4+Math.random()*4;}
 }
}
function resolveAnswer(index,el){if(state.answered||!state.running)return;state.answered=true;if(state.hazardColumn)state.hazardColumn.remove();if(state.hazardMark)state.hazardMark.remove();state.hazardColumn=null;state.hazardMark=null;state.hazardState='idle';state.hazardCountdown=3+Math.random()*3;const correct=index===state.question.correct;if(el)el.classList.add(correct?'correct':'wrong');state.answers.forEach(a=>{if(a.el!==el)a.el.disabled=true;});if(correct){state.hits++;state.combo++;state.bestCombo=Math.max(state.bestCombo,state.combo);const points=100+Math.min(100,state.combo*5)+state.phase*25;state.score+=points;state.hp=Math.max(0,state.hp-(state.form===0?10:state.form===1?13:16));sfx('correct');showToast(`ACERTOU! +${points} PTS`);flash();if(state.hp<=0){state.hp=0;updateBossHealth();updateScore();later(finishBoss,650);return;}if(!state.transformed&&state.hp<=bosses[state.phase].maxHp/2){state.transformed=true;state.form=1;setBossForm(1);state.answerSpeed+=12;$('bossWarning').classList.remove('hidden');$('arena').classList.add('transformed');sfx('transform');showToast('TRANSFORMAÇÃO!');setTimeout(()=>$('bossWarning').classList.add('hidden'),1800);state.chaos=Math.max(state.chaos,1);}else{state.form=state.hp<=bosses[state.phase].maxHp*.22?2:state.form;if(state.form===2)setBossForm(2);}if(state.combo>0&&state.combo%3===0)state.chaos=Math.min(3,state.chaos+1);}else{state.misses++;state.combo=0;state.lives--;state.score=Math.max(0,state.score-25);sfx('wrong');showToast('OPS! -1 VIDA');$('arena').classList.add('damage');setTimeout(()=>$('arena').classList.remove('damage'),220);flash();if(state.lives<=0){updateLives();updateScore();later(finishGameOver,650);return;}}updateBossHealth();updateLives();updateScore();updateChaos();later(()=>{if(state.running)nextQuestion();},correct?650:800);}
function updateBossHealth(){$('bossHealth').style.width=`${Math.max(0,state.hp/bosses[state.phase].maxHp*100)}%`;$('bossHpText').textContent=`${state.hp} / ${bosses[state.phase].maxHp} HP`;}
function updateChaos(){const level=Math.min(3,1+Math.floor(state.score/500)+state.chaos);$('chaosLabel').textContent=`NÍVEL DE CAOS: 0${level}`;$('arena').classList.remove('chaos-1','chaos-2','chaos-3');if(level>=1)$('arena').classList.add(`chaos-${level}`);}
function showToast(text){const t=$('toast');t.textContent=text;t.classList.remove('hidden');}
function flash(){const f=$('flash');f.classList.remove('hit');void f.offsetWidth;f.classList.add('hit');}
function finishBoss(){if(!state.running)return;state.running=false;stopMusic();sfx('win');state.unlocked=Math.max(state.unlocked,Math.min(3,state.phase+2));save();$('resultIcon').textContent='★';$('resultEyebrow').textContent=`BOSS 0${state.phase+1} ELIMINADO`;if(state.phase<2){$('resultTitle').textContent='CHEFE DERROTADO!';$('resultMessage').textContent=`${bosses[state.phase].name} foi derrotado. A próxima ameaça está chegando!`;$('nextBtn').textContent=`ENFRENTAR ${bosses[state.phase+1].name} ▶`;$('nextBtn').classList.remove('hidden');}else{$('resultTitle').textContent='ESCOLA SALVA!';$('resultMessage').textContent='Você venceu os três professores vilões. O conhecimento triunfou!';$('resultEyebrow').textContent='MISSÃO COMPLETA';$('nextBtn').textContent='JOGAR NOVAMENTE ↻';$('nextBtn').classList.remove('hidden');state.unlocked=3;save();}showResults();}
function finishGameOver(){if(!state.running)return;state.running=false;stopMusic();sfx('lose');$('resultIcon').textContent='☠';$('resultEyebrow').textContent='SINAL PERDIDO';$('resultTitle').textContent='FIM DE JOGO';$('resultMessage').textContent='Não desista, player! Revise o conteúdo e tente novamente.';$('nextBtn').textContent='TENTAR NOVAMENTE ↻';$('nextBtn').classList.remove('hidden');showResults();}
function showResults(){$('finalScore').textContent=state.score;$('finalHits').textContent=state.hits;$('finalStreak').textContent=state.bestCombo;showScreen('resultScreen');}
function loop(now){if(!state.running)return;if(state.paused){state.lastTime=now;state.raf=requestAnimationFrame(loop);return;}const dt=Math.min(.05,(now-state.lastTime)/1000||0);state.lastTime=now;if(!state.answered){state.timeLeft-=dt;if(state.timeLeft<=0){state.timeLeft=0;resolveTimeout();}const remaining=state.timeLeft/12;$('timerNum').textContent=String(Math.ceil(state.timeLeft));$('timerRing').style.strokeDashoffset=String(113.1*(1-remaining));$('timerRing').style.stroke=remaining<.33?'var(--danger)':'var(--cyan)';state.answers.forEach(a=>{if(!a.active||!a.el.isConnected)return;a.delay-=dt;if(a.delay>0)return;if(a.rise<1){a.rise=Math.min(1,a.rise+dt*1.65);a.y=a.startY+(a.targetY-a.startY)*a.rise;a.el.style.top=`${a.y}px`;if(a.rise>=1)a.el.classList.remove('answer-rising');}});updateDangerColumn(dt);}state.raf=requestAnimationFrame(loop);}
function resolveTimeout(){if(state.answered||!state.running)return;state.answered=true;if(state.hazardColumn)state.hazardColumn.remove();if(state.hazardMark)state.hazardMark.remove();state.hazardColumn=null;state.hazardMark=null;state.hazardState='idle';state.misses++;state.combo=0;state.lives--;state.score=Math.max(0,state.score-15);sfx('wrong');showToast('TEMPO ESGOTADO! -1 VIDA');updateLives();updateScore();if(state.lives<=0){later(finishGameOver,450);return;}later(()=>{if(state.running)nextQuestion();},650);}
function resetPauseUI(){$('pauseOverlay').classList.add('hidden');$('arena').classList.remove('paused');const b=$('pauseBtn');b.textContent='Ⅱ PAUSAR';b.setAttribute('aria-pressed','false');}
function setPaused(p){
 state.paused=p;
 $('pauseOverlay').classList.toggle('hidden',!p);$('arena').classList.toggle('paused',p);
 const b=$('pauseBtn');b.textContent=p?'▶ CONTINUAR':'Ⅱ PAUSAR';b.setAttribute('aria-pressed',String(p));
 if(p){b.blur();$('resumeBtn').focus();}
 else{
  if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();
  state.lastTime=performance.now();
  // Executa o que ficou pendente durante a pausa (ex.: próxima pergunta).
  state.deferred.splice(0).forEach(fn=>fn());
 }
}
function togglePause(){if(!state.running)return;setPaused(!state.paused);}
function goMenu(){state.running=false;state.paused=false;state.gameId++;state.deferred=[];cancelAnimationFrame(state.raf);stopMusic();resetPauseUI();showScreen('menuScreen');updateMenuProgress();}
function applySkin(){
 const s=skins.find(k=>k.id===state.skin)||skins[0];
 document.body.dataset.skinTheme=s.id;
 document.querySelectorAll('.hero-sprite,#heroPlayer').forEach(el=>{el.dataset.skin=s.id;});
 const cap=document.querySelector('.art-caption b');if(cap)cap.textContent=s.title;
}
function renderSkins(){
 const figure='<div class="player-shadow"></div><div class="player-hair"></div><div class="player-face"><i></i><i></i></div><div class="player-torso"><span>★</span></div><div class="player-arm"></div><div class="player-blaster"></div><div class="player-legs"><i></i><i></i></div>';
 $('skinGrid').innerHTML=['HERÓIS','HEROÍNAS'].map(group=>`<div class="skin-group"><div class="section-label">// ${group}</div><div class="skin-row">${skins.filter(s=>s.group===group).map(s=>`<button type="button" class="skin-card${s.id===state.skin?' selected':''}" data-skin-id="${s.id}" data-skin="${s.id}" aria-pressed="${s.id===state.skin}" aria-label="Traje ${s.name}"><div class="skin-figure" data-skin="${s.id}">${figure}</div><b>${s.name}</b></button>`).join('')}</div></div>`).join('');
}
function chooseSkin(id){
 if(!skins.some(s=>s.id===id))return;
 state.skin=id;save();applySkin();
 $('skinGrid').querySelectorAll('.skin-card').forEach(c=>{const on=c.dataset.skinId===id;c.classList.toggle('selected',on);c.setAttribute('aria-pressed',String(on));});
 sfx('correct');
}
let restartTimer=null;
function resetRestartBtn(){clearTimeout(restartTimer);restartTimer=null;const b=$('restartBtn');b.textContent='↻ RECOMEÇAR';b.classList.remove('confirming');}
function restartProgress(){
 const b=$('restartBtn');
 if(!restartTimer){b.textContent='⚠ CLIQUE DE NOVO PARA CONFIRMAR';b.classList.add('confirming');restartTimer=setTimeout(resetRestartBtn,3500);return;}
 resetRestartBtn();state.unlocked=0;state.score=0;save();updateMenuProgress();
}
function updateMenuProgress(){resetRestartBtn();$('restartBtn').disabled=state.unlocked===0&&state.score===0;const cards=[...document.querySelectorAll('.boss-card')];cards.forEach((card,i)=>{const label=card.querySelector('.lock-state');label.textContent=i<state.unlocked?'✓':`0${i+1}`;label.style.color=i<state.unlocked?'var(--green)':'#66759d';});const btn=$('startBtn');btn.textContent=state.unlocked>=3?'↻ JOGAR NOVAMENTE':'▶ INICIAR MISSÃO';}
function startOrContinue(){audioContext();const phase=state.unlocked>=3?0:Math.min(2,state.unlocked);startGame(phase);}
$('startBtn').addEventListener('click',startOrContinue);$('howBtn').addEventListener('click',()=> $('howScreen').classList.remove('hidden'));document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close).classList.add('hidden')));$('soundToggle').addEventListener('click',()=>{state.muted=!state.muted;if(state.muted)stopMusic();else if(state.running)playBossMusic();updateSoundButton();});$('exitBtn').addEventListener('click',goMenu);$('restartBtn').addEventListener('click',restartProgress);$('skinBtn').addEventListener('click',()=>$('skinScreen').classList.remove('hidden'));$('skinGrid').addEventListener('click',e=>{const c=e.target.closest('.skin-card');if(c)chooseSkin(c.dataset.skinId);});$('pauseBtn').addEventListener('click',togglePause);$('resumeBtn').addEventListener('click',togglePause);$('pauseMenuBtn').addEventListener('click',goMenu);$('menuBtn').addEventListener('click',goMenu);$('nextBtn').addEventListener('click',()=>{if(state.phase<2&&state.unlocked>state.phase+1)startGame(state.phase+1);else if(state.phase<2&&state.hp<=0)startGame(state.phase+1);else startGame(state.phase);});
$('arena').addEventListener('pointermove',e=>{if(!state.running||state.paused)return;const r=$('arena').getBoundingClientRect();const x=Math.max(28,Math.min(r.width-28,e.clientX-r.left));$('heroPlayer').style.left=`${x}px`;});$('arena').addEventListener('pointerdown',e=>{if(e.target.closest('button')||e.target.closest('.game-controls')||!state.running||state.paused)return;e.preventDefault();const r=$('arena').getBoundingClientRect();const x=e.clientX-r.left;$('heroPlayer').style.left=`${Math.max(25,Math.min(r.width-25,x))}px`;fireFromScreen(x);});document.addEventListener('keydown',e=>{if(e.repeat)return;if(e.key==='Escape'&&state.running){togglePause();return;}if((e.key===' '||e.key==='Enter')&&state.paused&&!(e.target.closest&&e.target.closest('button'))){e.preventDefault();togglePause();}});window.addEventListener('resize',()=>{if(!state.running)return;const w=$('arena').clientWidth;state.answers.forEach(a=>{a.x=Math.min(a.x,w-a.el.offsetWidth-6);a.el.style.left=`${Math.max(5,a.x)}px`;});});
loadSave();applySkin();renderSkins();updateSoundButton();updateMenuProgress();
})();
