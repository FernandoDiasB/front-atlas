document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  const mensagem = document.getElementById('mensagem');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;
      console.log("click login");

      fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('E-mail ou senha inválidos');
          }
          return res.text(); // token JWT
        })
        .then(token => {
          localStorage.setItem('jwtToken', token);
          window.location.href = 'home.html';
        })
        .catch(err => {
          mensagem.style.color = 'red';
          mensagem.textContent = err.message;
        });
    });
  }
});
