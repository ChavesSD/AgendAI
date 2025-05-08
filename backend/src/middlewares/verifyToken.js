/**
 * Middleware para verificação de token JWT
 */

const jwt = require('jsonwebtoken');
const config = require('../../config/config');

/**
 * Verifica se o token JWT é válido
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 * @param {Function} next - Função para passar para o próximo middleware
 */
const verifyToken = (req, res, next) => {
    // Obter o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Token de autenticação não fornecido'
        });
    }
    
    // Formato do cabeçalho: "Bearer [token]"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
        return res.status(401).json({
            success: false,
            message: 'Formato de token inválido'
        });
    }
    
    const [scheme, token] = parts;
    
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({
            success: false,
            message: 'Formato de token inválido'
        });
    }
    
    // Verificar o token
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            // Token inválido ou expirado
            return res.status(401).json({
                success: false,
                message: 'Token inválido ou expirado'
            });
        }
        
        // Token válido, armazenar informações do usuário na requisição
        req.user = decoded;
        return next();
    });
};

module.exports = verifyToken; 