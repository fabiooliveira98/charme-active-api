const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CustomerModel = require('../models/CustomerModel');

const authController = {
    async login(req, res) {
        try {
            const { username, password, role: intendedRole } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({ error: 'Usuário/Telefone e Senha são obrigatórios.' });
            }

            let user = null;
            let role = 'customer';

            // 1. Se a intenção for admin, busca APENAS na tabela de Administradores
            if (intendedRole === 'admin') {
                const [adminRows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
                if (adminRows.length > 0) {
                    user = adminRows[0];
                    role = 'admin';
                }
            } else {
                // 2. Se a intenção for cliente, busca APENAS na tabela de Clientes
                const customer = await CustomerModel.getByIdentifier(username);
                if (customer) {
                    user = customer;
                    role = 'customer';
                }
            }

            if (!user) {
                return res.status(401).json({ error: 'Credenciais inválidas para o tipo de acesso selecionado.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            // Gerar Token JWT com Role
            const token = jwt.sign(
                { 
                    id: user.id, 
                    name: user.username || user.name, 
                    role: role 
                },
                process.env.JWT_SECRET,
                { expiresIn: role === 'admin' ? '8h' : '7d' }
            );

            res.json({
                message: 'Login realizado com sucesso.',
                token: token,
                user: {
                    id: user.id,
                    name: user.username || user.name,
                    role: role
                }
            });

        } catch (error) {
            console.error('Erro no login unificado:', error);
            res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    }
};

module.exports = authController;
