const express = require('express');
const router = express.Router();

let cart = [];

// Adicionar produto ao carrinho
router.post('/add-to-cart', (req, res) => {
  const product = req.body;
  cart.push(product);

  res.json({ message: 'Produto adicionado ao carrinho com sucesso' });
});

// Exibir carrinho
router.get('/', (req, res) => {
  const totalPrice = cart.reduce((total, product) => total + parseFloat(product.price), 0);
  res.render('cart', { cart, totalPrice });
});

module.exports = router;