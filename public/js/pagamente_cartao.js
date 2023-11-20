
//Pagamento_cartao.js
document.addEventListener("DOMContentLoaded", function () {
    const paymentForm = document.getElementById("payment-form");

    // Obter os dados do localStorage
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));

    // Verificar se os dados existem antes de usá-los
    if (checkoutData) {
        const { rua, bairro, cidade, estado, numero, paymentMethod, cartSummary } = checkoutData;

        paymentForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            // Obter os valores dos campos de entrada do cartão
            const cardNumber = document.getElementById("card-number").value;
            const cardName = document.getElementById("card-name").value;
            const cardExpiry = document.getElementById("card-expiry").value;
            const cardCvv = document.getElementById("card-cvv").value;


            // Simulação de pagamento bem-sucedido (substitua isso pela integração real)
            const pagamentoBemSucedido = simularPagamentoComCartao(cardNumber, cardName, cardExpiry, cardCvv);

            if (pagamentoBemSucedido) {
                alert("Pagamento bem-sucedido! Finalizando o pedido...");

                // Dados do pedido que serão enviados para a rota
                const orderData = {
                    cartSummary,
                    address: `${rua}, ${bairro}, ${cidade}, ${estado}, ${numero}`,
                    paymentMethod
                };

                try {
                    const token = localStorage.getItem('jwtToken'); // Obtém o token do localStorage

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
                        alert('Pedido finalizado com sucesso!');

                        // Limpar o carrinho no lado do cliente após a compra bem-sucedida
                        localStorage.removeItem('cart');

                        window.location.href = 'pedidos.html'; // Redireciona para a página de pedidos após o sucesso do pedido
                    } else {
                        alert('Erro ao finalizar o pedido. Tente novamente mais tarde.');
                    }
                } catch (error) {
                    console.error('Erro ao finalizar o pedido:', error);
                    alert('Erro ao finalizar o pedido. Tente novamente mais tarde.');
                }
            } else {
                alert("Falha no pagamento. Por favor, tente novamente.");
            }
        });
    } else {
        console.error('Dados do checkout não encontrados');
    }

    // função para buscar os dados de endereço do checkout
    function getAddressFromCheckout() {
        const rua = document.getElementById('rua');
        const bairro = document.getElementById('bairro');
        const cidade = document.getElementById('cidade');
        const estado = document.getElementById('estado');
        const numero = document.getElementById('numero');
    
        // Verificar se algum dos elementos não foi encontrado
        if (!rua || !bairro || !cidade || !estado || !numero) {
            console.error('Alguns elementos não foram encontrados');
            return null;
        }
    
        return `${rua.value}, ${bairro.value}, ${cidade.value}, ${estado.value}, ${numero.value}`;
    }
    //função para buscar o método de pagamento do checkout
    function getPaymentMethodFromCheckout() {
        return document.getElementById('payment-method').value;
    }

    function isValidCardNumber(cardNumber) {
        return /^\d{16}$/.test(cardNumber);    }

    function isValidCardExpiry(cardExpiry) {
        // lógica de validação da data de expiração (formato MM/AA)
        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            return false;
        }

        const [month, year] = cardExpiry.split("/").map(Number);

        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear() % 100;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return false;
        }

        return true;
    }

    function isValidCardCvv(cardCvv) {
        return /^\d{3,4}$/.test(cardCvv);
    }

    function simularPagamentoComCartao(cardNumber, cardName, cardExpiry, cardCvv) {
      
        return true;
    }
});