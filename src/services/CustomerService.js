const CustomerModel = require('../models/CustomerModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const CustomerService = {
    async register(data) {
        const { name, phone, email, password } = data;

        // Verifica se telefone já existe
        const existing = await CustomerModel.getByPhone(phone);
        if (existing) {
            return { error: 'Este telefone já está cadastrado.' };
        }

        const password_hash = await bcrypt.hash(password, 10);
        
        const customer = await CustomerModel.create({
            name,
            phone,
            email,
            password_hash
        });

        return { customer };
    },

    async getProfile(id) {
        return await CustomerModel.getById(id);
    }
};

module.exports = CustomerService;
