/**
 * Script para garantir a persistência de dados no AgendAI
 * Garante que planos e empresas permaneçam no localStorage entre sessões
 */

(function() {
    console.log('🔒 Iniciando sistema de persistência de dados...');
    
    // Verificar se estamos em modo de inicialização
    const isInitMode = !localStorage.getItem('agendai_initialized');
    
    // Dados iniciais para o sistema
    const dadosIniciais = {
        // Planos padrão do sistema
        planos: [
            { 
                id: 1, 
                name: "Plano Básico", 
                price: 50.00, 
                appointments: 50, 
                professionals: 2, 
                services: 10, 
                status: "active", 
                highlight: "none",
                features: {
                    reports: false,
                    emailNotifications: true,
                    smsNotifications: false,
                    whatsAppNotifications: false,
                    customization: false,
                    api: false
                },
                description: "Plano ideal para pequenos negócios iniciando no mundo digital.",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            { 
                id: 2, 
                name: "Plano Profissional", 
                price: 99.90, 
                appointments: 200, 
                professionals: 5, 
                services: 20, 
                status: "active", 
                highlight: "popular",
                features: {
                    reports: true,
                    emailNotifications: true,
                    smsNotifications: true,
                    whatsAppNotifications: false,
                    customization: false,
                    api: false
                },
                description: "Para negócios em crescimento que precisam de mais recursos.",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            { 
                id: 3, 
                name: "Plano Empresarial",

                price: 199.90, 
                appointments: 0, 
                professionals: 0, 
                services: 0, 
                status: "active", 
                highlight: "best-value",
                features: {
                    reports: true,
                    emailNotifications: true,
                    smsNotifications: true,
                    whatsAppNotifications: true,
                    customization: true,
                    api: true
                },
                description: "Solução completa e ilimitada para empresas de médio e grande porte.",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ],
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
                plan: 2,
                planName: "Plano Profissional",
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
                plan: 1,
                planName: "Plano Básico",
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
                
                // Inicializar planos
                if (!localStorage.getItem('agendai_plans')) {
                    localStorage.setItem('agendai_plans', JSON.stringify(dadosIniciais.planos));
                    console.log('✅ Planos iniciais configurados');
                }
                
                // Inicializar empresas
                if (!localStorage.getItem('agendai_companies')) {
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
            // Verificar planos
            try {
                const planosJSON = localStorage.getItem('agendai_plans');
                let planos = [];
                
                if (planosJSON) {
                    planos = JSON.parse(planosJSON);
                    if (!Array.isArray(planos)) {
                        console.error('🚨 Dados de planos corrompidos. Restaurando padrões...');
                        planos = dadosIniciais.planos;
                        localStorage.setItem('agendai_plans', JSON.stringify(planos));
                    } else if (planos.length === 0) {
                        console.warn('⚠️ Nenhum plano encontrado. Adicionando planos padrão...');
                        planos = dadosIniciais.planos;
                        localStorage.setItem('agendai_plans', JSON.stringify(planos));
                    }
                } else {
                    console.warn('⚠️ Planos não encontrados. Adicionando planos padrão...');
                    planos = dadosIniciais.planos;
                    localStorage.setItem('agendai_plans', JSON.stringify(planos));
                }
                
                // Atualizar variável global
                window.plans = planos;
                console.log(`✅ ${planos.length} planos verificados e disponíveis`);
            } catch (error) {
                console.error('🚨 Erro ao verificar planos:', error);
                // Restaurar planos padrão em caso de erro
                localStorage.setItem('agendai_plans', JSON.stringify(dadosIniciais.planos));
                window.plans = dadosIniciais.planos;
            }
            
            // Verificar empresas
            try {
                const empresasJSON = localStorage.getItem('agendai_companies');
                let empresas = [];
                
                if (empresasJSON) {
                    empresas = JSON.parse(empresasJSON);
                    if (!Array.isArray(empresas)) {
                        console.error('🚨 Dados de empresas corrompidos. Restaurando padrões...');
                        empresas = dadosIniciais.empresas;
                        localStorage.setItem('agendai_companies', JSON.stringify(empresas));
                    }
                } else {
                    console.warn('⚠️ Empresas não encontradas. Adicionando empresas padrão...');
                    empresas = dadosIniciais.empresas;
                    localStorage.setItem('agendai_companies', JSON.stringify(empresas));
                }
                
                // Atualizar variável global
                window.companies = empresas;
                console.log(`✅ ${empresas.length} empresas verificadas e disponíveis`);
            } catch (error) {
                console.error('🚨 Erro ao verificar empresas:', error);
                // Restaurar empresas padrão em caso de erro
                localStorage.setItem('agendai_companies', JSON.stringify(dadosIniciais.empresas));
                window.companies = dadosIniciais.empresas;
            }
        },
        
        // Sincronizar dados em memória com localStorage
        sincronizarDados: function() {
            // Sincronizar planos
            if (window.plans && Array.isArray(window.plans)) {
                localStorage.setItem('agendai_plans', JSON.stringify(window.plans));
            }
            
            // Sincronizar empresas
            if (window.companies && Array.isArray(window.companies)) {
                localStorage.setItem('agendai_companies', JSON.stringify(window.companies));
            }
            
            console.log('🔄 Dados sincronizados com localStorage');
        },
        
        // Verificar e sincronizar periodicamente
        iniciarMonitoramento: function() {
            // Sincronizar dados a cada 30 segundos
            setInterval(() => {
                this.sincronizarDados();
            }, 30000);
            
            // Verificar integridade a cada 2 minutos
            setInterval(() => {
                this.verificarIntegridade();
            }, 120000);
            
            // Verificar antes de sair da página
            window.addEventListener('beforeunload', () => {
                this.sincronizarDados();
            });
            
            console.log('👁️ Monitoramento de dados iniciado');
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
        sincronizarDados: DataPersistence.sincronizarDados.bind(DataPersistence)
    };
    
    console.log('✅ Sistema de persistência de dados carregado com sucesso');
})(); 