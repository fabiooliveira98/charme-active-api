const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Rotas para Clientes
router.post('/', authMiddleware, OrderController.create);
router.get('/my-orders', authMiddleware, OrderController.getHistory);

// Rotas Administrativas
router.get('/admin/all', authMiddleware, adminOnly, OrderController.listAll);
router.post('/admin/:id/finalize', authMiddleware, adminOnly, OrderController.finalize);
router.post('/admin/:id/cancel', authMiddleware, adminOnly, OrderController.cancel);

module.exports = router;
