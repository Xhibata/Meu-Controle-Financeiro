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
  const userNameEl = document.getElementById("userName");
  const email = localStorage.getItem("usuario_email");

  if (userNameEl) {
    userNameEl.textContent = email ? `Olá, ${email}` : "Olá, usuário";
  }
}

function renderTransacoes(lista) {
  const ul = document.getElementById("recentes");
  const emptyState = document.getElementById("emptyState");

  if (!ul) return;

  ul.innerHTML = "";

  if (!lista || lista.length === 0) {
    if (emptyState) {
      emptyState.classList.remove("d-none");
    }
    return;
  }

  if (emptyState) {
    emptyState.classList.add("d-none");
  }

  lista.forEach((item) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2";

    li.innerHTML = `
      <div>
        <div class="font-weight-bold">${item.tipo} - ${item.descricao}</div>
        <small class="text-muted">${formatDate(item.data)}</small>
      </div>
      <div class="badge badge-pill badge-secondary">${formatCurrency(item.valor)}</div>
    `;

    ul.appendChild(li);
  });
}

function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("usuario_email");
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
    $(["#modalSaldo"]).modal("hide");
    await carregarDashboard();
    alert("Saldo adicionado com sucesso!");
  } catch (error) {
    console.error(error);
    alert(error.message || "Não foi possível adicionar o saldo.");
  }
}

async function carregarDashboard() {
  const saldoEl = document.getElementById("saldo");
  const receitasEl = document.getElementById("totalReceitas");
  const despesasEl = document.getElementById("totalDespesas");
  const qtdReceitasEl = document.getElementById("qtdReceitas");
  const qtdDespesasEl = document.getElementById("qtdDespesas");
  const recentesEl = document.getElementById("recentes");

  if (recentesEl) {
    recentesEl.innerHTML = '<li class="list-group-item text-center">Carregando...</li>';
  }

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

  try {
    const extratoResponse = await fetch(`${API_BASE}/dashboard/extrato`, {
      headers: getAuthHeaders(),
    });

    if (!extratoResponse.ok) {
      if (extratoResponse.status === 401) {
        logout();
        return;
      }
      throw new Error("Erro ao carregar o extrato.");
    }

    const lista = await extratoResponse.json();
    renderTransacoes(lista);
  } catch (error) {
    console.error(error);
    if (recentesEl) {
      recentesEl.innerHTML = '<li class="list-group-item text-danger">Não foi possível carregar as transações.</li>';
    }
  }
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