function carregarDashboard() {
  const saldoEl = document.getElementById("saldo");
  const lista = document.getElementById("recentes");

  const despesas = JSON.parse(localStorage.getItem("despesas")) || [];
  const saldoAdicionado = parseFloat(localStorage.getItem("saldoAdicionado")) || 0;

  lista.innerHTML = "";

  let totalDespesas = 0;

  despesas.forEach((d) => {
    totalDespesas += d.valor;
  });

  const saldoFinal = saldoAdicionado - totalDespesas;

  saldoEl.textContent = "R$ " + saldoFinal.toFixed(2);

  const recentes = despesas.slice(0, 5);

  recentes.forEach((d) => {
    const item = document.createElement("li");

    item.classList.add("list-group-item");

    item.textContent = `${d.nome} - R$ ${d.valor.toFixed(2)}`;

    lista.appendChild(item);
  });
}

function abrirModalSaldo() {
  $("#modalSaldo").modal("show");
}

function fecharModalSaldo() {
  $("#modalSaldo").modal("hide");
}

function adicionarSaldo() {
  const input = document.getElementById("valorSaldo");
  const valor = parseFloat(input.value);

  if (isNaN(valor) || valor <= 0) {
    alert("Digite um valor válido!");
    return;
  }

  let saldoAdicionado = parseFloat(localStorage.getItem("saldoAdicionado")) || 0;

  saldoAdicionado += valor;

  localStorage.setItem("saldoAdicionado", saldoAdicionado);

  input.value = "";

  fecharModalSaldo();

  carregarDashboard();
}

carregarDashboard();

window.addEventListener("storage", carregarDashboard);