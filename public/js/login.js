

//login.js
document.addEventListener('DOMContentLoaded', async function () {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:5500/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert('Login realizado com sucesso.');
        loginForm.reset();
        const data = await response.json();
        const newToken = data.token;

        // Substitua o token antigo
        localStorage.setItem('jwtToken', newToken);

        // Redirecione para a página desejada
        window.location.href = '/views/estrutura.html';
      } else {
        const data = await response.json();
        alert(`Erro no login: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login');
    }
  });
});