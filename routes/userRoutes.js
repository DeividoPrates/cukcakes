
// userRoutes.js
const express = require('express');
const userRoutes = express.Router();
const UserController = require('../controllers/userController');
const ordersController = require('../controllers/ordersController');
const pedidosController = require('../controllers/pedidosController'); // Importe o controlador de pedidos

// Rota para cadastrar um novo usuário
userRoutes.post('/register', UserController.registerUser);


// Rota para salvar um pedido
userRoutes.post('/save-order', pedidosController.addOrder);

userRoutes.get('/pedidos', ordersController.getOrders );

module.exports = userRoutes;