const API_URL = "http://localhost:8000/extrato";

const lista = document.getElementById("lista");
const saldoAtual = document.getElementById("saldoAtual");
const saldo = document.getElementById("saldo");
const userName = document.getElementById("userName");
const emptyState = document.getElementById("emptyState");

function getToken() {
  return localStorage.getItem("access_token");
}

function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("usuario_email");
  window.location.href = "login.html";
}

function renderEmptyState() {
  if (!lista) return;
  lista.innerHTML = "";
  if (emptyState) {
    emptyState.classList.remove("d-none");
  }
}

function renderExtrato(dados) {
  if (!lista) return;

  lista.innerHTML = "";
  if (emptyState) {
    emptyState.classList.toggle("d-none", Array.isArray(dados) && dados.length > 0);
  }

  if (!Array.isArray(dados) || dados.length === 0) {
    renderEmptyState();
    return;
  }

  let totalReceitas = 0;
  let totalDespesas = 0;

  dados.forEach((item) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2";

    const tipo = item.tipo === "Receita" ? "text-success" : "text-danger";
    const dataTexto = item.data ? new Date(item.data).toLocaleDateString("pt-BR") : "Sem data";

    li.innerHTML = `
      <div class="item-info">
        <strong>${item.descricao}</strong><br>
        <small>${dataTexto}</small>
        <div class="mt-1"><span class="badge ${tipo} badge-pill">${item.tipo}</span></div>
      </div>

      <div class="item-actions d-flex align-items-center flex-wrap gap-2">
        <strong>${formatCurrency(item.valor)}</strong>
        <button class="btn btn-warning btn-sm" onclick="editarExtrato(${item.id})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="excluirExtrato(${item.id})">Excluir</button>
      </div>
    `;

    lista.appendChild(li);

    if (item.tipo === "Receita") {
      totalReceitas += Number(item.valor || 0);
    } else {
      totalDespesas += Number(item.valor || 0);
    }
  });

  if (saldoAtual) {
    saldoAtual.innerHTML = `Saldo Atual ${formatCurrency(totalReceitas - totalDespesas)}`;
    saldoAtual.className = `mb-0 ${totalReceitas - totalDespesas >= 0 ? "text-success" : "text-danger"}`;
  }

  if (saldo) {
    saldo.innerHTML = `Total gasto ${formatCurrency(totalDespesas)}`;
    saldo.className = "mb-0 text-danger";
  }

  if (userName) {
    const email = localStorage.getItem("usuario_email") || "Usuário";
    userName.textContent = `Olá, ${email}`;
  }
}

async function listarExtrato() {
  const token = getToken();

  if (!token) {
    logout();
    return;
  }

  if (lista) {
    lista.innerHTML = '<li class="list-group-item text-center">Carregando...</li>';
  }

  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return;
      }
      throw new Error("Erro ao buscar o extrato.");
    }

    const dados = await response.json();
    renderExtrato(dados);
  } catch (erro) {
    console.error(erro);
    if (lista) {
      lista.innerHTML = '<li class="list-group-item text-danger">Não foi possível carregar o extrato.</li>';
    }
  }
}

async function editarExtrato(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Não foi possível buscar o item.");
    }

    const item = await response.json();
    const novaDescricao = prompt("Descrição", item.descricao);
    const novoValor = prompt("Valor", item.valor);
    const novoTipo = prompt("Tipo (Receita ou Despesa)", item.tipo);

    if (novaDescricao === null || novoValor === null || novoTipo === null) {
      return;
    }

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        descricao: novaDescricao,
        valor: Number(novoValor),
        tipo: novoTipo,
      }),
    });

    listarExtrato();
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível editar o lançamento.");
  }
}

async function excluirExtrato(id) {
  if (!confirm("Deseja excluir este registro?")) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    listarExtrato();
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível excluir o lançamento.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

  listarExtrato();
});

window.logout = logout;
window.listarExtrato = listarExtrato;
window.editarExtrato = editarExtrato;
window.excluirExtrato = excluirExtrato;