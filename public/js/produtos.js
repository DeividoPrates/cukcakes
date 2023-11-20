document.addEventListener('DOMContentLoaded', function () {
  const productsSection = document.querySelector('.products');

  // Inicializa o carrinho a partir do localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  function loadProducts() {
    fetch('http://localhost:5500/listar', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'), // Adicionamos o token de autenticação
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao obter a lista de produtos');
        }
        return response.json();
      })
      .then((products) => {
        productsSection.innerHTML = '';

        products.forEach((product) => {
          const productItem = document.createElement('div');
          productItem.classList.add('product-item');

          productItem.innerHTML = `
            <img src="/public/uploads/${product.image}" width="350" alt="${product.name}">
            <div class="product-info">
              <h2>${product.name}</h2>
              <p>Preço: R$ ${parseFloat(product.price).toFixed(2)}</p>
              <p>${product.description}</p>
            </div>
            <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
          `;

          const addToCartButton = productItem.querySelector('.add-to-cart');
          addToCartButton.addEventListener('click', () => addToCart(product));

          productsSection.appendChild(productItem);
        });
      })
      .catch((error) => {
        console.error('Erro ao carregar a lista de produtos:', error);
        alert('Erro ao carregar a lista de produtos');
      });
  }

  function addToCart(product) {
    // Adicionar o produto ao carrinho
    cart.push(product);

    // Atualizar o carrinho no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Redirecionar o usuário para a página de carrinho (cart.html)
    window.location.href = '/protected/cart.html';
  }

  loadProducts();
});