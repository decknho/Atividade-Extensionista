saldoInicial = 0;

function salvar(renda, gastos) {
    console.log("SALVAR FOI CHAMADO")
    renda = document.getElementById("renda").value;
    gastos = document.getElementById("gastos").value;
    document.getElementById("print_renda").innerHTML = "R$ " + renda;
    document.getElementById("print_gastos").innerHTML = "R$ " + gastos;
    document.getElementById("print_saldo").innerHTML = "R$ " + (parseFloat(renda) - parseFloat(gastos)).toFixed(2);
    saldoInicial = (parseFloat(renda) * 0.2).toFixed(2);
    document.getElementById("print_investimento").innerHTML = "R$ " + saldoInicial;
}


async function investimentoSelic() {
    console.log("INVESTIMENTO FOI CHAMADO")
    const response = await fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados?formato=json");
    const selic = await response.json();

    const ssaldoInicial = document.getElementById("print_investimento").value;
    const ssaldoMensal = document.getElementById("print_investimento").value;
    const aanos = document.getElementById("anos").value;

    const saldoInicial = parseFloat(ssaldoInicial);
    const saldoMensal = parseFloat(ssaldoMensal);
    const anos = parseInt(aanos);

    if (
        isNaN(saldoInicial) || saldoInicial < 0 ||
        isNaN(saldoMensal) || saldoMensal < 0 ||
        isNaN(anos) || anos <= 0
    ) {

        document.getElementById("resultado").innerText = "Preencha todos os campos corretamente!";
        return;

    }

    let saldo = saldoInicial;
    let meses = anos * 12;

    const porcentagemSelicMes = parseFloat(selic[selic.length - 1].valor) / 12;

    let historico = [];

    historico.push(saldoInicial);

    for (let i = 0; i < meses; i++) {

        saldo = saldo + saldoMensal + (porcentagemSelicMes / 100 * saldo);

        historico.push(saldo);

    }

    let labels = [];

    for (let i = 0; i < historico.length; i++) {

        labels.push("Mês " + i);

    }

    criarGrafico(labels, historico);

}


function criarGrafico(labels, dados) {

  const ctx = document.getElementById("graficoInvestimento");

  new Chart(ctx, {

    type: "line",

    data: {

      labels: labels,

      datasets: [{
        label: "Crescimento do investimento",
        data: dados,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
        fill: true
      }]

    },

    options: {

      responsive: true,

      plugins: {
        legend: {
          display: true
        }
      }

    }

  });

}