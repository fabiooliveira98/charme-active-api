const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const OrderModel = {
    async create(data) {
        const { customer_id, total_amount } = data;
        const id = uuidv4();
        
        const query = `
            INSERT INTO orders (id, customer_id, total_amount, status)
            VALUES (?, ?, ?, 'pendente')
        `;
        await db.query(query, [id, customer_id, total_amount]);

        return id;
    },

    async addItems(orderId, items) {
        // items: [{ product_id, variation_id, quantity, price_at_purchase }]
        const queries = items.map(item => {
            const itemId = uuidv4();
            return db.query(`
                INSERT INTO order_items (id, order_id, product_id, variation_id, quantity, price_at_purchase)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [itemId, orderId, item.product_id, item.variation_id, item.quantity, item.price_at_purchase]);
        });
        
        await Promise.all(queries);
        return true;
    },

    async getById(id) {
        const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
        if (orders.length === 0) return null;

        const order = orders[0];
        const [items] = await db.query(`
            SELECT oi.*, p.name as product_name, pv.size, pv.color 
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN product_variations pv ON oi.variation_id = pv.id
            WHERE oi.order_id = ?
        `, [id]);

        order.items = items;
        return order;
    },

    async getByCustomer(customerId) {
        const [orders] = await db.query('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC', [customerId]);
        
        // Para cada pedido, busca seus itens detalhados
        for (let order of orders) {
            const [items] = await db.query(`
                SELECT oi.*, p.name as product_name, pv.size, pv.color 
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                JOIN product_variations pv ON oi.variation_id = pv.id
                WHERE oi.order_id = ?
            `, [order.id]);
            order.items = items;
        }

        return orders;
    },

    async getAll() {
        const [orders] = await db.query(`
            SELECT o.*, c.name as customer_name, u.username as admin_name
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            LEFT JOIN users u ON o.finalized_by = u.id
            ORDER BY o.created_at DESC
        `);

        // Para cada pedido, busca seus itens detalhados
        for (let order of orders) {
            const [items] = await db.query(`
                SELECT oi.*, p.name as product_name, pv.size, pv.color 
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                JOIN product_variations pv ON oi.variation_id = pv.id
                WHERE oi.order_id = ?
            `, [order.id]);
            order.items = items;
        }

        return orders;
    },

    async updateStatus(id, status, adminId = null) {
        if (adminId) {
            await db.query('UPDATE orders SET status = ?, finalized_by = ? WHERE id = ?', [status, adminId, id]);
        } else {
            await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        }
        return true;
    }
};

module.exports = OrderModel;
