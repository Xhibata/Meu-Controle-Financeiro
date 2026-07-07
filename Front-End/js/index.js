document.addEventListener("DOMContentLoaded", async () => {
  if (!Auth.isAuthenticated()) {
    return;
  }

  try {
    carregarUsuario();

    const extrato = await carregarExtrato();

    carregarDashboard(extrato);
  } catch (error) {
    console.error(error);

    if (error.status === 401) {
      Auth.logout();
      return;
    }

    Utils.mostrarErro(error.message);
  }
});

function carregarDashboard(lista) {

  const entradas = lista.filter(item => item.tipo === "Receita");

  const saidas = lista.filter(item => item.tipo === "Despesa");

  const totalEntradas = entradas.reduce(
      (total, item) => total + Number(item.valor),
      0
  );

  const totalSaidas = saidas.reduce(
      (total, item) => total + Number(item.valor),
      0
  );

  const saldo = totalEntradas - totalSaidas;

  document.getElementById("saldo").innerText =
      formatCurrency(saldo);

  document.getElementById("totalReceitas").innerText =
      formatCurrency(totalEntradas);

  document.getElementById("totalDespesas").innerText =
      formatCurrency(totalSaidas);

  document.getElementById("qtdReceitas").innerText =
      entradas.length;

  document.getElementById("qtdDespesas").innerText =
      saidas.length;
}

async function carregarExtrato() {
  const lista = await API.get("/dashboard/extrato");
  const ul = document.getElementById("recentes");

  ul.innerHTML = "";

  if (!lista.length) {
    ul.innerHTML = `
          <li class="list-group-item text-center text-muted">
              Nenhuma movimentação encontrada.
          </li>
      `;

    return [];
  }

  lista.forEach((item) => {
    const li = document.createElement("li");

    li.className =
      "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
          <div>
              <div class="font-weight-bold">
                  ${escapeHtml(item.tipo)} - ${escapeHtml(item.descricao)}
              </div>

              <small class="text-muted">
                  ${formatDate(item.data)}
              </small>
          </div>

          <span class="badge badge-primary badge-pill">
              ${formatCurrency(item.valor)}
          </span>
      `;

    ul.appendChild(li);
  });

  return lista;
}

function carregarUsuario() {
  const usuario = Auth.getUsuario();

  if (!usuario) return;

  document.getElementById("userName").innerText = `Olá, ${usuario.nome}`;
}

function formatCurrency(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function escapeHtml(text) {
  if (!text) return "";

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
