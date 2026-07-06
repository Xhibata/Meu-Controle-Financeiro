document.addEventListener("DOMContentLoaded", async () => {

  if (!Auth.isAuthenticated()) {
    return;
  }

  try {
    carregarUsuario();
    await carregarDashboard();
    await carregarExtrato();
  } catch (error) {
    console.error(error);

    if (error.status === 401) {
        Auth.logout();
        return;
    }

    Utils.mostrarErro(error.message);
  }
});

async function carregarDashboard() {
  const dashboard = await API.get("/dashboard");

  document.getElementById("saldo").innerText =
    formatCurrency(dashboard.saldo);

  document.getElementById("totalReceitas").innerText =
    formatCurrency(dashboard.total_receitas);

  document.getElementById("totalDespesas").innerText =
    formatCurrency(dashboard.total_despesas);

  document.getElementById("qtdReceitas").innerText =
    dashboard.quantidade_receitas;

  document.getElementById("qtdDespesas").innerText =
    dashboard.quantidade_despesas;
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
    return;
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
}

function carregarUsuario() {
  const usuario = Auth.getUsuario();

  if (!usuario) return;

  document.getElementById("userName").innerText =
    `Olá, ${usuario.nome}`;
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