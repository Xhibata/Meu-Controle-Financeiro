async function criarDespesa(event) {
    event.preventDefault();

    const token = localStorage.getItem('access_token');
    const base = 'http://localhost:8000';

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const nome = document.getElementById("nome").value;
    const valor = parseFloat(document.getElementById("valor").value);

    if (!nome || isNaN(valor)) {
        alert("Erro: Preencha todos os campos corretamente.");
        return;
    }

    // Monta o objeto no formato esperado pela API do seu backend
    const novaDespesa = {
        descricao: nome, // Geralmente o backend espera 'descricao' ou 'nome'
        valor: valor
    };

    try {
        // Faz a requisição POST para salvar no banco de dados através do backend
        const resposta = await fetch(`${base}/despesas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(novaDespesa)
        });

        if (!resposta.ok) {
            throw new Error('Erro ao salvar despesa no servidor');
        }

        // Limpa os campos após o sucesso
        document.getElementById("nome").value = "";
        document.getElementById("valor").value = "";

        // Abre o popup visual de confirmação existente na sua tela
        abrirPopup();

    } catch (erro) {
        console.error('Erro ao criar despesa:', erro);
        alert('Não foi possível salvar a despesa no servidor.');
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
    window.location.href = "index.html";
}
