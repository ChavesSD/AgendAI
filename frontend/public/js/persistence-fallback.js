/**
 * Script para implementar fallback de persistência usando IndexedDB
 * Fornece redundância ao sistema de armazenamento das empresas
 */

(function() {
    console.log('📦 Iniciando sistema de persistência IndexedDB...');
    
    // Nome do banco de dados e da store
    const DB_NAME = 'AgendAI_DB';
    const STORE_NAME = 'empresas';
    const DB_VERSION = 1;
    
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
                    console.log('✅ IndexedDB inicializado com sucesso');
                    
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
                    
                    // Criar object store se não existir
                    if (!database.objectStoreNames.contains(STORE_NAME)) {
                        const objectStore = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
                        objectStore.createIndex('cnpj', 'cnpj', { unique: true });
                        console.log('✅ Object store de empresas criada');
                    }
                };
            } catch (erro) {
                console.error('❌ Erro ao inicializar IndexedDB:', erro);
                resolve(false);
            }
        });
    }
    
    // Salvar empresas no IndexedDB
    function salvarEmpresasIndexedDB(empresas) {
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
                    // Adicionar cada empresa
                    let contador = 0;
                    
                    // Se não há empresas, apenas resolva
                    if (empresas.length === 0) {
                        console.log('✅ Nenhuma empresa para salvar no IndexedDB');
                        resolve(true);
                        return;
                    }
                    
                    // Adicionar cada empresa uma a uma
                    empresas.forEach((empresa) => {
                        const addRequest = objectStore.add(empresa);
                        
                        addRequest.onsuccess = () => {
                            contador++;
                            if (contador === empresas.length) {
                                console.log(`✅ ${contador} empresas salvas no IndexedDB`);
                                resolve(true);
                            }
                        };
                        
                        addRequest.onerror = (event) => {
                            // Tentar atualizar se a empresa já existe
                            if (event.target.error.name === 'ConstraintError') {
                                const putRequest = objectStore.put(empresa);
                                putRequest.onsuccess = () => {
                                    contador++;
                                    if (contador === empresas.length) {
                                        console.log(`✅ ${contador} empresas salvas/atualizadas no IndexedDB`);
                                        resolve(true);
                                    }
                                };
                                putRequest.onerror = (putError) => {
                                    console.error('❌ Erro ao atualizar empresa no IndexedDB:', putError);
                                    contador++;
                                    if (contador === empresas.length) {
                                        resolve(false);
                                    }
                                };
                            } else {
                                console.error('❌ Erro ao adicionar empresa ao IndexedDB:', event.target.error);
                                contador++;
                                if (contador === empresas.length) {
                                    resolve(false);
                                }
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
                    console.log('✅ Transação IndexedDB completada com sucesso');
                };
                
                transaction.onerror = (event) => {
                    console.error('❌ Erro na transação IndexedDB:', event.target.error);
                    resolve(false);
                };
            } catch (erro) {
                console.error('❌ Erro ao salvar empresas no IndexedDB:', erro);
                resolve(false);
            }
        });
    }
    
    // Recuperar empresas do IndexedDB
    function recuperarEmpresasIndexedDB() {
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
                const empresas = [];
                
                // Obter todos os registros
                const request = objectStore.openCursor();
                
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        empresas.push(cursor.value);
                        cursor.continue();
                    } else {
                        console.log(`✅ Recuperadas ${empresas.length} empresas do IndexedDB`);
                        resolve(empresas);
                    }
                };
                
                request.onerror = (event) => {
                    console.error('❌ Erro ao recuperar empresas do IndexedDB:', event.target.error);
                    resolve([]);
                };
            } catch (erro) {
                console.error('❌ Erro ao recuperar empresas do IndexedDB:', erro);
                resolve([]);
            }
        });
    }
    
    // Verificar localStorage e salvar no IndexedDB periodicamente
    async function sincronizarComIndexedDB() {
        try {
            // Recuperar dados do localStorage
            const localData = localStorage.getItem('agendai_companies');
            if (localData) {
                try {
                    const empresas = JSON.parse(localData);
                    if (Array.isArray(empresas) && empresas.length > 0) {
                        console.log(`🔄 Sincronizando ${empresas.length} empresas com IndexedDB...`);
                        await salvarEmpresasIndexedDB(empresas);
                    }
                } catch (e) {
                    console.error('❌ Erro ao parsear empresas do localStorage:', e);
                }
            }
        } catch (erro) {
            console.error('❌ Erro ao sincronizar com IndexedDB:', erro);
        }
    }
    
    // Verificar se localStorage está vazio e restaurar do IndexedDB se necessário
    async function verificarERestaurar() {
        try {
            // Verificar localStorage
            const localData = localStorage.getItem('agendai_companies');
            
            // Se não houver dados no localStorage, tentar restaurar do IndexedDB
            if (!localData || localData === '[]' || localData === 'null') {
                console.log('🔍 localStorage vazio. Tentando restaurar do IndexedDB...');
                
                // Recuperar empresas do IndexedDB
                const empresas = await recuperarEmpresasIndexedDB();
                
                if (empresas.length > 0) {
                    console.log(`🔄 Restaurando ${empresas.length} empresas do IndexedDB para localStorage...`);
                    
                    // Salvar no localStorage
                    localStorage.setItem('agendai_companies', JSON.stringify(empresas));
                    
                    // Atualizar variável global
                    window.companies = empresas;
                    
                    // Atualizar a interface se estiver na página correta
                    if (typeof window.carregarEExibirEmpresas === 'function' && 
                        window.location.hash.includes('/admin/companies')) {
                        window.carregarEExibirEmpresas();
                    }
                    
                    console.log('✅ Dados restaurados com sucesso do IndexedDB');
                }
            }
        } catch (erro) {
            console.error('❌ Erro ao verificar e restaurar dados:', erro);
        }
    }
    
    // Inicializar e configurar eventos
    async function inicializar() {
        // Inicializar o banco de dados
        const dbInicializado = await inicializarDB();
        
        if (dbInicializado) {
            // Verificar e restaurar dados imediatamente
            await verificarERestaurar();
            
            // Sincronizar periodicamente
            await sincronizarComIndexedDB();
            setInterval(sincronizarComIndexedDB, 60000); // A cada minuto
            
            // Verificar a cada mudança de URL
            window.addEventListener('hashchange', async () => {
                if (window.location.hash.includes('/admin/companies')) {
                    await verificarERestaurar();
                }
            });
            
            // Salvar antes de recarregar a página
            window.addEventListener('beforeunload', async () => {
                await sincronizarComIndexedDB();
            });
            
            // Observar mudanças no localStorage
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = function(key, value) {
                // Chamar implementação original
                originalSetItem.apply(this, arguments);
                
                // Se for a chave de empresas, sincronizar com IndexedDB
                if (key === 'agendai_companies') {
                    setTimeout(sincronizarComIndexedDB, 100);
                }
            };
            
            console.log('✅ Sistema de persistência IndexedDB configurado com sucesso');
        }
    }
    
    // Iniciar após pequeno delay
    setTimeout(inicializar, 1000);
})(); 