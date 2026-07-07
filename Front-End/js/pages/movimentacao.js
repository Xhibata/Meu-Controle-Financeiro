const params = new URLSearchParams(window.location.search);
const idMovimentacao = params.get("id");

document.addEventListener("DOMContentLoaded", inicializar);

async function inicializar() {
  carregarUsuario();

  document
    .getElementById("formMovimentacao")
    .addEventListener("submit", salvarMovimentacao);

  if (idMovimentacao) {
    document.querySelector(".page-header h1").textContent =
      "Editar movimentação";

    document.querySelector(".page-header p").textContent =
      "Altere os dados da movimentação.";

    document.querySelector("button[type='submit']").innerHTML = `
          <i class="bi bi-check-circle-fill"></i>
          Salvar alterações
      `;

    await carregarMovimentacao(idMovimentacao);
  }
}

async function obterSaldoAtual() {
  const extratos = await ExtratoService.listar();

  const entradas = extratos
    .filter((item) => item.tipo === "E")
    .reduce((total, item) => total + Number(item.valor), 0);

  const saidas = extratos
    .filter((item) => item.tipo === "S")
    .reduce((total, item) => total + Number(item.valor), 0);

  return entradas - saidas;
}

async function salvarMovimentacao(event) {
  event.preventDefault();

  const movimentacao = {
    descricao: document.getElementById("descricao").value.trim(),
    valor: Number(document.getElementById("valor").value),
    tipo: document.getElementById("tipo").value,
    data: document.getElementById("data").value,
  };

  let saldoAtual = await obterSaldoAtual();

  // Se estiver editando uma movimentação existente
  if (idMovimentacao) {
    const registroAtual = await ExtratoService.buscar(idMovimentacao);

    // Se o registro antigo era uma despesa, devolve seu valor ao saldo
    if (registroAtual.tipo === "S") {
      saldoAtual += Number(registroAtual.valor);
    }
  }

  if (movimentacao.tipo === "S" && movimentacao.valor > saldoAtual) {
    Utils.mostrarErro("Saldo insuficiente para realizar esta movimentação.");
    return;
  }

  try {
    if (idMovimentacao) {
      await ExtratoService.editar(idMovimentacao, movimentacao);

      Utils.mostrarMensagem("Movimentação atualizada com sucesso!");
    } else {
      await ExtratoService.criar(movimentacao);

      Utils.mostrarMensagem("Movimentação cadastrada com sucesso!");
    }

    window.location.href = "extrato.html";
  } catch (erro) {
    Utils.mostrarErro(erro.message);
  }
}

async function carregarMovimentacao(id) {
  try {
    const mov = await ExtratoService.buscar(id);

    document.getElementById("descricao").value = mov.descricao;
    document.getElementById("valor").value = mov.valor;
    document.getElementById("tipo").value = mov.tipo;
    document.getElementById("data").value = mov.data;
  } catch (erro) {
    Utils.mostrarErro(erro.message);

    window.location.href = "extrato.html";
  }
}

function carregarUsuario() {
  const usuario = Auth.getUsuario();

  if (!usuario) return;

  document.getElementById("userName").innerText = `Olá, ${usuario.nome}`;
}
