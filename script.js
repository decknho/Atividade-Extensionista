saldoInicial = 0;

function salvar(renda, gastos) {
    
    renda = document.getElementById("renda").value;
    gastos = document.getElementById("gastos").value;
    document.getElementById("print_renda").innerHTML = "R$ " + renda;
    document.getElementById("print_gastos").innerHTML = "R$ " + gastos;
    document.getElementById("print_saldo").innerHTML = "R$ " + (parseFloat(renda) - parseFloat(gastos)).toFixed(2);
    saldoInicial = ((parseFloat(renda) - parseFloat(gastos)) / 2).toFixed(2);
    document.getElementById("print_investimento").innerHTML = "R$ " + saldoInicial;
}


async function investimentoSelic() {

    console.log("Investir FOI CHAMADO")

    const response = await fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados/ultimos/1?formato=json");
    const selic = await response.json();

    let renda = document.getElementById("renda").value;
    let gastos = document.getElementById("gastos").value;

    let sugestao = ((parseFloat(renda) - parseFloat(gastos)) / 2).toFixed(2);
    sugestao = parseFloat(sugestao);

    const saldoMensal = sugestao;
    const anos = parseInt(document.getElementById("anos").value);

    if (
        isNaN(sugestao) || sugestao < 0 ||
        isNaN(saldoMensal) || saldoMensal < 0 ||
        isNaN(anos) || anos <= 0
    ) {

        document.getElementById("resultado").innerText = "Preencha todos os campos corretamente!";
        return;

    }

    let saldo = sugestao;
    const meses = anos * 12;

    const porcentagemSelicMes = parseFloat(selic[0].valor) / 12;

    let historico = [];

    historico.push(saldo);

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

    options: { responsive: true,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {

        y: {

          ticks: {

            callback: function(value) {
              return "R$ " + value.toLocaleString("pt-BR");
            }

          }

        }

      }

    }
    

  });

}