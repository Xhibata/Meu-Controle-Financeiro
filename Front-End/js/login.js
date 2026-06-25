document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!email || !senha) {
      alert('Preencha e-mail e senha para continuar.');
      return;
    }

    if (email.includes('@') && senha.length >= 4) {
      window.location.href = 'index.html';
    } else {
      alert('Por favor, informe um e-mail válido e uma senha com pelo menos 4 caracteres.');
    }
  });
});
