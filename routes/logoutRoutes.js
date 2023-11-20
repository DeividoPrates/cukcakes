const express = require('express');
const logoutRoutes = express.Router();

const tokenBlacklist = new Set();

logoutRoutes.post('/logout', (req, res) => {
  try {
    console.log('Cookies:', req.cookies);
    if (req.cookies && req.cookies.token) {
      const token = req.cookies.token;
      tokenBlacklist.add(token);

      // Remova o cookie com as opções correspondentes
      res.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true });

      res.status(200).json({ message: 'Logout realizado com sucesso' });
    } else {
      res.status(401).json({ error: 'Você não está logado' });
    }
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    res.status(500).json({ error: 'Erro ao fazer logout' });
  }
});

function checkTokenBlacklist(req, res, next) {
  const token = req.cookies?.token;

  if (token && tokenBlacklist.has(token)) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  next();
}

module.exports = { logoutRoutes, checkTokenBlacklist };