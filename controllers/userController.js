
// userController.js
const bcrypt = require('bcrypt');
const db = require('../models');

async function registerUser(req, res) {
  try {
    const { password, name, email } = req.body;

    if (!password || !name || !email) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const existingUser = await db.User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await db.User.create({ password: hashedPassword, name, email });

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar o usuário:', error);
    res.status(500).json({ error: 'Erro ao cadastrar o usuário' });
  }
}

module.exports = { registerUser };