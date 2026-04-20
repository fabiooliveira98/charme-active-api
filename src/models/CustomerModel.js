const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const CustomerModel = {
    async create(data) {
        const { name, phone, email, password_hash } = data;
        const id = uuidv4();
        const cleanPhone = phone.replace(/\D/g, ''); // Remove tudo que não é número
        
        const query = `
            INSERT INTO customers (id, name, phone, email, password_hash)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.query(query, [id, name, cleanPhone, email || null, password_hash]);

        return this.getById(id);
    },

    async getById(id) {
        const [rows] = await db.query('SELECT id, name, phone, email, loyalty_points, created_at FROM customers WHERE id = ?', [id]);
        return rows[0];
    },

    async getByPhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        const [rows] = await db.query('SELECT * FROM customers WHERE phone = ?', [cleanPhone]);
        return rows[0];
    },

    async getByIdentifier(identifier) {
        // Se o identificador parecer um telefone (contém números), limpamos ele
        const cleanIdentifier = identifier.replace(/\D/g, '');
        
        // Se ao limpar sobrar algo, buscamos por telefone OU email original
        const [rows] = await db.query(
            'SELECT * FROM customers WHERE phone = ? OR email = ?', 
            [cleanIdentifier || identifier, identifier]
        );
        return rows[0];
    },

    async updatePoints(id, points) {
        await db.query('UPDATE customers SET loyalty_points = loyalty_points + ? WHERE id = ?', [points, id]);
        return true;
    }
};

module.exports = CustomerModel;
