const CustomerService = require('../services/CustomerService');

const CustomerController = {
    async register(req, res) {
        try {
            const { name, phone, email, password } = req.body;
            if (!name || !phone || !password) {
                return res.status(400).json({ error: 'Nome, Telefone e Senha são obrigatórios.' });
            }

            const result = await CustomerService.register({ name, phone, email, password });
            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            res.status(201).json(result.customer);
        } catch (error) {
            console.error('Erro no cadastro de cliente:', error);
            res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    },

    async getProfile(req, res) {
        try {
            const customer = await CustomerService.getProfile(req.user.id);
            res.json(customer);
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    }
};

module.exports = CustomerController;
