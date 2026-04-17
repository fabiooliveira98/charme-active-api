const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    async login(req, res) {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({ error: 'Username e Password são obrigatórios.' });
            }

            const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
            const user = rows[0];

            if (!user) {
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            // Gerar Token JWT
            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            res.json({
                message: 'Login realizado com sucesso.',
                token: token
            });

        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    }
};

module.exports = authController;
