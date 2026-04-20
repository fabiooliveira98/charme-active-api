const OrderService = require('../services/OrderService');

const OrderController = {
    async create(req, res) {
        try {
            const { items } = req.body;
            if (!items || items.length === 0) {
                return res.status(400).json({ error: 'O pedido deve conter pelo menos um item.' });
            }

            // O ID do cliente vem do token (req.user.id)
            const order = await OrderService.createOrder(req.user.id, items);
            res.status(201).json(order);
        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    },

    async getHistory(req, res) {
        try {
            const orders = await OrderService.getCustomerOrders(req.user.id);
            res.json(orders);
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
            res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    },

    // Ações administrativas
    async listAll(req, res) {
        try {
            const orders = await OrderService.getAllOrders();
            res.json(orders);
        } catch (error) {
            console.error('Erro ao listar pedidos:', error);
            res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    },

    async finalize(req, res) {
        try {
            const { id } = req.params;
            const result = await OrderService.finalizeOrder(id, req.user.id);
            
            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            res.json(result);
        } catch (error) {
            console.error('Erro ao finalizar pedido:', error);
            res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    },

    async cancel(req, res) {
        try {
            const { id } = req.params;
            const result = await OrderService.cancelOrder(id);
            if (result.error) {
                return res.status(400).json({ error: result.error });
            }
            res.json(result);
        } catch (error) {
            console.error('Erro ao cancelar pedido:', error);
            res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    }
};

module.exports = OrderController;
