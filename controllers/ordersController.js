const db = require('../models');
const jwt = require('jsonwebtoken');
const secretKey = 'sua_chave_secreta';

async function getOrders(req, res) {
  try {
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
        const orders = await db.Orders.findAll({ where: { user_id: userId } });

        res.json({ success: true, orders });
      } catch (error) {
        console.error('Erro ao buscar pedidos do usuário:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar pedidos do usuário' });
      }
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos do usuário:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar pedidos do usuário' });
  }
}

module.exports = { getOrders };