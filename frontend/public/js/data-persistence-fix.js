/**
 * Script para garantir a persistência de dados no AgendAI
 * Garante que empresas permaneçam no localStorage entre sessões
 */

(function() {
    console.log('🔒 Iniciando sistema de persistência de dados...');
    
    // Limpar imediatamente qualquer dado inválido
    try {
        // Verificar se há dados inválidos no localStorage
        const keys = ['agendai_companies', 'agendai_auth', 'agendai_initialized'];
        
        keys.forEach(key => {
            try {
                const value = localStorage.getItem(key);
                if (value) {
                    // Verificar se o JSON é válido
                    JSON.parse(value);
                }
            } catch (e) {
                console.warn(`⚠️ Dados inválidos encontrados para ${key}, limpando...`);
                localStorage.removeItem(key);
            }
        });
    } catch (e) {
        console.error('❌ Erro ao limpar dados inválidos:', e);
    }
    
    // Verificar se estamos em modo de inicialização
    const isInitMode = !localStorage.getItem('agendai_initialized');
    
    // Verificar se o usuário excluiu todas as empresas intencionalmente
    const verificarExclusaoIntencional = function() {
        return localStorage.getItem('agendai_companies_cleared') === 'true';
    };
    
    // Dados iniciais para o sistema
    const dadosIniciais = {
        // Empresas de exemplo
        empresas: [
            {
                id: 1001,
                name: "Salão Beleza Total",
                cnpj: "12.345.678/0001-90",
                email: "contato@belezatotal.com",
                phone: "(11) 98765-4321",
                address: "Rua das Flores, 123",
                city: "São Paulo",
                state: "SP",
                zip: "01234-567",
                status: "active",
                statusText: "Ativo",
                category: "salon",
                createdAt: "01/05/2023"
            },
            {
                id: 1002,
                name: "Barbearia Vintage",
                cnpj: "98.765.432/0001-10",
                email: "contato@barbeariavintage.com",
                phone: "(11) 91234-5678",
                address: "Av. Paulista, 1000",
                city: "São Paulo",
                state: "SP",
                zip: "01310-100",
                status: "active",
                statusText: "Ativo",
                category: "barber",
                createdAt: "15/06/2023"
            }
        ]
    };
    
    // Funções para garantir persistência
    const DataPersistence = {
        // Inicializar dados padrão se necessário
        inicializar: function() {
            if (isInitMode) {
                console.log('🔄 Primeira inicialização do sistema. Configurando dados iniciais...');
                
                // Inicializar empresas apenas se não foram excluídas intencionalmente
                if (!localStorage.getItem('agendai_companies') && !verificarExclusaoIntencional()) {
                    localStorage.setItem('agendai_companies', JSON.stringify(dadosIniciais.empresas));
                    console.log('✅ Empresas iniciais configuradas');
                }
                
                // Marcar sistema como inicializado
                localStorage.setItem('agendai_initialized', 'true');
            } else {
                console.log('🔄 Sistema já inicializado. Verificando integridade dos dados...');
                this.verificarIntegridade();
            }
        },
        
        // Verificar integridade dos dados e corrigir se necessário
        verificarIntegridade: function() {
            // Verificar empresas - Não restaurar se foram excluídas intencionalmente
            try {
                const empresasJSON = localStorage.getItem('agendai_companies');
                let empresas = [];
                
                if (empresasJSON) {
                    try {
                        empresas = JSON.parse(empresasJSON);
                        if (!Array.isArray(empresas)) {
                            console.error('🚨 Dados de empresas corrompidos. Restaurando padrões...');
                            // Só restaurar se não foram excluídas intencionalmente
                            if (!verificarExclusaoIntencional()) {
                                empresas = dadosIniciais.empresas;
                                localStorage.setItem('agendai_companies', JSON.stringify(empresas));
                            } else {
                                empresas = [];
                                localStorage.setItem('agendai_companies', JSON.stringify(empresas));
                            }
                        }
                    } catch (e) {
                        // Se houver erro ao parsear o JSON, limpar e usar um array vazio
                        console.error('🚨 Erro ao parsear dados de empresas:', e);
                        localStorage.setItem('agendai_companies', JSON.stringify([]));
                        empresas = [];
                    }
                } else if (!verificarExclusaoIntencional()) {
                    // Só restaurar empresas padrão se não foram excluídas intencionalmente
                    console.warn('⚠️ Empresas não encontradas. Adicionando empresas padrão...');
                    empresas = dadosIniciais.empresas;
                    localStorage.setItem('agendai_companies', JSON.stringify(empresas));
                } else {
                    // Se foram excluídas intencionalmente, manter vazio
                    empresas = [];
                    localStorage.setItem('agendai_companies', JSON.stringify(empresas));
                }
                
                // Atualizar variável global
                window.companies = empresas;
                console.log(`✅ ${empresas.length} empresas verificadas e disponíveis`);
            } catch (error) {
                console.error('🚨 Erro ao verificar empresas:', error);
                // Só restaurar padrão se não foram excluídas intencionalmente
                if (!verificarExclusaoIntencional()) {
                    localStorage.setItem('agendai_companies', JSON.stringify(dadosIniciais.empresas));
                    window.companies = dadosIniciais.empresas;
                } else {
                    localStorage.setItem('agendai_companies', JSON.stringify([]));
                    window.companies = [];
                }
            }
        },
        
        // Sincronizar dados em memória com localStorage
        sincronizarDados: function() {
            // Sincronizar empresas
            if (window.companies && Array.isArray(window.companies)) {
                localStorage.setItem('agendai_companies', JSON.stringify(window.companies));
                
                // Remover código que marcava empresas como intencionalmente excluídas
                // Apenas registra a sincronização
                console.log(`✅ ${window.companies.length} empresas sincronizadas com localStorage`);
            }
            
            console.log('🔄 Dados sincronizados com localStorage');
        },
        
        // Verificar e sincronizar periodicamente
        iniciarMonitoramento: function() {
            // Sincronizar dados a cada 5 minutos (300000ms) em vez de 30 segundos
            setInterval(() => {
                this.sincronizarDados();
            }, 300000);
            
            // Verificar integridade a cada 30 minutos (1800000ms) em vez de 2 minutos
            setInterval(() => {
                this.verificarIntegridade();
            }, 1800000);
            
            // Verificar antes de sair da página
            window.addEventListener('beforeunload', () => {
                this.sincronizarDados();
            });
            
            console.log('👁️ Monitoramento de dados iniciado (com intervalos estendidos)');
        },
        
        // Marcar que as empresas foram excluídas intencionalmente
        marcarExclusaoEmpresas: function() {
            localStorage.setItem('agendai_companies_cleared', 'true');
            console.log('🧹 Marcado que as empresas foram excluídas intencionalmente');
        },
        
        // Resetar flag de exclusão intencional das empresas
        resetarExclusaoEmpresas: function() {
            localStorage.removeItem('agendai_companies_cleared');
            console.log('🔄 Reset da flag de exclusão intencional de empresas');
        }
    };
    
    // Inicializar sistema de persistência
    DataPersistence.inicializar();
    DataPersistence.iniciarMonitoramento();
    
    // Carregar dados nas variáveis globais se a página já foi carregada
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        DataPersistence.verificarIntegridade();
    } else {
        // Caso contrário, esperar o DOM carregar
        document.addEventListener('DOMContentLoaded', () => {
            DataPersistence.verificarIntegridade();
        });
    }
    
    // Hook para intercepção de cliques de login/logout
    document.addEventListener('click', function(e) {
        // Intercepção de logout
        if (e.target.closest('#logout-button')) {
            console.log('👋 Logout detectado. Preservando dados...');
            DataPersistence.sincronizarDados();
        }
    });
    
    // Disponibilizar funções globalmente para outros scripts
    window.DataPersistence = {
        verificarIntegridade: DataPersistence.verificarIntegridade.bind(DataPersistence),
        sincronizarDados: DataPersistence.sincronizarDados.bind(DataPersistence),
        marcarExclusaoEmpresas: DataPersistence.marcarExclusaoEmpresas.bind(DataPersistence),
        resetarExclusaoEmpresas: DataPersistence.resetarExclusaoEmpresas.bind(DataPersistence)
    };
    
    console.log('✅ Sistema de persistência de dados carregado com sucesso');
})(); 