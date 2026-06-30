document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastroForm');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const confirmarSenha = document.getElementById('confirmarSenha').value.trim();
    const termos = document.getElementById('termos').checked;

    if (!nome || !email || !senha || !confirmarSenha) {
      alert('Preencha todos os campos para continuar.');
      return;
    }

    if (!email.includes('@')) {
      alert('Informe um e-mail válido.');
      return;
    }

    if (senha.length < 8) {
      alert('A senha precisa ter pelo menos 8 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    alert('Cadastro realizado com sucesso!');
    form.reset();
    window.location.href = 'Meu-Controle-Financeiro/Front-End/login.html';
  });
});
