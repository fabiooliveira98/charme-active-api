const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido. Acesso negado.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Erro de token.' });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: 'Token mal formatado.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido ou expirado.' });
        }

        // Armazena os dados decodificados (id, name, role) no req.user
        req.user = decoded; 
        return next();
    });
}

// Middleware específico para admin (exige que role seja 'admin')
function adminOnly(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
}

module.exports = { authMiddleware, adminOnly };
