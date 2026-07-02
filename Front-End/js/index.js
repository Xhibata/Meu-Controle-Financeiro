document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const base = 'http://localhost:8000';

  fetch(`${base}/dashboard`, { headers })
    .then((r) => r.json())
    .then((data) => {
      if (data.detail) {
        throw new Error(data.detail);
      }

      document.getElementById('totalReceitas').innerText =
        formatCurrency(data.total_receitas);

      document.getElementById('totalDespesas').innerText =
        formatCurrency(data.total_despesas);

      document.getElementById('qtdReceitas').innerText =
        data.quantidade_receitas;

      document.getElementById('qtdDespesas').innerText =
        data.quantidade_despesas;

      const email = localStorage.getItem('usuario_email');

      let saldoLocal = localStorage.getItem(`saldo_${email}`);

      if (saldoLocal === null) {
        saldoLocal = data.saldo;
        localStorage.setItem(`saldo_${email}`, saldoLocal);
      }

      document.getElementById('saldo').innerText =
        formatCurrency(parseFloat(saldoLocal));
    })
    .catch((err) => {
      console.error('Erro ao carregar dashboard:', err);
    });

  fetch(`${base}/dashboard/extrato`, { headers })
    .then((r) => r.json())
    .then((lista) => {
      const ul = document.getElementById('recentes');

      ul.innerHTML = '';

      lista.forEach((item) => {
        const li = document.createElement('li');

        li.className =
          'list-group-item d-flex justify-content-between align-items-center';

        li.innerHTML = `
          <div>
            <div class="font-weight-bold">
              ${escapeHtml(item.tipo)} - ${escapeHtml(item.descricao)}
            </div>

            <small class="text-muted">
              ${formatDate(item.data)}
            </small>
          </div>

          <div class="badge badge-pill badge-secondary">
            ${formatCurrency(item.valor)}
          </div>
        `;

        ul.appendChild(li);
      });
    })
    .catch((err) => {
      console.error('Erro ao carregar extrato:', err);
    });
});

function formatCurrency(value) {
  const num = Number(value) || 0;

  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function formatDate(d) {
  try {
    const dt = new Date(d);

    return dt.toLocaleDateString('pt-BR');
  } catch {
    return d;
  }
}

function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_type');
  localStorage.removeItem('usuario_email');

  window.location.href = 'login.html';
}

function escapeHtml(str) {
  if (!str) return '';

  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function abrirModalSaldo() {
  $('#modalSaldo').modal('show');
}

function adicionarSaldo() {
    const valor = parseFloat(
        document.getElementById('valorSaldo').value
    );

    if (!valor || valor <= 0) {
        alert('Digite um valor válido');
        return;
    }

    const email = localStorage.getItem('usuario_email');

    const chave = `saldo_${email}`;

    let saldo = parseFloat(localStorage.getItem(chave));

    if (isNaN(saldo)) {
        saldo = 0;
    }

    saldo += valor;

    localStorage.setItem(chave, saldo.toString());

    document.getElementById('saldo').innerText =
        formatCurrency(saldo);

    document.getElementById('valorSaldo').value = '';

    $('#modalSaldo').modal('hide');

    console.log('Saldo salvo:', localStorage.getItem(chave));
}