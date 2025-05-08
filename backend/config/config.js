/**
 * AgendAI - Configurações do Backend
 */

module.exports = {
    // Configuração de ambiente
    env: process.env.NODE_ENV || 'development',
    
    // Configuração do servidor
    server: {
        port: process.env.PORT || 3001,
        host: process.env.HOST || 'localhost'
    },
    
    // Configuração do banco de dados
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'agendai',
        password: process.env.DB_PASSWORD || 'agendai123',
        database: process.env.DB_NAME || 'agendai',
        port: process.env.DB_PORT || 3306,
        connectionLimit: 10
    },
    
    // Configuração de autenticação
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'agendai-secret-key',
        jwtExpiresIn: '1d', // Token expira em 1 dia
        saltRounds: 12 // Rounds de encriptação bcrypt
    },
    
    // Configuração de email
    email: {
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER || 'user@example.com',
            pass: process.env.SMTP_PASS || 'password'
        },
        from: process.env.SMTP_FROM || 'AgendAI <no-reply@agendai.com>'
    },
    
    // Configuração de armazenamento de arquivos (uploads)
    storage: {
        uploadDir: process.env.UPLOAD_DIR || 'uploads/',
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    },
    
    // Configuração de logs
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || 'logs/app.log'
    },
    
    // Configuração de CORS
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    
    // Limites de requisição
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100 // limite de 100 requisições por janela por IP
    }
}; 