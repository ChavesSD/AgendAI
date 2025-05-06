/**
 * AgendAI - Arquivo de Debug e Desenvolvimento
 * Este arquivo ajuda durante o desenvolvimento, não deve ser incluído em produção
 */

// Adiciona recursos para debug
const Debug = {
    // Estado
    isEnabled: true,
    logs: [],
    
    // Inicialização
    init() {
        console.log('Debug mode: Ativado');
        
        // Substitui os métodos console para capturar logs
        this.overrideConsole();
        
        // Adiciona listener de erros
        window.addEventListener('error', (e) => {
            this.logs.push({
                type: 'error',
                message: e.message,
                source: e.filename,
                line: e.lineno,
                column: e.colno,
                timestamp: new Date()
            });
            
            this.showDebugBar();
        });
        
        // Adiciona listener para erros de promise não tratados
        window.addEventListener('unhandledrejection', (e) => {
            this.logs.push({
                type: 'promise-error',
                message: e.reason,
                timestamp: new Date()
            });
            
            this.showDebugBar();
        });
        
        // Adiciona um listener para teclas de debug (Ctrl+Shift+D)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                this.toggleDebugBar();
            }
        });
        
        // Adiciona informações de navegação
        if (typeof App !== 'undefined') {
            const originalRouter = App.router;
            App.router = async function() {
                const start = performance.now();
                await originalRouter.apply(this, arguments);
                const end = performance.now();
                Debug.logs.push({
                    type: 'navigation',
                    message: `Navegação para ${window.location.hash} concluída em ${(end - start).toFixed(2)}ms`,
                    timestamp: new Date()
                });
            };
        }
        
        // Inicializa barra de debug
        this.createDebugBar();
    },
    
    // Substitui os métodos do console para capturar logs
    overrideConsole() {
        const originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info
        };
        
        console.log = (...args) => {
            this.logs.push({
                type: 'log',
                message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '),
                timestamp: new Date()
            });
            originalConsole.log.apply(console, args);
        };
        
        console.warn = (...args) => {
            this.logs.push({
                type: 'warn',
                message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '),
                timestamp: new Date()
            });
            originalConsole.warn.apply(console, args);
        };
        
        console.error = (...args) => {
            this.logs.push({
                type: 'error',
                message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '),
                timestamp: new Date()
            });
            originalConsole.error.apply(console, args);
            this.showDebugBar();
        };
        
        console.info = (...args) => {
            this.logs.push({
                type: 'info',
                message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '),
                timestamp: new Date()
            });
            originalConsole.info.apply(console, args);
        };
    },
    
    // Cria a barra de debug
    createDebugBar() {
        if (document.getElementById('debug-bar')) return;
        
        const debugBar = document.createElement('div');
        debugBar.id = 'debug-bar';
        debugBar.style.display = 'none';
        debugBar.style.position = 'fixed';
        debugBar.style.bottom = '0';
        debugBar.style.left = '0';
        debugBar.style.right = '0';
        debugBar.style.background = 'rgba(0, 0, 0, 0.8)';
        debugBar.style.color = '#fff';
        debugBar.style.padding = '10px';
        debugBar.style.zIndex = '9999';
        debugBar.style.maxHeight = '300px';
        debugBar.style.overflowY = 'auto';
        debugBar.style.fontFamily = 'monospace';
        debugBar.style.fontSize = '12px';
        
        const debugHeader = document.createElement('div');
        debugHeader.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div>
                    <strong>AgendAI Debug</strong>
                    <span id="debug-status" style="margin-left: 10px; color: #7cc700;">Conectado</span>
                </div>
                <div>
                    <button id="debug-clear" style="background: #333; color: #fff; border: 1px solid #555; padding: 2px 5px; margin-right: 5px; cursor: pointer;">Limpar</button>
                    <button id="debug-close" style="background: #333; color: #fff; border: 1px solid #555; padding: 2px 5px; cursor: pointer;">Fechar</button>
                </div>
            </div>
        `;
        
        const debugContent = document.createElement('div');
        debugContent.id = 'debug-content';
        
        debugBar.appendChild(debugHeader);
        debugBar.appendChild(debugContent);
        
        document.body.appendChild(debugBar);
        
        // Adiciona eventos aos botões
        document.getElementById('debug-clear').addEventListener('click', () => {
            this.logs = [];
            this.updateDebugContent();
        });
        
        document.getElementById('debug-close').addEventListener('click', () => {
            this.toggleDebugBar();
        });
    },
    
    // Atualiza o conteúdo da barra de debug
    updateDebugContent() {
        const debugContent = document.getElementById('debug-content');
        if (!debugContent) return;
        
        debugContent.innerHTML = '';
        
        // Mostra os últimos 100 logs (para não sobrecarregar)
        const logs = this.logs.slice(-100).reverse();
        
        logs.forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.style.marginBottom = '5px';
            logEntry.style.borderBottom = '1px solid #333';
            logEntry.style.paddingBottom = '5px';
            
            let color = '#fff';
            let icon = '';
            
            switch (log.type) {
                case 'error':
                    color = '#ff6b6b';
                    icon = '❌ ';
                    break;
                case 'warn':
                    color = '#ffd166';
                    icon = '⚠️ ';
                    break;
                case 'info':
                    color = '#4cc9f0';
                    icon = 'ℹ️ ';
                    break;
                case 'navigation':
                    color = '#4361ee';
                    icon = '🧭 ';
                    break;
                default:
                    color = '#fff';
                    icon = '📋 ';
            }
            
            const time = log.timestamp.toLocaleTimeString();
            
            logEntry.innerHTML = `
                <div style="color: ${color};">
                    <span style="color: #888;">[${time}]</span> ${icon}${log.message}
                </div>
            `;
            
            debugContent.appendChild(logEntry);
        });
        
        // Se não tiver logs, mostra mensagem
        if (logs.length === 0) {
            debugContent.innerHTML = '<div style="color: #888; text-align: center;">Nenhum log registrado</div>';
        }
    },
    
    // Mostra a barra de debug
    showDebugBar() {
        const debugBar = document.getElementById('debug-bar');
        if (debugBar) {
            debugBar.style.display = 'block';
            this.updateDebugContent();
        }
    },
    
    // Esconde a barra de debug
    hideDebugBar() {
        const debugBar = document.getElementById('debug-bar');
        if (debugBar) {
            debugBar.style.display = 'none';
        }
    },
    
    // Alterna a visibilidade da barra de debug
    toggleDebugBar() {
        const debugBar = document.getElementById('debug-bar');
        if (debugBar) {
            debugBar.style.display = debugBar.style.display === 'none' ? 'block' : 'none';
            if (debugBar.style.display === 'block') {
                this.updateDebugContent();
            }
        }
    },
    
    // Simula credenciais para desenvolvimento
    setupDevCredentials() {
        // Simula credenciais de teste para facilitar o desenvolvimento
        if (!localStorage.getItem('agendai_token')) {
            console.info('Debug: Configurando credenciais de desenvolvimento...');
            
            const roles = ['admin', 'company'];
            const role = roles[0]; // admin como padrão
            
            const user = {
                id: role === 'admin' ? 1 : 2,
                name: role === 'admin' ? 'Administrador (Debug)' : 'Empresa Teste (Debug)',
                email: role === 'admin' ? 'admin@agendai.com' : 'empresa@agendai.com',
                role: role
            };
            
            localStorage.setItem('agendai_token', 'dev-token-123456');
            localStorage.setItem('agendai_user', JSON.stringify(user));
            
            console.info(`Debug: Credenciais de ${role} configuradas`);
        }
    }
};

// Inicializa o Debug quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    Debug.init();
    
    // Descomentar para simular login durante desenvolvimento
    // Debug.setupDevCredentials();
    
    console.log('Debug.js carregado com sucesso.');
}); 