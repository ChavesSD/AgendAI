/**
 * Rotas de autenticação
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

// Rota de login
router.post('/login', authController.login);

// Rota para validar token
router.get('/validate-token', verifyToken, authController.validateToken);

module.exports = router; 