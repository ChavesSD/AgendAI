/**
 * Rotas para gerenciamento de planos
 */

const express = require('express');
const router = express.Router();
const plansController = require('../controllers/plansController');
const { authenticateToken, checkRole } = require('../middlewares/auth');

// Obter todos os planos
router.get('/', authenticateToken, plansController.getAllPlans);

// Obter plano por ID
router.get('/:id', authenticateToken, plansController.getPlanById);

// Criar novo plano (apenas admin)
router.post('/', authenticateToken, checkRole(['admin']), plansController.createPlan);

// Atualizar plano (apenas admin)
router.put('/:id', authenticateToken, checkRole(['admin']), plansController.updatePlan);

// Excluir plano (apenas admin)
router.delete('/:id', authenticateToken, checkRole(['admin']), plansController.deletePlan);

module.exports = router; 