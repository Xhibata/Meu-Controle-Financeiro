const API_URL = "http://localhost:8000/despesas";

function getToken() {
  return localStorage.getItem("access_token");
}

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`,
  };
}

function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("usuario_email");
  window.location.href = "login.html";
}

async function criarDespesa(event) {
  event.preventDefault();

  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const nome = document.getElementById("nome").value.trim();
  const valor = parseFloat(document.getElementById("valor").value);

  if (!nome || Number.isNaN(valor) || valor <= 0) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const novaDespesa = {
    descricao: nome,
    valor: Math.round(valor * 100),
  };

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(novaDespesa),
    });

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      throw new Error(dados?.detail?.mensagem || "Erro ao salvar despesa no servidor.");
    }

    document.getElementById("nome").value = "";
    document.getElementById("valor").value = "";
    abrirPopup();
  } catch (erro) {
    console.error("Erro ao criar despesa:", erro);
    alert(erro.message || "Não foi possível salvar a despesa no servidor.");
  }
}

function abrirPopup() {
  document.getElementById("popup").style.display = "flex";
}

function fecharPopup() {
  document.getElementById("popup").style.display = "none";
  window.location.href = "index.html";
}

function irParaExtrato() {
  window.location.href = "extrato.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
});

window.logout = logout;
window.criarDespesa = criarDespesa;
window.abrirPopup = abrirPopup;
window.fecharPopup = fecharPopup;
window.irParaExtrato = irParaExtrato;
