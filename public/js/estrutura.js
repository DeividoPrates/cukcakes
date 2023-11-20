
//estrutura.js
document.addEventListener('DOMContentLoaded', async function () {
  const logoutButton = document.getElementById('logout');
  const loginLink = document.getElementById('login');
  const emailElement = document.getElementById('email');

  function hideElement(element) {
    element.style.display = 'none';
  }

  function showElement(element) {
    element.style.display = 'inline';
  }

  async function checkAuthentication() {
    try {
      const token = localStorage.getItem('jwtToken');

      if (!token) {
        showElement(loginLink);
        hideElement(logoutButton);
      } else {
        const response = await fetch('http://localhost:5500/userDetails', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (response.ok) {
          const user = await response.json();
          emailElement.textContent = `Usuário: ${user.email}`;
          hideElement(loginLink);
          showElement(logoutButton);
        } else {
          // Remova o token inválido do localStorage
          localStorage.removeItem('jwtToken');
          showElement(loginLink);
          hideElement(logoutButton);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      // Trate o erro ou exiba uma mensagem ao usuário, se necessário
    }
  }

  async function handleLogout() {
    try {
      const response = await fetch('http://localhost:5500/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Certifique-se de incluir esta linha
      });

      if (response.ok) {
        // Remova o token do localStorage ao fazer logout
        localStorage.removeItem('jwtToken');
        alert('Logout realizado com sucesso.');
        window.location.href = 'estrutura.html';
      } else {
        const data = await response.json();
        alert(`Erro no logout: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao fazer logout');
    }
  }

  checkAuthentication();

  logoutButton.addEventListener('click', async function (e) {
    e.preventDefault();
    await handleLogout();
  });
});