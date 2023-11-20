
//adminController.js
const Products = require('../models').Products;
const fs = require('fs').promises;
const path = require('path');

async function listProducts(req, res) {
  try {
    const products = await Products.findAll();
    res.json(products);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
}

async function addProduct(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Imagem do produto é obrigatória.' });
    }

    const { name, price, description } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Nome e preço são campos obrigatórios.' });
    }

    const newProduct = await Products.create({
      name,
      price,
      description,
      image: req.file.filename,
    });

    res.json(newProduct);
  } catch (error) {
    console.error('Erro ao adicionar novo produto:', error);
    res.status(500).json({ error: 'Erro ao adicionar novo produto' });
  }
}

async function editProduct(req, res) {
  const productId = parseInt(req.params.id);
  const updatedProductData = req.body;

  try {
    const product = await Products.findByPk(productId);

    if (!product) {
      res.status(404).json({ error: 'Produto não encontrado' });
    } else {
      if (req.file) {
        if (product.image) {
          const imagePath = path.join(__dirname, '..', 'public/uploads', product.image);

          try {
            await fs.unlink(imagePath);
          } catch (error) {
            if (error.code !== 'ENOENT') {
              console.error('Erro ao excluir imagem:', error);
            }
          }
        }

        updatedProductData.image = req.file.filename;
      } else {
        updatedProductData.image = product.image;
      }

      await product.update(updatedProductData);
      res.json({ message: 'Produto atualizado com sucesso' });
    }
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
}

async function deleteProduct(req, res) {
  const productId = parseInt(req.params.id);

  try {
    const product = await Products.findByPk(productId);

    if (!product) {
      res.status(404).json({ error: 'Produto não encontrado' });
    } else {
      if (product.image) {
        try {
          await fs.unlink(path.join(__dirname, '..', 'public/uploads', product.image));
        } catch (error) {
          console.error('Erro ao excluir imagem:', error);
        }
      }

      await product.destroy();
      res.json({ message: 'Produto excluído com sucesso' });
    }
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ error: 'Erro ao excluir produto' });
  }
}

module.exports = { listProducts, addProduct, editProduct, deleteProduct };