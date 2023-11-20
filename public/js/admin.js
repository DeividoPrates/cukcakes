
//admin.js
document.addEventListener('DOMContentLoaded', function () {
  const productForm = document.getElementById('product-form');
  const productList = document.getElementById('product-list');
  let currentlyEditingProductId = null;

  // Função para carregar a lista de produtos
  function loadProducts() {
    fetch('http://localhost:5500/admin/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao obter a lista de produtos');
        }
        return response.json();
      })
      .then((products) => {
        productList.innerHTML = '';

        products.forEach((product) => {
          const productItem = document.createElement('li');
          productItem.innerHTML = `
            ${product.name} - ${product.price} - ${product.description} - <img src="/public/uploads/${product.image}" width="100">
            <button class="edit-product" data-id="${product.id}">Editar</button>
            <button class="delete-product" data-id="${product.id}">Excluir</button>
          `;

          const editButton = productItem.querySelector('.edit-product');
          editButton.addEventListener('click', () => editProduct(product.id));

          const deleteButton = productItem.querySelector('.delete-product');
          deleteButton.addEventListener('click', () => deleteProduct(product.id));

          productList.appendChild(productItem);
        });
      })
      .catch((error) => {
        console.error('Erro ao carregar a lista de produtos:', error);
        alert('Erro ao carregar a lista de produtos');
      });
  }

  function addProduct(name, price, description, image) {
    if (!name || !price) {
      alert('Nome e preço são campos obrigatórios.');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('image', image);
    
    fetch('http://localhost:5500/admin/add-product', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          productForm.reset();
          alert(data.message);
        } else {
          alert('Produto adicionado com sucesso');
        }
        loadProducts();
      })
      .catch((error) => {
        console.error('Erro ao adicionar o produto:', error);
        alert('Erro ao adicionar o produto. Verifique o console para mais detalhes.');
      });
  }
  // Função para editar um produto
  function editProduct(productId) {
    if (currentlyEditingProductId !== null) {
      alert('Apenas um produto pode ser editado por vez.');
      return;
    }
    currentlyEditingProductId = productId;

    fetch(`http://localhost:5500/admin/edit-product/${productId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Produto não encontrado');
        }
        return response.json();
      })
      .then((product) => {
        const editForm = document.createElement('form');
        editForm.innerHTML = `
          <input type="text" id="editName" value="${product.name}" placeholder="Nome do Produto">
          <input type="text" id="editPrice" value="${product.price}" placeholder="Preço">
          <input type="text" id="editDescription" value="${product.description}" placeholder="Descrição">
          <input type="file" id="editImage" accept="image/*" placeholder="Selecione uma imagem">
          <button id="saveEditButton">Salvar</button>
          <button id="cancelEditButton">Cancelar</button>
        `;

        editForm.addEventListener('submit', function (event) {
          event.preventDefault();
          saveEditedProduct(productId);
        });

        const cancelEditButton = editForm.querySelector('#cancelEditButton');
        cancelEditButton.addEventListener('click', () => cancelEdit());

        productList.appendChild(editForm);
      })
      .catch((error) => {
        console.error('Erro ao carregar os dados do produto para edição:', error);
        alert('Erro ao carregar os dados do produto para edição');
      });
  }

  // Função para salvar as edições do produto
  function saveEditedProduct(productId) {
    const editedName = document.getElementById('editName').value;
    const editedPrice = document.getElementById('editPrice').value;
    const editedDescription = document.getElementById('editDescription').value;
    const editedImageInput = document.getElementById('editImage');
    const selectedFile = editedImageInput.files[0];

    const formData = new FormData();
    formData.append('name', editedName);
    formData.append('price', editedPrice);
    formData.append('description', editedDescription);

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    fetch(`http://localhost:5500/admin/edit-product/${productId}`, {
      method: 'PUT',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao editar o produto');
        }
        return response.json();
      })
      .then(() => {
        currentlyEditingProductId = null;
        loadProducts();
      })
      .catch((error) => {
        console.error('Erro ao editar o produto:', error);
        alert('Erro ao editar o produto');
      });

    // Remova o formulário de edição após a submissão
    const editForm = productList.querySelector('form');
    editForm.remove();
  }

  // Função para cancelar a edição do produto
  function cancelEdit() {
    currentlyEditingProductId = null;
    const editForm = productList.querySelector('form');
    editForm.remove();
  }

  // Função para excluir um produto
  function deleteProduct(productId) {
    const confirmDelete = confirm(`Tem certeza de que deseja excluir o produto com ID ${productId}?`);
    if (confirmDelete) {
      fetch(`http://localhost:5500/admin/delete-product/${productId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro ao excluir o produto');
          }
          return response.json();
        })
        .then(() => {
          loadProducts();
        })
        .catch((error) => {
          console.error('Erro ao excluir o produto:', error);
          alert('Erro ao excluir o produto');
        });
    }
  }

  productForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const imageInput = document.getElementById('image');
    const selectedFile = imageInput.files[0];

    addProduct(name, price, description, selectedFile);
  });

  loadProducts();
});