document.addEventListener("DOMContentLoaded", inicializar);

function inicializar() {

    document.getElementById("userName").innerText =
        `Olá, ${Auth.getNomeUsuario()}`;

    document
        .getElementById("formMovimentacao")
        .addEventListener("submit", salvarMovimentacao);
}

async function salvarMovimentacao(event) {
  event.preventDefault();

  const movimentacao = {
    descricao: document.getElementById("descricao").value.trim(),

    valor: Number(document.getElementById("valor").value),

    tipo: document.getElementById("tipo").value,

    data: document.getElementById("data").value || null,
  };

  try {
    await ExtratoService.criar(movimentacao);

    Utils.mostrarMensagem("Movimentação cadastrada com sucesso.");

    document.getElementById("formMovimentacao").reset();
  } catch (erro) {
    Utils.mostrarErro(erro.message);
  }
}
