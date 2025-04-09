let estado = new Array(18).fill(0);
let jogadorSimbolo = "X";
let redeSimbolo = "O";
let jogadorComeca = true;
let jogoAtivo = false;

document.getElementById("iniciarBtn").addEventListener("click", () => {
    const simbolo = document.getElementById("simbolo").value;
    const primeiro = document.getElementById("quemComeca").value;

    jogadorSimbolo = simbolo;
    redeSimbolo = simbolo === "X" ? "O" : "X";
    jogadorComeca = primeiro === "Você";
    jogoAtivo = true;

    estado = new Array(18).fill(0);
    document.querySelectorAll(".celula").forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("vitoria");
    });

    if (!jogadorComeca) {
        jogadaRede();
    }
});

document.querySelectorAll(".celula").forEach((celula, index) => {
    celula.addEventListener("click", () => {
        if (!jogoAtivo) return;

        const pos = index;
        const simboloAtual = jogadorSimbolo;
        const posX = simboloAtual === "X" ? pos : pos + 9;
        const posO = simboloAtual === "O" ? pos : pos + 9;

        if (estado[posX] === 1 || estado[posO] === 1) return;

        estado[posX] = 1;
        celula.textContent = simboloAtual;

        if (verificaVitoria(simboloAtual)) {
            jogoAtivo = false;
            return;
        }

        if (estado.slice(0, 9).map((_, i) => estado[i] || estado[i + 9]).every(v => v)) {
            jogoAtivo = false;
            return;
        }

        jogadaRede();
    });
});

function jogadaRede() {
    const ocupado = estado.slice(0, 9).map((_, i) => estado[i] || estado[i + 9] ? 1 : 0);

    fetch("/api/jogada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: estado, ocupado: ocupado })
    })
    .then(res => res.json())
    .then(data => {
        const jogada = data.jogada;
        const simboloAtual = redeSimbolo;
        const posX = simboloAtual === "X" ? jogada : jogada + 9;
        const celulas = document.querySelectorAll(".celula");

        if (estado[posX] === 1 || estado[jogada + 9] === 1) return;

        estado[posX] = 1;
        celulas[jogada].textContent = simboloAtual;

        if (verificaVitoria(simboloAtual)) {
            jogoAtivo = false;
        }
    });
}

function verificaVitoria(simbolo) {
    const celulas = document.querySelectorAll(".celula");
    const mapa = Array.from({ length: 9 }, (_, i) => {
        const x = simbolo === "X" ? estado[i] : estado[i + 9];
        return x === 1 ? simbolo : "";
    });

    const linhas = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
        [0, 4, 8], [2, 4, 6]             // diagonais
    ];

    for (const [a, b, c] of linhas) {
        if (mapa[a] === simbolo && mapa[b] === simbolo && mapa[c] === simbolo) {
            [a, b, c].forEach(i => celulas[i].classList.add("vitoria"));
            return true;
        }
    }

    return false;
}
