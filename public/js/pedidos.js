
//pedidos.js
document.addEventListener('DOMContentLoaded', function () {
    function fetchData() {
        const token = localStorage.getItem('jwtToken'); // Obtém o token do localStorage

        if (!token) {
            // Se não houver token, redirecionar para a página de login
            alert('Por favor, faça o login para continuar.');
            window.location.href = '/views/login.html';
            return;
        }

        fetch('http://localhost:5500/ordem/pedidos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Adiciona o token no cabeçalho de autorização
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar os pedidos: ' + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                const orderList = document.getElementById('order-list');
                orderList.innerHTML = '';

                const orders = data.orders;

                if (Array.isArray(orders)) {
                    orders.forEach((order) => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <strong>ID do Pedido:</strong> ${order.id}<br>
                            <strong>Resumo do Carrinho:</strong> ${order.cartSummary}<br>
                            <strong>Endereço:</strong> ${order.address}<br>
                            <strong>Forma de Pagamento:</strong> ${order.paymentMethod}<br>
                        `;
                        orderList.appendChild(listItem);
                    });
                } else {
                    console.error('Erro: Os pedidos não estão no formato esperado.');
                }
            })
            .catch((error) => {
                console.error('Erro ao buscar os pedidos:', error);
            });
    }

    fetchData();
});
function getTokenFromLocalStorage() {
    
}