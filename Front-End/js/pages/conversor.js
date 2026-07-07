async function converter() {
  const valor = parseFloat(document.getElementById("valor").value);
  const de = document.getElementById("moedaOrigem").value;
  const para = document.getElementById("moedaDestino").value;

  if (isNaN(valor) || valor <= 0) {
    document.getElementById("resultado").innerText = "Digite um valor válido.";
    return;
  }

  try {
    const res = await fetch(
      `https://api.exchangerate.host/convert?access_key=2ea627a828c0100d1e83367ca872ecf7&from=${de}&to=${para}&amount=${valor}`
    );
    const data = await res.json();
    console.log(data);

    if (!data.success || typeof data.result !== "number") {
      const mensagem = data.error?.info || "Erro ao converter.";
      document.getElementById("resultado").innerText = mensagem;
      return;
    }

    const resultado = document.getElementById("resultado");

    resultado.style.display = "block";

    resultado.innerHTML = `
    <div class="card-body text-center">

        <h3>Resultado</h3>

        <h2 style="color: var(--primary); margin:20px 0;">
            ${data.result.toFixed(2)} ${para}
        </h2>

        <p>
            ${valor} ${de}
        </p>

    </div>
    `;
  } catch (error) {
    document.getElementById("resultado").innerText = "Erro ao converter.";
  }
}

document
  .getElementById("conversor-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    converter();
  });
