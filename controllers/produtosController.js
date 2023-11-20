

const Products = require('../models').Products;
const fs = require('fs').promises;
const path = require('path');

async function listarProdutos(req, res) {
  try {
    const products = await Products.findAll();
    res.json(products);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
}

module.exports = {listarProdutos};