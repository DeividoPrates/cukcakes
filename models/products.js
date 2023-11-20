// products.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Products = sequelize.define('products', {
  
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    
  },

  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

return Products;
};
