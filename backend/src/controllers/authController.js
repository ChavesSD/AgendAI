/**
 * Controlador de autenticação
 */
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const AuthController = {
    /**
     * Login de usuário
     * @param {Object} req - Requisição Express
     * @param {Object} res - Resposta Express
     */
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            
            // Validação básica
            if (!email || !password) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email e senha são obrigatórios' 
                });
            }
            
            // Autenticação mock (será substituída por consulta ao banco)
            let user, token;
            
            if (email === 'admin@agendai.com' && password === 'admin') {
                // Admin
                user = {
                    id: 1,
                    name: 'Administrador',
                    email: 'admin@agendai.com',
                    role: 'admin'
                };
                
                token = jwt.sign(
                    { id: user.id, email: user.email, role: user.role },
                    config.jwtSecret,
                    { expiresIn: '24h' }
                );
                
                return res.json({
                    success: true,
                    message: 'Autenticação realizada com sucesso',
                    token,
                    user,
                    userType: 'admin'
                });
                
            } else if (email === 'empresa@agendai.com' && password === 'empresa') {
                // Empresa
                user = {
                    id: 2,
                    name: 'Empresa Demo',
                    email: 'empresa@agendai.com',
                    role: 'company',
                    companyId: 1,
                    companyName: 'Empresa Demonstração'
                };
                
                token = jwt.sign(
                    { id: user.id, email: user.email, role: user.role, companyId: user.companyId },
                    config.jwtSecret,
                    { expiresIn: '24h' }
                );
                
                return res.json({
                    success: true,
                    message: 'Autenticação realizada com sucesso',
                    token,
                    user,
                    userType: 'company'
                });
            }
            
            // Credenciais inválidas
            return res.status(401).json({
                success: false,
                message: 'Email ou senha inválidos'
            });
            
        } catch (error) {
            console.error('Erro na autenticação:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno no servidor'
            });
        }
    },
    
    /**
     * Validar token JWT
     * @param {Object} req - Requisição Express
     * @param {Object} res - Resposta Express
     */
    validateToken: (req, res) => {
        res.json({
            success: true,
            user: req.user,
            message: 'Token válido'
        });
    }
};

module.exports = AuthController; 