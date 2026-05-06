function criarDespesa() {
    const nome = document.getElementById("nome").value;
    const valor = document.getElementById("valor").value;

    if (!nome || !valor) {
        alert("Preencha todos os campos!");
        return;
    }

    // Criar objeto da despesa
    const despesa = {
        nome: nome,
        valor: valor
    };

    // Pegar despesas já salvas
    let despesas = JSON.parse(localStorage.getItem("despesas")) || [];

    // Adicionar nova despesa
    despesas.push(despesa);

    // Salvar novamente
    localStorage.setItem("despesas", JSON.stringify(despesas));

    // Redirecionar para página de extrato
    window.location.href = "../extrato.html";
}