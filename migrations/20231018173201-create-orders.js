const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Orders = sequelize.define('orders', {
    cartSummary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER, // Assumindo que o user_id é um número inteiro
      allowNull: false,
      references: {
        model: 'users', // Nome da tabela referenciada
        key: 'id', // Nome da coluna na tabela referenciada
      },
    },
  });

  return Orders;
};