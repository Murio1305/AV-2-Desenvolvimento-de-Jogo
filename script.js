// BANCO DE DADOS DOS BOSSES E PERGUNTAS DO 6º ANO
const BOSS_DATA = {
  matematica: [
    {
      name: "Guardião dos Múltiplos",
      avatar: "📐",
      maxHp: 100,
      dialogue: "Eu sou o Guardião dos Múltiplos! Resolva meus cálculos!",
      questions: [
        {
          q: "Qual é o Mínimo Múltiplo Comum (MMC) entre os números 4 e 6?",
          opts: ["10", "12", "24", "18"],
          ans: 1,
          hint: "DICA: Liste os múltiplos de 4 (4, 8, 12) e de 6 (6, 12). O menor número comum é 12!"
        },
        {
          q: "Qual dos números abaixo é um número PRIMO?",
          opts: ["9", "15", "17", "21"],
          ans: 2,
          hint: "DICA: Números primos só possuem dois divisores: 1 e eles mesmos. O 17 só divide por 1 e 17!"
        },
        {
          q: "Qual o Máximo Divisor Comum (MDC) entre 12 e 18?",
          opts: ["2", "3", "6", "12"],
          ans: 2,
          hint: "DICA: Divisores de 12 (1,2,3,4,6,12) e de 18 (1,2,3,6,9,18). O maior divisor comum é 6!"
        }
      ]
    },
    {
      name: "Titã das Frações",
      avatar: "🍕",
      maxHp: 120,
      dialogue: "Acha que consegue somar as partes do meu poder?",
      questions: [
        {
          q: "Quanto é 2/5 + 1/5 de uma pizza?",
          opts: ["3/10", "3/5", "2/25", "1/5"],
          ans: 1,
          hint: "DICA: Em frações com denominadores iguais, mantemos o denominador (5) e somamos o topo (2+1)!"
        },
        {
          q: "Qual é a fração equivalente a 1/2 com denominador 10?",
          opts: ["2/10", "5/10", "1/10", "10/20"],
          ans: 1,
          hint: "DICA: Multiplique o numerador e o denominador por 5: 1x5 = 5 e 2x5 = 10 (5/10)!"
        }
      ]
    }
  ],
  portugues: [
    {
      name: "Esfinge dos Substantivos",
      avatar: "📜",
      maxHp: 100,
      dialogue: "Decifra-me ou devoro tua nota!",
      questions: [
        {
          q: "Qual das palavras abaixo é um Substantivo Abstrato?",
          opts: ["Cadeira", "Saudade", "Caneta", "Pedra"],
          ans: 1,
          hint: "DICA: Substantivo abstrato indica sentimentos, sensações ou qualidades!"
        },
        {
          q: "Qual frase possui um Sujeito Composto?",
          opts: ["O menino correu.", "Pedro e Maria estudaram.", "Choveu muito.", "Eles saíram."],
          ans: 1,
          hint: "DICA: Sujeito composto possui dois ou mais núcleos (Pedro e Maria)!"
        }
      ]
    }
  ],
  ciencias: [
    {
      name: "Mestre da Célula",
      avatar: "🔬",
      maxHp: 100,
      dialogue: "Você conhece a unidade fundamental da vida?",
      questions: [
        {
          q: "Qual organela celular é responsável pela respiração e produção de energia?",
          opts: ["Ribossomo", "Mitocôndria", "Núcleo", "Lisossomo"],
          ans: 1,
          hint: "DICA: A mitocôndria funciona como a 'usina de energia' da célula!"
        }
      ]
    }
  ],
  historia: [
    {
      name: "Guardião de Roma",
      avatar: "🏛️",
      maxHp: 100,
      dialogue: "O passado revelará seu destino!",
      questions: [
        {
          q: "Quem eram os plebeus na Roma Antiga?",
          opts: ["A nobreza rica", "Os comerciantes e trabalhadores livres", "Os reis imperadores", "Os escravos de guerra"],
          ans: 1,
          hint: "DICA: Os plebeus formavam a maioria da população livre romana (artesãos, camponeses)!"
        }
      ]
    }
  ],
  geografia: [
    {
      name: "Entidade dos Biomas",
      avatar: "🌍",
      maxHp: 100,
      dialogue: "Sinta a força das camadas da Terra!",
      questions: [
        {
          q: "Qual é a camada mais interna e quente do planeta Terra?",
          opts: ["Manto", "Crosta Terrestre", "Núcleo", "Litosfera"],
          ans: 2,
          hint: "DICA: O núcleo fica no centro da Terra e atinge milhares de graus!"
        }
      ]
    }
  ],
  ingles: [
    {
      name: "Lord of Grammar",
      avatar: "🔤",
      maxHp: 100,
      dialogue: "Show me your English skills!",
      questions: [
        {
          q: "Complete: 'She ___ a student.'",
          opts: ["am", "are", "is", "be"],
          ans: 2,
          hint: "DICA: No Verb to Be no presente: He/She/It usam 'IS'!"
        }
      ]
    }
  ]
};

