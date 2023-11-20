

// pedidosController.js
const db = require('../models');
const jwt = require('jsonwebtoken');
const secretKey = 'sua_chave_secreta';

async function addOrder(req, res) {
  try {
    const { cartSummary, address, paymentMethod } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const token = authHeader.replace('Bearer ', '');

    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      const { userId } = decoded;

      try {
        const newOrder = await db.Orders.create({
          user_id: userId, // Alteração para usar user_id como referência
          cartSummary: JSON.stringify(cartSummary),
          address,
          paymentMethod,
        });

        res.json({ success: true, pedido: newOrder });
      } catch (error) {
        console.error('Erro ao salvar o pedido:', error);
        res.status(500).json({ success: false, error: 'Erro ao salvar o pedido' });
      }
    });
  } catch (error) {
    console.error('Erro ao salvar o pedido:', error);
    res.status(500).json({ success: false, error: 'Erro ao salvar o pedido' });
  }
}

module.exports = { addOrder };