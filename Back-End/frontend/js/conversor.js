function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("usuario_email");
    localStorage.removeItem("usuario_nome");

    window.location.href = "login.html";
}

window.logout = logout;

async function converter() {
    const valor = parseFloat(document.getElementById("valor").value);
    const de = document.getElementById("moedaOrigem").value;
    const para = document.getElementById("moedaDestino").value;


    if (isNaN(valor) || valor <= 0) {
        document.getElementById("resultado").innerText = "Digite um valor válido.";
        return;
    }

    try {
        const res = await fetch(`https://api.exchangerate.host/convert?access_key=2ea627a828c0100d1e83367ca872ecf7&from=${de}&to=${para}&amount=${valor}`);
        const data = await res.json();

        if (!data.success || typeof data.result !== "number") {
            const mensagem = data.error?.info || "Erro ao converter.";
            document.getElementById("resultado").innerText = mensagem;
            return;
        }

        document.getElementById("resultado").classList.add("alert", "alert-info", "mt-4", "text-center");
        document.getElementById("resultado").innerText =
            `${valor} ${de} = ${data.result.toFixed(2)} ${para}`;

    } catch (error) {
        document.getElementById("resultado").innerText = "Erro ao converter.";
    }
}

document.getElementById("conversor-form").addEventListener("submit", function(e) {
    e.preventDefault();
    converter();
});