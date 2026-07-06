const API_BASE = "http://localhost:8000";

function getToken() {
  return localStorage.getItem("access_token");
}

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

function formatCurrency(value) {
  const num = (Number(value) || 0) / 100;

  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(d) {
  if (!d) return "Sem data";

  try {
    return new Date(d).toLocaleDateString("pt-BR");
  } catch {
    return d;
  }
}
function setUserName() {

  const userNameEl =
    document.getElementById("userName");

  const nome =
    localStorage.getItem("usuario_nome");

  if (userNameEl) {

    userNameEl.textContent =

      nome

        ?

        `Olá, ${nome}`

        :

        "Olá, usuário";

  }

}

function normalizeTransacoes(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (!payload || typeof payload !== "object") {
    return [];
  }
  if (Array.isArray(payload.items)) {
    return payload.items;
  }
  if (Array.isArray(payload.transacoes)) {
    return payload.transacoes;
  }
  if (Array.isArray(payload.movimentos)) {
    return payload.movimentos;
  }
  return [];
}

function renderTransacoes(lista) {
  const ul = document.getElementById("recentes");
  const emptyState = document.getElementById("emptyState");

  if (!ul) return;

  const transacoes = normalizeTransacoes(lista);
  ul.innerHTML = "";

  if (!transacoes.length) {
    if (emptyState) {
      emptyState.classList.remove("d-none");
    }
    return;
  }

  if (emptyState) {
    emptyState.classList.add("d-none");
  }

  transacoes.forEach((item) => {
    const tipo = item.tipo || item.tipo_transacao || item.classificacao || "Movimento";
    const descricao = item.descricao || item.descricao_lancamento || item.nome || "Sem descrição";
    const valor = Number(item.valor ?? item.valor_total ?? 0);
    const dataTexto = item.data || item.data_lancamento || item.created_at || item.data_criacao;
    const badgeClass = /receita|entrada|credit/i.test(String(tipo)) ? "badge-success" : "badge-danger";

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2";

    li.innerHTML = `
      <div>
        <div class="font-weight-bold">${tipo} - ${descricao}</div>
        <small class="text-muted">${formatDate(dataTexto)}</small>
      </div>
      <div class="badge badge-pill ${badgeClass}">${formatCurrency(valor)}</div>
    `;

    ul.appendChild(li);
  });
}

function logout() {

  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("usuario_email");
  localStorage.removeItem("usuario_nome");

  window.location.href = "login.html";

}

async function adicionarSaldo() {
  const valorInput = document.getElementById("valorSaldo");
  const valor = Number(valorInput?.value);

  if (!valorInput || Number.isNaN(valor) || valor <= 0) {
    alert("Informe um valor válido para adicionar ao saldo.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/extrato`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        descricao: "Saldo adicionado",
        valor: Math.round(valor * 100),
        tipo: "Receita",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.detail?.mensagem || "Não foi possível adicionar o saldo.");
    }

    valorInput.value = "";
    $("#modalSaldo").modal("hide");
    await carregarDashboard();
    alert("Saldo adicionado com sucesso!");
  } catch (error) {
    console.error(error);
    alert(error.message || "Não foi possível adicionar o saldo.");
  }
}

async function carregarTransacoesRecentes() {
  const recentesEl = document.getElementById("recentes");

  if (recentesEl) {
    recentesEl.innerHTML =
      '<li class="list-group-item text-center">Carregando...</li>';
  }

  try {
    const [extratoResponse, despesasResponse] = await Promise.all([
      fetch(`${API_BASE}/extrato`, {
        headers: getAuthHeaders(),
      }),
      fetch(`${API_BASE}/despesas`, {
        headers: getAuthHeaders(),
      }),
    ]);

    const transacoes = [];

    if (extratoResponse.ok) {
      const lista = await extratoResponse.json();
      transacoes.push(...normalizeTransacoes(lista));
    }

    if (despesasResponse.ok) {
      const despesas = await despesasResponse.json();

      transacoes.push(
        ...despesas.map((item) => ({
          tipo: "Despesa",
          descricao: item.descricao,
          valor: Number(item.valor ?? 0),
          data: item.data,
        }))
      );
    }

    renderTransacoes(transacoes);

  } catch (erro) {
    console.error(erro);

    if (recentesEl) {
      recentesEl.innerHTML =
        '<li class="list-group-item text-danger">Erro ao carregar.</li>';
    }
  }
}

async function carregarDashboard() {
  const saldoEl = document.getElementById("saldo");
  const receitasEl = document.getElementById("totalReceitas");
  const despesasEl = document.getElementById("totalDespesas");
  const qtdReceitasEl = document.getElementById("qtdReceitas");
  const qtdDespesasEl = document.getElementById("qtdDespesas");

  try {
    const dashboardResponse = await fetch(`${API_BASE}/dashboard`, {
      headers: getAuthHeaders(),
    });

    if (!dashboardResponse.ok) {
      if (dashboardResponse.status === 401) {
        logout();
        return;
      }
      throw new Error("Erro ao carregar o dashboard.");
    }

    const dashboardData = await dashboardResponse.json();

    if (saldoEl) {
      saldoEl.textContent = formatCurrency(dashboardData.saldo);
      saldoEl.className = `display-4 mb-0 ${dashboardData.saldo >= 0 ? "text-success" : "text-danger"}`;
    }

    if (receitasEl) {
      receitasEl.textContent = formatCurrency(dashboardData.total_receitas);
    }

    if (despesasEl) {
      despesasEl.textContent = formatCurrency(dashboardData.total_despesas);
    }

    if (qtdReceitasEl) {
      qtdReceitasEl.textContent = dashboardData.quantidade_receitas;
    }

    if (qtdDespesasEl) {
      qtdDespesasEl.textContent = dashboardData.quantidade_despesas;
    }
  } catch (error) {
    console.error(error);
    if (saldoEl) {
      saldoEl.textContent = "Não foi possível carregar o saldo";
    }
  }

  await carregarTransacoesRecentes();
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  setUserName();

  await carregarDashboard();
});

window.logout = logout;
window.adicionarSaldo = adicionarSaldo;