const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productsController = require('../controllers/products.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Rotas da Vitrine / Admin
router.get('/', productsController.getAll);
router.post('/', authMiddleware, adminOnly, productsController.create);
router.get('/:id', productsController.getById);
router.put('/:id', authMiddleware, adminOnly, productsController.update);

// Rotas de Variações e Imagens
router.post('/:id/variations', authMiddleware, adminOnly, productsController.addVariation);
router.post('/:id/images', authMiddleware, adminOnly, upload.array('images', 5), productsController.uploadImage);

module.exports = router;
