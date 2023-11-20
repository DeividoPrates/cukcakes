
//index.js
const Sequelize = require('sequelize');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    
  }
);

// Teste a conexão com o banco de dados
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Carregue seus modelos aqui (sem chamar como funções)
db.User = require('./user')(sequelize, Sequelize);
db.Products = require('./products')(sequelize, Sequelize);
db.Orders = require('./orders')(sequelize, Sequelize);




module.exports = db;
