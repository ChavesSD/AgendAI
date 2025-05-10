/**
 * Middleware de autenticação
 */

const jwt = require('jsonwebtoken');
const config = require('../../config/config');

// Middleware para verificar autenticação
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Acesso não autorizado' });
    }
    
    jwt.verify(token, config.auth.jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido ou expirado' });
        }
        
        req.user = user;
        next();
    });
};

// Middleware para verificar tipo de usuário
exports.checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Acesso não permitido para este tipo de usuário' });
        }
        
        next();
    };
}; 