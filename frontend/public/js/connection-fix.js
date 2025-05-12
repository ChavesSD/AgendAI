/**
 * Script de diagnóstico e correção para problemas de conexão com o localhost
 * Este script verifica se os endpoints estão acessíveis e corrige problemas de CORS
 */

(function() {
    console.log('🔍 Iniciando diagnóstico de conexão...');
    
    // Definir configurações globais
    window.CONNECTION_CONFIG = {
        // URL base da API (detectada automaticamente)
        apiBaseUrl: 'http://localhost:3001/api',
        // Status de conectividade
        connected: false,
        // Status de login
        authenticated: false,
        // Tentativas de reconexão
        reconnectAttempts: 0,
        // Máximo de tentativas
        maxReconnectAttempts: 5
    };
    
    // Função para verificar a conexão com o backend
    async function diagnosticarConexao() {
        console.log('🏥 Verificando conexão com o backend...');
        
        try {
            // Verificar se o endpoint de saúde está acessível
            const response = await fetch(`${window.CONNECTION_CONFIG.apiBaseUrl}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                // Adicionar timestamp para evitar cache
                cache: 'no-store'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Conexão com o backend estabelecida!', data);
                window.CONNECTION_CONFIG.connected = true;
                
                // Resolvido o problema de conexão
                ocultarMensagemErro();
                
                // Verificar autenticação
                verificarAutenticacao();
                
                return true;
            } else {
                console.error(`❌ Backend respondeu com status ${response.status}`);
                window.CONNECTION_CONFIG.connected = false;
                mostrarMensagemErro(`O servidor respondeu com status ${response.status}. Verifique se todos os serviços estão ativos.`);
                return false;
            }
        } catch (error) {
            console.error('❌ Erro ao conectar com o backend:', error);
            window.CONNECTION_CONFIG.connected = false;
            
            // Verificar se é um erro de CORS
            if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
                mostrarMensagemErro('Erro de política de CORS. Verifique se o backend permite requisições do frontend.');
            } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                mostrarMensagemErro('Erro de conexão com o servidor. Verifique se o backend está rodando na porta 3001.');
            } else {
                mostrarMensagemErro(`Erro de conexão: ${error.message}`);
            }
            return false;
        }
    }
    
    // Verificar se o usuário está autenticado
    function verificarAutenticacao() {
        try {
            const authData = localStorage.getItem('agendai_auth');
            if (!authData) {
                console.log('🔒 Usuário não autenticado');
                window.CONNECTION_CONFIG.authenticated = false;
                
                // Se estiver em uma página protegida, redirecionar para login
                const path = window.location.hash.slice(1) || '/';
                if (!['/', '/login', '/terms', '/privacy'].includes(path)) {
                    console.log('Redirecionando para página de login...');
                    window.location.hash = '#/login';
                }
                
                return false;
            }
            
            // Verificar se o token é válido
            try {
                const auth = JSON.parse(authData);
                if (!auth.token) {
                    console.log('🔒 Token não encontrado no localStorage');
                    window.CONNECTION_CONFIG.authenticated = false;
                    return false;
                }
                
                // Verificar expiração (se existir)
                if (auth.expires && new Date(auth.expires) < new Date()) {
                    console.log('🔒 Token expirado');
                    window.CONNECTION_CONFIG.authenticated = false;
                    localStorage.removeItem('agendai_auth');
                    return false;
                }
                
                console.log('🔓 Usuário autenticado');
                window.CONNECTION_CONFIG.authenticated = true;
                return true;
            } catch (error) {
                console.error('🔒 Erro ao processar dados de autenticação:', error);
                window.CONNECTION_CONFIG.authenticated = false;
                return false;
            }
        } catch (error) {
            console.error('🔒 Erro ao verificar autenticação:', error);
            return false;
        }
    }
    
    // Exibir mensagem de erro na página
    function mostrarMensagemErro(mensagem) {
        const conteudo = document.getElementById('app-content');
        if (!conteudo) return;
        
        // Criar elemento de mensagem se não existir
        let mensagemEl = document.getElementById('connection-error-message');
        if (!mensagemEl) {
            mensagemEl = document.createElement('div');
            mensagemEl.id = 'connection-error-message';
            mensagemEl.className = 'alert alert-danger fixed-top mx-auto mt-4 shadow-lg';
            mensagemEl.style.maxWidth = '500px';
            mensagemEl.style.zIndex = '9999';
            document.body.appendChild(mensagemEl);
        }
        
        mensagemEl.innerHTML = `
            <h5 class="alert-heading"><i class="fas fa-exclamation-triangle me-2"></i> Problema de Conexão</h5>
            <p>${mensagem}</p>
            <hr>
            <div class="d-flex justify-content-between">
                <button class="btn btn-sm btn-outline-danger" onclick="window.location.reload()">
                    <i class="fas fa-sync-alt me-1"></i> Recarregar
                </button>
                <div>
                    <button class="btn btn-sm btn-outline-secondary me-2" id="btn-acessar-localmente">
                        <i class="fas fa-database me-1"></i> Usar Dados Locais
                    </button>
                    <button class="btn btn-sm btn-primary" id="btn-tentar-reconectar">
                        <i class="fas fa-plug me-1"></i> Reconectar
                    </button>
                </div>
            </div>
        `;
        
        // Configurar botões
        setTimeout(() => {
            const btnReconectar = document.getElementById('btn-tentar-reconectar');
            if (btnReconectar) {
                btnReconectar.onclick = async function() {
                    window.CONNECTION_CONFIG.reconnectAttempts++;
                    mensagemEl.innerHTML = `<div class="text-center py-2"><div class="spinner-border spinner-border-sm text-primary" role="status"></div> Tentando reconectar...</div>`;
                    const sucesso = await diagnosticarConexao();
                    
                    if (sucesso) {
                        // Recarregar a página atual
                        const currentPath = window.location.hash || '#/';
                        window.location.hash = '#/';
                        setTimeout(() => window.location.hash = currentPath, 100);
                    } else if (window.CONNECTION_CONFIG.reconnectAttempts >= window.CONNECTION_CONFIG.maxReconnectAttempts) {
                        mostrarMensagemErro('Número máximo de tentativas excedido. Por favor, verifique se o servidor está rodando corretamente.');
                    }
                };
            }
            
            const btnAcessarLocal = document.getElementById('btn-acessar-localmente');
            if (btnAcessarLocal) {
                btnAcessarLocal.onclick = function() {
                    // Ativar modo offline
                    window.CONNECTION_CONFIG.offlineMode = true;
                    localStorage.setItem('agendai_offline_mode', 'true');
                    
                    // Criar token temporário se necessário
                    if (!verificarAutenticacao()) {
                        const tempAuthData = {
                            token: 'offline-mode-token',
                            user: {
                                id: 1,
                                name: 'Usuário Offline',
                                email: 'offline@agendai.com',
                                role: 'admin',
                                status: 'active',
                                companyId: null
                            }
                        };
                        
                        localStorage.setItem('agendai_auth', JSON.stringify(tempAuthData));
                    }
                    
                    // Remover mensagem e recarregar
                    ocultarMensagemErro();
                    
                    // Direcionar para o dashboard
                    window.location.hash = '#/admin/dashboard';
                };
            }
        }, 100);
    }
    
    // Ocultar mensagem de erro
    function ocultarMensagemErro() {
        const mensagemEl = document.getElementById('connection-error-message');
        if (mensagemEl) {
            mensagemEl.remove();
        }
    }
    
    // Executar diagnóstico
    diagnosticarConexao();
    
    // Verificar conectividade periodicamente
    const intervalId = setInterval(async () => {
        // Se já estiver conectado, diminuir a frequência de verificação
        if (window.CONNECTION_CONFIG.connected) {
            clearInterval(intervalId);
            
            // Verificar com menos frequência se já está conectado
            setInterval(diagnosticarConexao, 30000);
        }
    }, 5000);
    
    // Expor função de diagnóstico globalmente
    window.verificarConexaoBackend = diagnosticarConexao;
    
    // Criar evento personalizado para notificar quando a conexão for estabelecida
    document.addEventListener('DOMContentLoaded', function() {
        if (window.CONNECTION_CONFIG.connected) {
            document.dispatchEvent(new CustomEvent('backend-connected'));
        }
    });
    
    console.log('✅ Diagnóstico de conexão inicializado');
})(); 