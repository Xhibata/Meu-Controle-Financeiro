/**
 * ==========================================================
 * MAIN.JS
 * ----------------------------------------------------------
 * Responsável por proteger as páginas privadas.
 * ==========================================================
 */

const PAGINAS_PUBLICAS = [
    "login.html",
    "cadastro.html"
];

document.addEventListener("DOMContentLoaded", verificarAutenticacao);

function verificarAutenticacao() {

    const paginaAtual = window.location.pathname.split("/").pop();

    const paginaPublica = PAGINAS_PUBLICAS.includes(paginaAtual);

    const autenticado = Auth.isAuthenticated();

    // Usuário não autenticado tentando acessar página privada
    if (!autenticado && !paginaPublica) {

        window.location.replace("login.html");
        return;

    }

    // Usuário autenticado tentando acessar login ou cadastro
    if (autenticado && paginaPublica) {

        window.location.replace("index.html");
        return;

    }

}