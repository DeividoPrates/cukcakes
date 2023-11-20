
//checkout.js
document.addEventListener('DOMContentLoaded', function () {
    const checkoutForm = document.getElementById('checkout-form');
    const addressResult = document.getElementById('address-result');
    const cartItemList = document.getElementById('cart-item-list');
    const totalAmount = document.getElementById('total-amount');

    // Recupere os dados do carrinho do localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function displayCartSummary() {
        cartItemList.innerHTML = '';
        let totalPrice = 0;

        cart.forEach((product, index) => {
            const cartItem = document.createElement('li');
            cartItem.textContent = `${product.name}: R$ ${parseFloat(product.price).toFixed(2)}`;
            cartItemList.appendChild(cartItem);
            totalPrice += parseFloat(product.price);
        });

        totalAmount.textContent = totalPrice.toFixed(2);
    }

    // Chame a função para exibir o resumo do carrinho quando a página de checkout for carregada
    displayCartSummary();

    checkoutForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Evitar envio padrão do formulário

        // Obter os valores dos campos de entrada
        const cep = document.getElementById('cep').value;
        const rua = document.getElementById('rua').value;
        const bairro = document.getElementById('bairro').value;
        const cidade = document.getElementById('cidade').value;
        const estado = document.getElementById('estado').value;
        const numero = document.getElementById('numero').value;
        const paymentMethod = document.getElementById('payment-method').value;

        if (paymentMethod === 'credit-card') {
            // Salvar os dados no localStorage
            localStorage.setItem('checkoutData', JSON.stringify({
                rua,
                bairro,
                cidade,
                estado,
                numero,
                paymentMethod,
                cartSummary: cart
            }));

            // Redirecionar para a página de pagamento com cartão
            window.location.href = 'pagamento_cartao.html';
        } else {
            // Montar os dados do pedido para outros métodos de pagamento
            const orderData = {
                cartSummary: cart,
                address: `${rua}, ${bairro}, ${cidade}, ${estado}, ${numero}`,
                paymentMethod,
            };
            try {
                const token = localStorage.getItem('jwtToken'); // Obtém o token do localStorage
                if (!token) {
                    // Se não houver token, redirecionar para a página de login
                    alert('Por favor, faça o login para continuar.');
                    window.location.href = '/views/login.html';
                    return;
                }

                const response = await fetch('http://localhost:5500/api/save-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Adiciona o token no cabeçalho de autorização
                    },
                    body: JSON.stringify(orderData),
                });

                const data = await response.json();

                if (data.success) {
                    // Limpar o carrinho no lado do cliente
                    localStorage.removeItem('cart');
                    cart = [];

                    // Exibir uma mensagem de sucesso
                    addressResult.textContent = `Endereço: ${rua}, ${bairro}, ${cidade}, ${estado}, ${numero}`;
                    alert('Compra finalizada com sucesso!');
                    window.location.href = 'pedidos.html';
                } else {
                    // Exibir uma mensagem de erro em caso de falha
                    alert('Erro ao finalizar o pedido. Tente novamente mais tarde.');
                }
            } catch (error) {
                console.error('Erro ao finalizar o pedido:', error);
                alert('Erro ao finalizar o pedido. Tente novamente mais tarde.');
            }
        }
    });

    const searchAddressButton = document.getElementById('search-address');

    searchAddressButton.addEventListener('click', function () {
        // Obter o valor do campo de CEP
        const cepValue = document.getElementById('cep').value;

        // Verificar se o CEP possui o formato correto (8 dígitos)
        if (/^\d{8}$/.test(cepValue)) {
            // Fazer uma solicitação para a API do ViaCEP
            fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
                .then((response) => response.json())
                .then((data) => {
                    // Verificar se a resposta da API contém um erro
                    if (!data.erro) {
                        // Preencher os campos de rua, bairro, cidade e estado com os dados da API
                        document.getElementById('rua').value = data.logradouro;
                        document.getElementById('bairro').value = data.bairro;
                        document.getElementById('cidade').value = data.localidade;
                        document.getElementById('estado').value = data.uf;
                        document.getElementById('numero').focus(); // Mover o foco para o campo de número
                        addressResult.textContent = ''; // Limpar mensagem de erro anterior
                    } else {
                        // Exibir uma mensagem de erro se o CEP não for encontrado
                        addressResult.textContent = 'CEP não encontrado. Verifique o CEP digitado.';
                    }
                })
                .catch((error) => {
                    console.error('Erro ao buscar endereço:', error);
                    addressResult.textContent = 'Erro ao buscar endereço. Tente novamente mais tarde.';
                });
        } else {
            // Exibir uma mensagem de erro se o CEP estiver em formato inválido
            addressResult.textContent = 'CEP inválido. Digite um CEP válido com 8 dígitos.';
        }
    });
});