/**
 * Script para implementar persistência de planos usando IndexedDB
 * Fornece armazenamento persistente para os planos do sistema
 */

(function() {
    console.log('📦 Iniciando sistema de persistência de planos via IndexedDB...');
    
    // Nome do banco de dados e da store
    const DB_NAME = 'AgendAI_DB';
    const STORE_NAME = 'planos';
    const DB_VERSION = 2; // Versão 2 para adicionar nova store
    
    // Referência para o banco de dados
    let db = null;
    
    // Inicializar o banco de dados
    function inicializarDB() {
        return new Promise((resolve, reject) => {
            try {
                // Verificar se IndexedDB está disponível
                if (!window.indexedDB) {
                    console.warn('❌ IndexedDB não está disponível neste navegador');
                    resolve(false);
                    return;
                }
                
                // Abrir/criar o banco de dados
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                
                // Lidar com erro
                request.onerror = (event) => {
                    console.error('❌ Erro ao abrir IndexedDB:', event.target.error);
                    resolve(false);
                };
                
                // Lidar com sucesso
                request.onsuccess = (event) => {
                    db = event.target.result;
                    console.log('✅ IndexedDB inicializado com sucesso para planos');
                    
                    // Configurar evento para fechar o banco quando a página for fechada
                    window.addEventListener('beforeunload', () => {
                        if (db) {
                            db.close();
                            console.log('IndexedDB fechado');
                        }
                    });
                    
                    resolve(true);
                };
                
                // Lidar com atualização/criação de estrutura
                request.onupgradeneeded = (event) => {
                    const database = event.target.result;
                    
                    // Criar object store para planos se não existir
                    if (!database.objectStoreNames.contains(STORE_NAME)) {
                        const objectStore = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
                        objectStore.createIndex('name', 'name', { unique: false });
                        console.log('✅ Object store de planos criada');
                    }
                    
                    // Criar object store para empresas caso ainda não exista
                    if (!database.objectStoreNames.contains('empresas')) {
                        const empresasStore = database.createObjectStore('empresas', { keyPath: 'id' });
                        empresasStore.createIndex('cnpj', 'cnpj', { unique: true });
                        console.log('✅ Object store de empresas também configurada');
                    }
                };
            } catch (erro) {
                console.error('❌ Erro ao inicializar IndexedDB para planos:', erro);
                resolve(false);
            }
        });
    }
    
    // Salvar planos no IndexedDB
    function salvarPlanosIndexedDB(planos) {
        return new Promise((resolve, reject) => {
            try {
                if (!db) {
                    console.warn('❌ Banco de dados IndexedDB não inicializado');
                    resolve(false);
                    return;
                }
                
                // Iniciar transação
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const objectStore = transaction.objectStore(STORE_NAME);
                
                // Limpar store primeiro para recriar tudo
                const clearRequest = objectStore.clear();
                
                clearRequest.onsuccess = () => {
                    // Adicionar cada plano
                    let contador = 0;
                    
                    // Se não há planos, apenas resolver
                    if (planos.length === 0) {
                        console.log('✅ Nenhum plano para salvar no IndexedDB');
                        resolve(true);
                        return;
                    }
                    
                    // Adicionar cada plano um a um
                    planos.forEach((plano) => {
                        const addRequest = objectStore.add(plano);
                        
                        addRequest.onsuccess = () => {
                            contador++;
                            if (contador === planos.length) {
                                console.log(`✅ ${contador} planos salvos no IndexedDB`);
                                resolve(true);
                            }
                        };
                        
                        addRequest.onerror = (event) => {
                            console.error('❌ Erro ao adicionar plano ao IndexedDB:', event.target.error);
                            contador++;
                            if (contador === planos.length) {
                                resolve(false);
                            }
                        };
                    });
                };
                
                clearRequest.onerror = (event) => {
                    console.error('❌ Erro ao limpar IndexedDB:', event.target.error);
                    resolve(false);
                };
                
                // Lidar com conclusão da transação
                transaction.oncomplete = () => {
                    console.log('✅ Transação IndexedDB para planos completada com sucesso');
                };
                
                transaction.onerror = (event) => {
                    console.error('❌ Erro na transação IndexedDB para planos:', event.target.error);
                    resolve(false);
                };
            } catch (erro) {
                console.error('❌ Erro ao salvar planos no IndexedDB:', erro);
                resolve(false);
            }
        });
    }
    
    // Recuperar planos do IndexedDB
    function recuperarPlanosIndexedDB() {
        return new Promise((resolve, reject) => {
            try {
                if (!db) {
                    console.warn('❌ Banco de dados IndexedDB não inicializado');
                    resolve([]);
                    return;
                }
                
                // Iniciar transação
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const objectStore = transaction.objectStore(STORE_NAME);
                const planos = [];
                
                // Obter todos os registros
                const request = objectStore.openCursor();
                
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        planos.push(cursor.value);
                        cursor.continue();
                    } else {
                        console.log(`✅ Recuperados ${planos.length} planos do IndexedDB`);
                        resolve(planos);
                    }
                };
                
                request.onerror = (event) => {
                    console.error('❌ Erro ao recuperar planos do IndexedDB:', event.target.error);
                    resolve([]);
                };
            } catch (erro) {
                console.error('❌ Erro ao recuperar planos do IndexedDB:', erro);
                resolve([]);
            }
        });
    }
    
    // Verificar localStorage e salvar no IndexedDB periodicamente
    async function sincronizarPlanosComIndexedDB() {
        try {
            // Recuperar dados do localStorage
            const localData = localStorage.getItem('agendai_plans');
            if (localData) {
                try {
                    const planos = JSON.parse(localData);
                    if (Array.isArray(planos) && planos.length > 0) {
                        console.log(`🔄 Sincronizando ${planos.length} planos com IndexedDB...`);
                        await salvarPlanosIndexedDB(planos);
                    }
                } catch (e) {
                    console.error('❌ Erro ao parsear planos do localStorage:', e);
                }
            } else {
                // Se não existem planos no localStorage, criar planos padrão
                inicializarPlanosSeNecessario();
            }
        } catch (erro) {
            console.error('❌ Erro ao sincronizar planos com IndexedDB:', erro);
        }
    }
    
    // Verificar se localStorage está vazio e restaurar do IndexedDB se necessário
    async function verificarERestaurarPlanos() {
        try {
            // Verificar localStorage
            const localData = localStorage.getItem('agendai_plans');
            
            // Se não houver dados no localStorage, tentar restaurar do IndexedDB
            if (!localData || localData === '[]' || localData === 'null') {
                console.log('🔍 localStorage vazio para planos. Tentando restaurar do IndexedDB...');
                
                // Recuperar planos do IndexedDB
                const planos = await recuperarPlanosIndexedDB();
                
                if (planos.length > 0) {
                    console.log(`🔄 Restaurando ${planos.length} planos do IndexedDB para localStorage...`);
                    
                    // Salvar no localStorage
                    localStorage.setItem('agendai_plans', JSON.stringify(planos));
                    
                    // Atualizar variável global
                    window.plans = planos;
                    
                    console.log('✅ Planos restaurados com sucesso do IndexedDB');
                } else {
                    // Se não há planos no IndexedDB, inicializar com planos padrão
                    inicializarPlanosSeNecessario();
                }
            }
        } catch (erro) {
            console.error('❌ Erro ao verificar e restaurar planos:', erro);
        }
    }
    
    // Inicializar planos padrão se necessário
    function inicializarPlanosSeNecessario() {
        // Verificar se já existem planos
        const planosExistentes = localStorage.getItem('agendai_plans');
        if (planosExistentes && planosExistentes !== '[]' && planosExistentes !== 'null') {
            return; // Planos já existem
        }
        
        console.log('⚙️ Criando planos padrão...');
        
        const planosPadrao = [
            {
                id: 1,
                name: 'Plano Básico',
                price: 50.00,
                status: 'active',
                features: {
                    email: true,
                    whatsapp: false,
                    customization: false
                },
                maxAppointments: 50,
                maxProfessionals: 3,
                description: 'Plano básico para pequenos negócios'
            },
            {
                id: 2,
                name: 'Plano Intermediário',
                price: 70.00,
                status: 'active',
                features: {
                    email: true,
                    whatsapp: true,
                    customization: false
                },
                maxAppointments: 150,
                maxProfessionals: 7,
                description: 'Plano intermediário para negócios em crescimento'
            },
            {
                id: 3,
                name: 'Plano Avançado',
                price: 100.00,
                status: 'active',
                features: {
                    email: true,
                    whatsapp: true,
                    customization: true
                },
                maxAppointments: 0,
                maxProfessionals: 0,
                description: 'Plano avançado para negócios estabelecidos'
            }
        ];
        
        // Salvar no localStorage
        localStorage.setItem('agendai_plans', JSON.stringify(planosPadrao));
        
        // Atualizar variável global
        window.plans = planosPadrao;
        
        // Sincronizar com IndexedDB
        salvarPlanosIndexedDB(planosPadrao);
        
        console.log('✅ Planos padrão criados com sucesso');
    }
    
    // Função para obter o nome do plano por ID
    window.obterNomePlano = function(id) {
        const planosJSON = localStorage.getItem('agendai_plans');
        if (planosJSON) {
            try {
                const planos = JSON.parse(planosJSON);
                const plano = planos.find(p => p.id === parseInt(id));
                return plano ? plano.name : 'Plano não encontrado';
            } catch (e) {
                console.error('❌ Erro ao buscar nome do plano:', e);
                return 'Erro ao buscar plano';
            }
        }
        return 'Plano não disponível';
    };
    
    // Função para obter detalhes completos do plano por ID
    window.obterDetalhesPlano = function(id) {
        const planosJSON = localStorage.getItem('agendai_plans');
        if (planosJSON) {
            try {
                const planos = JSON.parse(planosJSON);
                return planos.find(p => p.id === parseInt(id)) || null;
            } catch (e) {
                console.error('❌ Erro ao buscar detalhes do plano:', e);
                return null;
            }
        }
        return null;
    };
    
    // Função para obter todos os planos
    window.obterTodosPlanos = function() {
        const planosJSON = localStorage.getItem('agendai_plans');
        if (planosJSON) {
            try {
                const planos = JSON.parse(planosJSON);
                return Array.isArray(planos) ? planos : [];
            } catch (e) {
                console.error('❌ Erro ao recuperar todos os planos:', e);
                return [];
            }
        }
        return [];
    };
    
    // Inicializar e configurar eventos
    async function inicializar() {
        // Inicializar o banco de dados
        const dbInicializado = await inicializarDB();
        
        if (dbInicializado) {
            // Verificar e restaurar dados imediatamente
            await verificarERestaurarPlanos();
            
            // Sincronizar periodicamente
            await sincronizarPlanosComIndexedDB();
            setInterval(sincronizarPlanosComIndexedDB, 60000); // A cada minuto
            
            // Verificar a cada mudança de URL
            window.addEventListener('hashchange', async () => {
                await verificarERestaurarPlanos();
            });
            
            // Salvar antes de recarregar a página
            window.addEventListener('beforeunload', async () => {
                await sincronizarPlanosComIndexedDB();
            });
            
            // Observar mudanças no localStorage
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = function(key, value) {
                // Chamar implementação original
                originalSetItem.apply(this, arguments);
                
                // Se for a chave de planos, sincronizar com IndexedDB
                if (key === 'agendai_plans') {
                    setTimeout(sincronizarPlanosComIndexedDB, 100);
                }
            };
            
            console.log('✅ Sistema de persistência de planos via IndexedDB configurado com sucesso');
        }
    }
    
    // Iniciar após pequeno delay
    setTimeout(inicializar, 1000);
})(); 