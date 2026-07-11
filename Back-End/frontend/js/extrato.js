const API_URL = "http://localhost:8000/extrato";
const DESPESAS_URL = "http://localhost:8000/despesas";

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
  const amount = Number(value || 0) / 100;

  return amount.toLocaleString("pt-BR", {
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

function normalizeLancamentos(dados) {
  if (!Array.isArray(dados)) {
    return [];
  }

  return dados.map((item) => ({
    id: item.id,
    tipo: item.tipo || item.tipo_transacao || item.classificacao || "Despesa",
    descricao: item.descricao || item.descricao_lancamento || item.nome || "Sem descrição",
    valor: Number(item.valor ?? item.valor_total ?? 0),
    data: item.data || item.data_lancamento || item.created_at || item.data_criacao || null,
    source: item.source || "extrato",
  }));
}

function renderExtrato(dados) {
  if (!lista) return;

  const lancamentos = normalizeLancamentos(dados);

  lista.innerHTML = "";
  if (emptyState) {
    emptyState.classList.toggle("d-none", lancamentos.length > 0);
  }

  if (!lancamentos.length) {
    renderEmptyState();
    return;
  }

  let totalReceitas = 0;
  let totalDespesas = 0;

  lancamentos.forEach((item) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2";

    const tipo = item.tipo === "Receita" ? "text-success" : "text-danger";
    const dataTexto = item.data ? new Date(item.data).toLocaleDateString("pt-BR") : "Sem data";
    const tipoItem = item.tipo || "Despesa";
    const podeEditar = Number.isInteger(item.id);
    const botoesAcoes = podeEditar
      ? `
        <button class="btn btn-warning btn-sm" onclick="editarExtrato(${item.id}, '${item.source || 'extrato'}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="excluirExtrato(${item.id}, '${item.source || 'extrato'}')">Excluir</button>
      `
      : "";

    li.innerHTML = `
      <div class="item-info">
        <strong>${item.descricao}</strong><br>
        <small>${dataTexto}</small>
        <div class="mt-1"><span class="badge ${tipo} badge-pill">${tipoItem}</span></div>
      </div>

      <div class="item-actions d-flex align-items-center flex-wrap gap-2">
        <strong>${formatCurrency(item.valor)}</strong>
        ${botoesAcoes}
      </div>
    `;

    lista.appendChild(li);

    if (tipoItem === "Receita") {
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
    lista.innerHTML =
      '<li class="list-group-item text-center">Carregando...</li>';
  }

  try {
    const [extratoResponse, despesasResponse] = await Promise.all([
      fetch(API_URL, {
        headers: getAuthHeaders(),
      }),

      fetch(DESPESAS_URL, {
        headers: getAuthHeaders(),
      }),
    ]);

    const lancamentos = [];

    if (extratoResponse.ok) {
      const dados = await extratoResponse.json();

      lancamentos.push(...normalizeLancamentos(dados));
    }

    if (despesasResponse.ok) {
      const dados = await despesasResponse.json();

      lancamentos.push(
        ...dados.map((item) => ({
          id: item.id,
          tipo: "Despesa",
          descricao: item.descricao || "Sem descrição",
          valor: Number(item.valor ?? 0),
          data: item.data || null,
          source: "despesa",
        }))
      );
    }

    renderExtrato(lancamentos);

  } catch (erro) {
    console.error(erro);

    if (lista) {
      lista.innerHTML =
        '<li class="list-group-item text-danger">Não foi possível carregar o extrato.</li>';
    }
  }
}

async function editarExtrato(id, source = "extrato") {
  const endpoint = source === "despesa" ? `${DESPESAS_URL}/${id}` : `${API_URL}/${id}`;

  try {
    const response = await fetch(endpoint, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Não foi possível buscar o item.");
    }

    const item = await response.json();
    const novaDescricao = prompt("Descrição", item.descricao);
    const novoValor = prompt("Valor", item.valor / 100);

    if (novaDescricao === null || novoValor === null) {
      return;
    }

    const body = source === "despesa"
      ? {
        descricao: novaDescricao,
        valor: Math.round(Number(novoValor) * 100),
      }
      : {
        descricao: novaDescricao,
        valor: Math.round(Number(novoValor) * 100),
        tipo: item.tipo || "Despesa",
      };

    await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(body),
    });

    listarExtrato();
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível editar o lançamento.");
  }
}

async function excluirExtrato(id, source = "extrato") {
  if (!confirm("Deseja excluir este registro?")) return;

  const endpoint = source === "despesa" ? `${DESPESAS_URL}/${id}` : `${API_URL}/${id}`;

  try {
    await fetch(endpoint, {
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