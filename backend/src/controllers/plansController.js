/**
 * Controller para gerenciamento de planos
 */

// Importar dependências
const mysql = require('mysql2/promise');
const config = require('../../config/config');

// Referência ao pool de conexões do banco de dados
let pool;

// Inicializar conexão com o banco
async function initPool() {
    if (!pool) {
        pool = mysql.createPool(config.database);
    }
}

// Obter todos os planos
exports.getAllPlans = async (req, res) => {
    try {
        await initPool();

        // Consultar todos os planos
        const [rows] = await pool.query(
            'SELECT * FROM plans ORDER BY price ASC'
        );

        // Converter features de JSON para objeto (robusto)
        const plans = rows.map(plan => {
            let featuresObj = {};
            try {
                featuresObj = plan.features ? JSON.parse(plan.features) : {};
            } catch (e) {
                featuresObj = {};
            }
            return {
                ...plan,
                features: featuresObj
            };
        });

        res.json(plans);
    } catch (error) {
        console.error('Erro ao buscar planos:', error);
        res.status(500).json({ error: 'Erro ao buscar planos' });
    }
};

// Obter um plano específico pelo ID
exports.getPlanById = async (req, res) => {
    try {
        await initPool();
        const { id } = req.params;

        const [rows] = await pool.query(
            'SELECT * FROM plans WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Plano não encontrado' });
        }

        // Converter features de JSON para objeto
        const plan = {
            ...rows[0],
            features: rows[0].features ? JSON.parse(rows[0].features) : {}
        };

        res.json(plan);
    } catch (error) {
        console.error('Erro ao buscar plano:', error);
        res.status(500).json({ error: 'Erro ao buscar plano' });
    }
};

// Criar novo plano
exports.createPlan = async (req, res) => {
    try {
        await initPool();
        const { 
            name, 
            price, 
            appointments, 
            professionals, 
            services, 
            status,
            highlight,
            description,
            features
        } = req.body;

        // Validar campos obrigatórios
        if (!name || price === undefined) {
            return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
        }

        // Converter features para JSON
        const featuresJson = JSON.stringify(features || {});

        const [result] = await pool.query(
            `INSERT INTO plans 
             (name, price, appointments, professionals, services, status, highlight, description, features) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, price, appointments, professionals, services, status || 'active', highlight || 'none', description || '', featuresJson]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            price,
            appointments,
            professionals,
            services,
            status: status || 'active',
            highlight: highlight || 'none',
            description: description || '',
            features: features || {}
        });
    } catch (error) {
        console.error('Erro ao criar plano:', error);
        res.status(500).json({ error: 'Erro ao criar plano' });
    }
};

// Atualizar plano existente
exports.updatePlan = async (req, res) => {
    try {
        await initPool();
        const { id } = req.params;
        const { 
            name, 
            price, 
            appointments, 
            professionals, 
            services, 
            status,
            highlight,
            description,
            features
        } = req.body;

        // Verificar se o plano existe
        const [existingPlan] = await pool.query(
            'SELECT id FROM plans WHERE id = ?',
            [id]
        );

        if (existingPlan.length === 0) {
            return res.status(404).json({ error: 'Plano não encontrado' });
        }

        // Converter features para JSON
        const featuresJson = JSON.stringify(features || {});

        await pool.query(
            `UPDATE plans 
             SET name = ?, price = ?, appointments = ?, professionals = ?, services = ?, 
                 status = ?, highlight = ?, description = ?, features = ?
             WHERE id = ?`,
            [name, price, appointments, professionals, services, status, highlight, description || '', featuresJson, id]
        );

        res.json({
            id: parseInt(id),
            name,
            price,
            appointments,
            professionals,
            services,
            status,
            highlight,
            description: description || '',
            features: features || {}
        });
    } catch (error) {
        console.error('Erro ao atualizar plano:', error);
        res.status(500).json({ error: 'Erro ao atualizar plano' });
    }
};

// Excluir plano
exports.deletePlan = async (req, res) => {
    try {
        await initPool();
        const { id } = req.params;

        // Verificar se o plano existe
        const [existingPlan] = await pool.query(
            'SELECT id FROM plans WHERE id = ?',
            [id]
        );

        if (existingPlan.length === 0) {
            return res.status(404).json({ error: 'Plano não encontrado' });
        }

        // Verificar se o plano está em uso
        const [usageCheck] = await pool.query(
            'SELECT COUNT(*) as count FROM companies WHERE plan_id = ?',
            [id]
        );

        if (usageCheck[0].count > 0) {
            return res.status(400).json({ 
                error: 'Este plano não pode ser excluído pois está em uso por uma ou mais empresas'
            });
        }

        await pool.query('DELETE FROM plans WHERE id = ?', [id]);

        res.status(200).json({ message: 'Plano excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir plano:', error);
        res.status(500).json({ error: 'Erro ao excluir plano' });
    }
}; 