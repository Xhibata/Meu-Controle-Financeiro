/**
 * ==========================================================
 * LOGIN.JS
 * ----------------------------------------------------------
 * Responsável pela autenticação do usuário.
 * ==========================================================
 */

document.addEventListener("DOMContentLoaded", inicializarPagina);

function inicializarPagina() {
  const mensagem = sessionStorage.getItem("mensagem");

  if (mensagem) {
    Utils.mostrarMensagem(mensagem);
    sessionStorage.removeItem("mensagem");
  }

  const formulario = document.getElementById("formLogin");

  formulario.addEventListener("submit", realizarLogin);
}

async function realizarLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();

  const senha = document.getElementById("senha").value.trim();

  if (email === "") {
    Utils.mostrarErro("Informe o e-mail.");
    return;
  }

  if (senha === "") {
    Utils.mostrarErro("Informe a senha.");
    return;
  }

  try {
    // Realiza o login
    await Auth.login(email, senha);

    Utils.mostrarMensagem("Login realizado com sucesso!");

    // Redireciona para a página inicial
    window.location.href = "index.html";
  } catch (erro) {
    Utils.mostrarErro(erro.message);
  }
}
