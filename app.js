
//app.js

const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { logoutRoutes, checkTokenBlacklist } = require('./routes/logoutRoutes');
const sequelize = require('./config/database');
const { User } = require('./models');
const produtosController = require('./controllers/produtosController');

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'public'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'estrutura.html'));
});

app.use(checkTokenBlacklist);
app.use('/user', userRoutes);
app.post('/logout', logoutRoutes);
app.use('/admin', adminRoutes);

app.use('/api', userRoutes);
app.use('/ordem', userRoutes);


// Rota para a página de produtos
app.get('/listar', produtosController.listarProdutos);

const secretKey = 'sua_chave_secreta';

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });
    }

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

    // Adicione o token como cookie
    res.cookie('token', token, { httpOnly: true, sameSite: 'None', secure: true });

    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

app.get('/userDetails', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('Token não encontrado no cabeçalho de autorização.');
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const token = authHeader.replace('Bearer ', '');

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      console.log('Erro na verificação do token:', err);
      return res.status(401).json({ error: 'Token inválido' });
    }

    const userId = decoded.userId;

    try {
      // Buscar o email do usuário com base no userId
      const user = await User.findByPk(userId, { attributes: ['email'] });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Incluir o email na resposta
      res.json({ email: user.email });
    } catch (error) {
      console.error('Erro ao buscar o email do usuário:', error);
      res.status(500).json({ error: 'Erro ao buscar o email do usuário' });
    }
  });
});

sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado.');
  const PORT = process.env.PORT || 5500;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});