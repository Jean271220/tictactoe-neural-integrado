let estado = Array(18).fill(0);
let jogador = "X";
let ia = "O";
let tabuleiro = [];
let podeJogar = true;

function iniciarJogo() {
  jogador = document.getElementById("jogador").value;
  ia = jogador === "X" ? "O" : "X";
  estado = Array(18).fill(0);
  tabuleiro = Array(9).fill("");
  podeJogar = true;
  desenharTabuleiro();
  if (document.getElementById("inicio").value === "ia") iaJoga();
}

function desenharTabuleiro() {
  const div = document.getElementById("tabuleiro"); div.innerHTML = "";
  tabuleiro.forEach((val, i) => {
    const celula = document.createElement("div");
    celula.className = "celula";
    celula.textContent = val;
    celula.onclick = () => jogar(i);
    div.appendChild(celula);
  });
}

function jogar(pos) {
  if (!podeJogar || tabuleiro[pos] !== "") return;
  tabuleiro[pos] = jogador;
  estado[pos + (jogador === "X" ? 0 : 9)] = 1;
  desenharTabuleiro();
  iaJoga();
}

function iaJoga() {
  podeJogar = false;
  const ocupado = tabuleiro.map(c => c !== "" ? 1 : 0);
  fetch("/api/jogada", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: estado, ocupado: ocupado })
  })
    .then(r => r.json())
    .then(data => {
      const pos = data.jogada;
      if (tabuleiro[pos] === "") {
        tabuleiro[pos] = ia;
        estado[pos + (ia === "X" ? 0 : 9)] = 1;
        desenharTabuleiro();
      }
      podeJogar = true;
    });
}