let currentSubject = "matematica";
let currentBossIndex = 0;
let playerHp = 20;
let maxPlayerHp = 20;
let bossHp = 100;
let questionQueue = [];
let currentQuestionObj = null;

// ÁUDIO SINTETIZADO (WEB AUDIO API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(freq = 440, type = 'square', duration = 0.08) {
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

// DIGITAÇÃO ESTILO UNDERTALE
function typeWriter(text, elementId, speed = 35) {
  const elem = document.getElementById(elementId);
  elem.textContent = "";
  let i = 0;
  
  if (window.typeWriterInterval) clearInterval(window.typeWriterInterval);

  window.typeWriterInterval = setInterval(() => {
    if (i < text.length) {
      const char = text.charAt(i);
      elem.textContent += char;
      if (char !== " ") playBeep(300, 'square', 0.03);
      i++;
    } else {
      clearInterval(window.typeWriterInterval);
    }
  }, speed);
}

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnPlay").onclick = () => switchScreen("screenSubjects");
  document.getElementById("btnBackToStart").onclick = () => switchScreen("screenStart");
  document.getElementById("btnQuitBattle").onclick = () => switchScreen("screenSubjects");
  document.getElementById("btnVictoryToMenu").onclick = () => switchScreen("screenSubjects");
  document.getElementById("btnRetry").onclick = () => switchScreen("screenSubjects");

  document.querySelectorAll(".subject-card").forEach(card => {
    card.onclick = () => {
      currentSubject = card.dataset.subject;
      currentBossIndex = 0;
      startBattle();
    };
  });

  document.getElementById("btnNextBoss").onclick = () => {
    currentBossIndex++;
    startBattle();
  };
});

function switchScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(screenId).classList.remove("hidden");
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function startBattle() {
  const bossList = BOSS_DATA[currentSubject] || BOSS_DATA["matematica"];
  
  if (currentBossIndex >= bossList.length) {
    currentBossIndex = 0; // Volta para o primeiro chefe se completar a lista
  }

  const boss = bossList[currentBossIndex];
  playerHp = maxPlayerHp;
  bossHp = boss.maxHp;

  // Cria a fila de perguntas sem repetir
  questionQueue = shuffleArray(boss.questions);

  document.getElementById("subjectBadge").textContent = currentSubject.toUpperCase();
  document.getElementById("bossProgress").textContent = `BOSS ${currentBossIndex + 1}/${bossList.length}`;
  document.getElementById("bossName").textContent = boss.name;
  document.getElementById("bossSprite").textContent = boss.avatar;

  updateHpBars();
  typeWriter(boss.dialogue, "bossDialogueText");
  nextQuestion();

  switchScreen("screenBattle");
}

function nextQuestion() {
  if (questionQueue.length === 0) {
    // Recarrega caso acabe
    const bossList = BOSS_DATA[currentSubject] || BOSS_DATA["matematica"];
    questionQueue = shuffleArray(bossList[currentBossIndex].questions);
  }

  currentQuestionObj = questionQueue.shift();

  document.getElementById("questionText").textContent = currentQuestionObj.q;
  const container = document.getElementById("optionsContainer");
  container.innerHTML = "";

  currentQuestionObj.opts.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.className = "opt-btn";
    btn.textContent = `${index + 1}. ${opt}`;
    btn.onclick = () => handleAnswer(index);
    container.appendChild(btn);
  });
}

function handleAnswer(selectedIndex) {
  if (selectedIndex === currentQuestionObj.ans) {
    // Acerto
    playBeep(600, 'sine', 0.15);
    bossHp -= 35;
    if (bossHp < 0) bossHp = 0;
    updateHpBars();

    if (bossHp === 0) {
      setTimeout(showVictory, 600);
    } else {
      typeWriter("* ACERTO CRÍTICO! O Guardião sentiu o impacto!", "bossDialogueText");
      setTimeout(nextQuestion, 1200);
    }
  } else {
    // Erro
    playBeep(150, 'sawtooth', 0.2);
    playerHp -= 5;
    if (playerHp < 0) playerHp = 0;
    updateHpBars();

    if (playerHp === 0) {
      setTimeout(showGameOver, 600);
    } else {
      typeWriter(`* ERROU! ${currentQuestionObj.hint}`, "bossDialogueText");
      setTimeout(nextQuestion, 2500);
    }
  }
}

function updateHpBars() {
  const bossList = BOSS_DATA[currentSubject] || BOSS_DATA["matematica"];
  const boss = bossList[currentBossIndex];

  const bossPct = (bossHp / boss.maxHp) * 100;
  document.getElementById("bossHpBar").style.width = `${bossPct}%`;
  document.getElementById("bossHpText").textContent = `${bossHp} / ${boss.maxHp} HP`;

  const playerPct = (playerHp / maxPlayerHp) * 100;
  document.getElementById("playerHpBar").style.width = `${playerPct}%`;
  document.getElementById("playerHpText").textContent = `${playerHp} / ${maxPlayerHp}`;
}

function showVictory() {
  document.getElementById("victoryBossName").textContent = `VOCÊ DERROTOU O GUARDIÃO!`;
  switchScreen("screenVictory");
}

function showGameOver() {
  switchScreen("screenGameOver");
}