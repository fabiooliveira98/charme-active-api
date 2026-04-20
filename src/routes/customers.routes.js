const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customer.controller');
const { authMiddleware } = require('../middleware/auth');

// Rotas públicas
router.post('/register', CustomerController.register);

// Rotas protegidas (apenas para o cliente logado)
router.get('/profile', authMiddleware, CustomerController.getProfile);

module.exports = router;
