let dadosMesAtual = {};

function gerarCamposVeiculos() {
const container = document.getElementById("veiculosContainer");
container.innerHTML = "";

const qtd = parseInt(document.getElementById("qtdVeiculos").value);

for (let i = 1; i <= qtd; i++) {
container.innerHTML += `
<div class="veiculo">
<h3>Veículo ${i}</h3>

<label>Nome do Veículo:</label>
<input type="text" id="nome${i}">

<label>Valor da Diária (R$):</label>
<input type="number" id="diaria${i}">

<label>Quantidade de Diárias Usadas:</label>
<input type="number" id="usos${i}">

<label>Dias que Rodou:</label>
<input type="number" id="rodou${i}">
</div>
`;
}
}

function calcular() {

const mes = document.getElementById("mes").value;
const auxilio = parseFloat(document.getElementById("auxilio").value);
const qtd = parseInt(document.getElementById("qtdVeiculos").value);
const alunosIntegrais = parseInt(document.getElementById("alunosIntegrais").value);
const alunosDesconto = parseInt(document.getElementById("alunosDesconto").value);

let totalDiarias = 0;
let detalhesVeiculos = [];

for (let i = 1; i <= qtd; i++) {

const nome = document.getElementById(`nome${i}`).value;
const diaria = parseFloat(document.getElementById(`diaria${i}`).value);
const usos = parseInt(document.getElementById(`usos${i}`).value);
const rodou = parseInt(document.getElementById(`rodou${i}`).value);

const totalVeiculo = diaria * usos;

totalDiarias += totalVeiculo;

detalhesVeiculos.push({
nome,
diaria,
usos,
rodou,
totalVeiculo
});
}

const saldoFinal = auxilio - totalDiarias;

let advertencias = 0;

if (saldoFinal < 0) {
advertencias = 1;
}

const resultadoDiv = document.getElementById("resultado");

resultadoDiv.innerHTML = `
<div class="resultado-box">
<p><strong>Mês:</strong> ${mes}</p>
<p><strong>Auxílio:</strong> R$ ${auxilio.toFixed(2)}</p>
<p><strong>Total de Diárias:</strong> R$ ${totalDiarias.toFixed(2)}</p>
<p><strong>Saldo Final:</strong> R$ ${saldoFinal.toFixed(2)}</p>
<p><strong>Alunos Integrais:</strong> ${alunosIntegrais}</p>
<p><strong>Alunos com Desconto:</strong> ${alunosDesconto}</p>
</div>
`;

detalhesVeiculos.forEach(v => {
resultadoDiv.innerHTML += `
<div class="resultado-box">
<p><strong>${v.nome}</strong></p>
<p>Diária: R$ ${v.diaria}</p>
<p>Usos: ${v.usos}</p>
<p>Dias que rodou: ${v.rodou}</p>
<p>Total: R$ ${v.totalVeiculo.toFixed(2)}</p>
</div>
`;
});

dadosMesAtual = {
mes,
auxilio,
totalDiarias,
saldoFinal,
alunosIntegrais,
alunosDesconto,
detalhesVeiculos
};
}

function salvarMes() {

let historico = JSON.parse(localStorage.getItem("historicoFinanceiro")) || [];

historico.push(dadosMesAtual);

localStorage.setItem("historicoFinanceiro", JSON.stringify(historico));

carregarHistorico();
}

function carregarHistorico() {

let historico = JSON.parse(localStorage.getItem("historicoFinanceiro")) || [];

const div = document.getElementById("historico");
div.innerHTML = "";

historico.forEach(item => {
div.innerHTML += `
<div class="item-historico">
<p><strong>${item.mes}</strong></p>
<p>Auxílio: R$ ${item.auxilio}</p>
<p>Total Diárias: R$ ${item.totalDiarias}</p>
<p>Saldo: R$ ${item.saldoFinal}</p>
</div>
`;
});
}

function exportarJSON() {

const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dadosMesAtual, null, 2));
const dlAnchorElem = document.createElement('a');
dlAnchorElem.setAttribute("href", dataStr);
dlAnchorElem.setAttribute("download", `relatorio_${dadosMesAtual.mes}.json`);
dlAnchorElem.click();
}

window.onload = carregarHistorico;
