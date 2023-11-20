
//adminRoutes.js
const express = require('express');
const adminRoutes = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');

// Configure o armazenamento e outras opções do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // Define o diretório de destino para salvar as imagens
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg'); // Define o nome do arquivo da imagem
  },
});

const upload = multer({ storage: storage });

// Rota para listar produtos
adminRoutes.get('/products', adminController.listProducts);

// Rota para adicionar um novo produto
adminRoutes.post('/add-product', upload.single('image'), adminController.addProduct);

// Rota para editar um produto
adminRoutes.get('/edit-product/:id', adminController.editProduct);

// Rota para editar um produto (com upload de imagem)
adminRoutes.put('/edit-product/:id', upload.single('image'), adminController.editProduct);

// Rota para excluir um produto
adminRoutes.delete('/delete-product/:id', adminController.deleteProduct);


module.exports = adminRoutes;