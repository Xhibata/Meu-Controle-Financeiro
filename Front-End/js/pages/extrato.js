function carregarExtrato() {
    const lista = document.getElementById("lista");
    const totalEl = document.getElementById("saldo");
    const saldoAtualEl = document.getElementById("saldoAtual");

    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    lista.innerHTML = "";

    const despesas = getUserDespesas(currentUser);
    const saldoAdicionado = getUserSaldo(currentUser);

    let total = 0;

    despesas.forEach((d) => {
        const item = document.createElement("li");
        item.classList.add(
            "list-group-item",
            "d-flex",
            "justify-content-between",
            "align-items-center"
        );

        item.innerHTML = `
  <div>
    <strong>${d.nome}</strong><br>
    <small>${d.data} às ${d.hora}</small>
  </div>

  <span class="badge badge-danger badge-pill">
    R$ ${d.valor.toFixed(2)}
  </span>
`;

        lista.appendChild(item);
        total += d.valor;
    });

    totalEl.textContent = "Total gasto R$ " + total.toFixed(2);

    const saldoFinal = saldoAdicionado - total;
    saldoAtualEl.textContent = "Saldo Atual R$ " + saldoFinal.toFixed(2);

    if (saldoFinal > 0) {
        saldoAtualEl.classList.remove("text-danger");
        saldoAtualEl.classList.add("text-success");
    } else if (saldoFinal < 0) {
        saldoAtualEl.classList.remove("text-success");
        saldoAtualEl.classList.add("text-danger");
    } else {
        saldoAtualEl.classList.remove("text-success");
        saldoAtualEl.classList.remove("text-danger");
        saldoAtualEl.classList.add("text-warning");
    }
}

carregarExtrato();
window.addEventListener("storage", carregarExtrato);