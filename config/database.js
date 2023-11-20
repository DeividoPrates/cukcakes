//database.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql', // Use o dialeto correspondente ao seu banco de dados (ex: 'mysql', 'postgres', 'sqlite', etc.)
  host: 'localhost', // Host do seu banco de dados
  username: 'root', // Nome de usuário do banco de dados
  password: 'DaviBia0808', // Senha do banco de dados
  database: 'cukcakes', // Nome do banco de dados
});


// Teste a conexão com o banco de dados
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Sincronize os modelos com o banco de dados
    await sequelize.sync(); // Isso criará as tabelas no banco de dados

    console.log('Tabelas sincronizadas com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
}

// Exporte a instância do Sequelize
module.exports = sequelize;
