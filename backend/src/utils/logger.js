/**
 * Utilitário de logging para o backend
 */

const fs = require('fs');
const path = require('path');

// Diretório de logs
const logsDir = path.join(__dirname, '../../logs');

// Certificar que o diretório logs existe
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Timestamp formatado
const getTimestamp = () => {
    const now = new Date();
    return now.toISOString();
};

// Nome do arquivo de log baseado na data atual
const getLogFileName = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return path.join(logsDir, `${year}-${month}-${day}.log`);
};

// Escrever mensagem no arquivo de log
const writeToLog = (level, message) => {
    const timestamp = getTimestamp();
    const logFile = getLogFileName();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    
    try {
        fs.appendFileSync(logFile, logEntry);
    } catch (error) {
        console.error('Erro ao escrever no arquivo de log:', error);
    }
};

// Níveis de log
const Logger = {
    info: (message) => {
        console.info(`[INFO] ${message}`);
        writeToLog('INFO', message);
    },
    
    warn: (message) => {
        console.warn(`[WARN] ${message}`);
        writeToLog('WARN', message);
    },
    
    error: (message, error = null) => {
        const errorMsg = error ? `${message}: ${error.stack || error.message || error}` : message;
        console.error(`[ERROR] ${errorMsg}`);
        writeToLog('ERROR', errorMsg);
    },
    
    debug: (message) => {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(`[DEBUG] ${message}`);
            writeToLog('DEBUG', message);
        }
    },
    
    http: (req) => {
        const { method, url, ip } = req;
        const message = `${method} ${url} - IP: ${ip}`;
        console.log(`[HTTP] ${message}`);
        writeToLog('HTTP', message);
    }
};

module.exports = Logger; 