function criarDespesa(event) {
    event.preventDefault();

    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    const nome = document.getElementById("nome").value;
    const valor = parseFloat(document.getElementById("valor").value);

    if (!nome || isNaN(valor)) {
        alert("Erro: Preencha todos os campos corretamente.");
        return;
    }

    const agora = new Date();

    const dia = String(agora.getDate()).padStart(2, "0");
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const ano = String(agora.getFullYear()).slice(-2);

    const hora = String(agora.getHours()).padStart(2, "0");
    const minutos = String(agora.getMinutes()).padStart(2, "0");

    const despesa = {
        id: Date.now(),
        nome: nome,
        valor: valor,
        data: `${dia}/${mes}/${ano}`,
        hora: `${hora}:${minutos}`
    };

    addUserDespesa(currentUser, despesa);

    document.getElementById("nome").value = "";
    document.getElementById("valor").value = "";

    abrirPopup();
}

function abrirPopup() {
    document.getElementById("popup").style.display = "flex";
}

function fecharPopup() {
    document.getElementById("popup").style.display = "none";
}

function irParaExtrato() {
    window.location.href = "extrato.html";
}