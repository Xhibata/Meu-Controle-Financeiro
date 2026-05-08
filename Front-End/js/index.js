function carregarDashboard() {
      const saldoEl = document.getElementById("saldo");
      const lista = document.getElementById("recentes");

      const despesas = JSON.parse(localStorage.getItem("despesas")) || [];

      const saldoAdicionado =
        parseFloat(localStorage.getItem("saldoAdicionado")) || 0;

      lista.innerHTML = "";

      let totalDespesas = 0;

      despesas.forEach((d) => {
        totalDespesas += d.valor;
      });

      const saldoFinal = saldoAdicionado - totalDespesas;

      saldoEl.textContent = "R$ " + saldoFinal.toFixed(2);

      const recentes = despesas.slice(-5).reverse();

      recentes.forEach((d) => {
        const item = document.createElement("li");

        item.classList.add("list-group-item");

        item.textContent = `${d.nome} - R$ ${d.valor.toFixed(2)}`;

        lista.appendChild(item);
      });
    }

    function abrirPopup() {
      $("#popupSaldo").modal("show");
    }

    function adicionarSaldo() {
      const input = document.getElementById("valorSaldo");

      const valor = parseFloat(input.value);

      if (isNaN(valor) || valor <= 0) {
        alert("Digite um valor válido!");

        return;
      }

      let saldoAdicionado =
        parseFloat(localStorage.getItem("saldoAdicionado")) || 0;

      saldoAdicionado += valor;

      localStorage.setItem("saldoAdicionado", saldoAdicionado);

      input.value = "";

      $("#popupSaldo").modal("hide");

      carregarDashboard();
    }

    carregarDashboard();

    setInterval(carregarDashboard, 1000);

    window.addEventListener("storage", carregarDashboard);