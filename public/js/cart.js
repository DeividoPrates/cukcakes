document.addEventListener('DOMContentLoaded', function () {
    const cartSection = document.querySelector('.cart');
    const cartTotalPrice = document.getElementById('cart-total-price');

    // Recuperar produtos do carrinho no localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCart() {
        cartSection.innerHTML = '';
        let totalPrice = 0;

        cart.forEach((product, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <img src="/public/uploads/${product.image}" alt="${product.name}">
                <div class="cart-item-info">
                    <h2>${product.name}</h2>
                    <p>Preço: R$ ${parseFloat(product.price).toFixed(2)}</p>
                    <p>${product.description}</p>
                    <button class="remove-button" data-index="${index}">Excluir</button>
                </div>
            `;

            cartSection.appendChild(cartItem);
            totalPrice += parseFloat(product.price);
        });

        cartTotalPrice.textContent = `R$ ${totalPrice.toFixed(2)}`;

        // Adicionar evento de clique ao botão "Excluir"
        const removeButtons = document.querySelectorAll('.remove-button');
        removeButtons.forEach((button) => {
            button.addEventListener('click', function () {
                const index = button.dataset.index;
                removeFromCart(index);
                renderCart();
            });
        });
    }

    // Função para remover um item do carrinho com base no índice
    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Adicionar evento de clique ao botão "Finalizar Compra"
    const checkoutButton = document.getElementById('checkout-button');

    checkoutButton.addEventListener('click', function () {
        // Redirecionar o usuário para a página de checkout
        window.location.href = 'checkout.html';
    });

    renderCart();
});