
//register.js
document.addEventListener('DOMContentLoaded', function () {
  const registrationForm = document.getElementById('registration-form');

  registrationForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmpassword').value;

    if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5500/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.status === 201) {
        alert('Cadastro realizado com sucesso.');
        registrationForm.reset();
        window.location.href = 'login.html';
      } else {
        const data = await response.json();
        alert(`Erro no cadastro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar o usuário:', error);
      alert('Erro ao cadastrar o usuário');
    }
  });
});