document.addEventListener("DOMContentLoaded", inicializar);

async function inicializar() {
  carregarUsuario();

  await carregarExtratos();
}

async function carregarExtratos() {
  const lista = await ExtratoService.listar();

  const tbody = document.getElementById("tabelaExtratos");

  tbody.innerHTML = "";

  lista.forEach((item) => {
    tbody.innerHTML += `
            <tr>

                <td>
                ${
                  item.tipo === "E"
                    ? `
                  <span class="badge-tipo badge-receita">

                      <i class="bi bi-arrow-down-circle-fill"></i>

                      Receita

                  </span>
                  `
                    : `
                  <span class="badge-tipo badge-despesa">

                      <i class="bi bi-arrow-up-circle-fill"></i>

                      Despesa

                  </span>
                  `
                }
                </td>

                <td>
                    ${escapeHtml(item.descricao)}
                </td>

                <td>
                    ${formatCurrency(item.valor)}
                </td>

                <td>
                    ${formatDate(item.data)}
                </td>

                <td>

                    <button
                        class="btn btn-sm btn-warning"
                        onclick="editar(${item.id})">

                        <i class="fa fa-pencil"></i>

                    </button>

                    <button
                        class="btn btn-sm btn-danger"
                        onclick="excluir(${item.id})">

                        <i class="fa fa-trash"></i>

                    </button>

                </td>

            </tr>
        `;
  });
}

function editar(id) {
  window.location.href = `movimentacao.html?id=${id}`;
}

async function excluir(id) {
  if (!confirm("Deseja remover esta movimentação?")) return;

  try {
    await ExtratoService.remover(id);

    Utils.mostrarMensagem("Movimentação removida.");

    carregarExtratos();
  } catch (erro) {
    Utils.mostrarErro(erro.message);
  }
}

function carregarUsuario() {
  const usuario = Auth.getUsuario();

  if (!usuario) return;

  document.getElementById("userName").innerText = `Olá, ${usuario.nome}`;
}

async function limparExtrato() {
  const confirmar = confirm("Deseja realmente remover TODAS as movimentações?");

  if (!confirmar) return;

  try {
    await ExtratoService.limpar();

    Utils.mostrarMensagem("Extrato limpo com sucesso.");

    carregarExtratos();
  } catch (erro) {
    Utils.mostrarErro(erro.message);
  }
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
