const OrderModel = require('../models/OrderModel');
const ProductModel = require('../models/ProductModel');

const OrderService = {
    async createOrder(customerId, items) {
        // items: [{ product_id, variation_id, quantity, price_at_purchase }]
        
        const total_amount = items.reduce((acc, item) => acc + (item.price_at_purchase * item.quantity), 0);
        
        const orderId = await OrderModel.create({
            customer_id: customerId,
            total_amount
        });

        await OrderModel.addItems(orderId, items);

        return await OrderModel.getById(orderId);
    },

    async finalizeOrder(orderId, adminId) {
        const order = await OrderModel.getById(orderId);
        
        if (!order) {
            return { error: 'Pedido não encontrado.' };
        }

        if (order.status !== 'pendente') {
            return { error: 'Apenas pedidos pendentes podem ser finalizados.' };
        }

        // Tenta debitar o estoque de cada item
        const stockUpdates = [];
        for (const item of order.items) {
            const success = await ProductModel.decreaseStock(item.variation_id, item.quantity);
            if (!success) {
                return { error: `Estoque insuficiente para o item: ${item.product_name} (${item.size}/${item.color})` };
            }
        }

        await OrderModel.updateStatus(orderId, 'concluido', adminId);
        
        return { success: true, message: 'Venda finalizada com sucesso e estoque atualizado.' };
    },

    async cancelOrder(orderId) {
        const order = await OrderModel.getById(orderId);
        if (!order) return { error: 'Pedido não encontrado.' };
        
        await OrderModel.updateStatus(orderId, 'cancelado');
        return { success: true };
    },

    async getCustomerOrders(customerId) {
        return await OrderModel.getByCustomer(customerId);
    },

    async getAllOrders() {
        return await OrderModel.getAll();
    }
};

module.exports = OrderService;
