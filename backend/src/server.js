/**
 * AgendAI - Servidor backend
 */

// Carregar variáveis de ambiente
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const config = require('../config/config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const rateLimit = require('express-rate-limit');
const fs = require('fs');

// Importar rotas
const authRoutes = require('./routes/auth');
const plansRoutes = require('./routes/plans');

// Importar middlewares
const { authenticateToken, checkRole } = require('./middlewares/auth');

// Criar o app Express
const app = express();

// Configurar middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar limite de requisições
const apiLimiter = rateLimit(config.rateLimit);
app.use('/api/', apiLimiter);

// Criar pool de conexões com o banco de dados
let pool;

// Inicializar banco de dados
async function initDb() {
    try {
        pool = mysql.createPool(config.database);
        console.log('Conexão com o banco de dados estabelecida');
        
        // Verificar conexão
        const connection = await pool.getConnection();
        connection.release();
        
        // Verificar e criar tabelas necessárias
        await createTablesIfNotExist();
        
        return true;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        return false;
    }
}

// Criar as tabelas necessárias se não existirem
async function createTablesIfNotExist() {
    try {
        const connection = await pool.getConnection();
        
        // Tabela de planos
        await connection.query(`
            CREATE TABLE IF NOT EXISTS plans (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                appointments INT NOT NULL DEFAULT 0,
                professionals INT NOT NULL DEFAULT 0,
                services INT NOT NULL DEFAULT 0,
                status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
                highlight ENUM('none', 'popular', 'recommended', 'best-value') NOT NULL DEFAULT 'none',
                description TEXT,
                features JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        console.log('Tabelas verificadas/criadas com sucesso');
        connection.release();
    } catch (error) {
        console.error('Erro ao criar tabelas:', error);
        throw error;
    }
}

// Rota para verificação de status do servidor
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Servidor AgendAI está funcionando corretamente',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Configurar rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/plans', plansRoutes);

// Endpoint de login (mantido para compatibilidade)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    try {
        console.log(`Tentativa de login para o email: ${email}`);
        
        const [rows] = await pool.query(
            'SELECT id, name, email, password, role, company_id, status FROM users WHERE email = ?',
            [email]
        );
        
        console.log(`Usuários encontrados: ${rows.length}`);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        
        const user = rows[0];
        console.log(`Usuário encontrado: ${user.name}, Role: ${user.role}`);
        
        if (user.status !== 'active') {
            return res.status(403).json({ error: 'Conta inativa ou suspensa' });
        }
        
        console.log(`Senha fornecida: ${password}`);
        console.log(`Hash armazenado: ${user.password}`);
        
        // Tente autenticar diretamente para usuários demo
        let autenticado = false;
        if ((email === 'admin@agendai.com' && password === 'admin') || 
            (email === 'empresa@agendai.com' && password === 'empresa')) {
            console.log('Autenticação direta para usuário demo');
            autenticado = true;
        } else {
            // Verificação normal de senha
            const passwordMatch = await bcrypt.compare(password, user.password);
            console.log(`Resultado da comparação: ${passwordMatch}`);
            autenticado = passwordMatch;
        }
        
        if (!autenticado) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        
        // Se for usuário de empresa, buscar dados da empresa
        let company = null;
        if (user.role !== 'admin' && user.company_id) {
            const [companyRows] = await pool.query(
                'SELECT id, name, email, status, plan_id, payment_status FROM companies WHERE id = ?',
                [user.company_id]
            );
            
            if (companyRows.length > 0) {
                company = companyRows[0];
                
                // Verificar status da empresa e pagamento
                if (company.status !== 'active') {
                    return res.status(403).json({ error: 'Conta da empresa inativa ou suspensa' });
                }
                
                if (company.payment_status === 'overdue' || company.payment_status === 'canceled') {
                    return res.status(403).json({ error: 'Pagamento da empresa pendente ou cancelado' });
                }
            }
        }
        
        // Atualizar último login
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id]
        );
        
        // Criar token JWT
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.company_id
        };
        
        const token = jwt.sign(userData, config.auth.jwtSecret, { expiresIn: config.auth.jwtExpiresIn });
        
        // Remover senha antes de enviar resposta
        delete user.password;
        
        res.json({
            user: {
                ...user,
                company
            },
            token
        });
        
    } catch (error) {
        console.error('Erro durante login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rotas protegidas - Usuários
app.get('/api/users', authenticateToken, checkRole(['admin', 'company_admin']), async (req, res) => {
    try {
        let query = 'SELECT id, name, email, role, company_id, status, created_at FROM users WHERE 1=1';
        const params = [];
        
        // Filtrar por empresa se não for admin
        if (req.user.role === 'company_admin') {
            query += ' AND company_id = ?';
            params.push(req.user.companyId);
        } 
        // Filtrar por empresa específica se for admin e fornecer company_id
        else if (req.user.role === 'admin' && req.query.company_id) {
            query += ' AND company_id = ?';
            params.push(req.query.company_id);
        }
        
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para obter informações do usuário atual
app.get('/api/users/me', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, email, role, company_id, status, created_at FROM users WHERE id = ?',
            [req.user.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        const user = rows[0];
        
        // Se for usuário de empresa, buscar dados da empresa
        if (user.role !== 'admin' && user.company_id) {
            const [companyRows] = await pool.query(
                'SELECT id, name, email, status, plan_id, payment_status FROM companies WHERE id = ?',
                [user.company_id]
            );
            
            if (companyRows.length > 0) {
                user.company = companyRows[0];
            }
        }
        
        res.json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Servir arquivos estáticos do frontend
const frontendPath = path.join(__dirname, '../../frontend');
app.use(express.static(frontendPath));

// Rota para todas as outras solicitações que retorna o index.html (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Iniciar o servidor
async function startServer() {
    // Certificar que o banco de dados está conectado antes de iniciar o servidor
    const dbConnected = await initDb();
    
    if (!dbConnected) {
        console.warn('AVISO: Não foi possível conectar ao banco de dados.');
        console.warn('O servidor continuará em execução, mas as funcionalidades que dependem do banco de dados não funcionarão.');
        console.warn('Se estiver em ambiente de desenvolvimento, você pode usar localStorage para testes.');
        
        // Em produção, seria melhor encerrar
        if (config.env === 'production') {
            console.error('Falha ao iniciar o servidor: não foi possível conectar ao banco de dados');
            process.exit(1);
        }
    }
    
    // Criar pasta de uploads se não existir
    if (!fs.existsSync(config.storage.uploadDir)) {
        fs.mkdirSync(config.storage.uploadDir, { recursive: true });
    }
    
    // Iniciar o servidor
    app.listen(config.server.port, config.server.host, () => {
        console.log(`Servidor rodando em http://${config.server.host}:${config.server.port}`);
    });
}

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
    console.error('Erro não tratado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promessa rejeitada não tratada:', reason);
});

// Iniciar o servidor
startServer(); 