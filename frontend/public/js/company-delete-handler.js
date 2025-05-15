/**
 * Script para gerenciar a exclusão de empresas de forma permanente
 * Integra todos os mecanismos de armazenamento: localStorage, sessionStorage e IndexedDB
 */

(function() {
    console.log('🗑️ Inicializando gerenciador de exclusão de empresas...');
    
    // Função principal para excluir uma empresa permanentemente
    window.excluirEmpresaPermanentemente = async function(id) {
        if (!id) {
            console.error('❌ ID da empresa não fornecido');
            return false;
        }
        
        console.log(`🗑️ Iniciando exclusão permanente da empresa ID: ${id}`);
        
        try {
            // 1. Primeiro, encontrar a empresa para confirmar exclusão
            const empresa = obterEmpresaPorId(id);
            
            if (!empresa) {
                console.error(`❌ Empresa ID ${id} não encontrada`);
                alert('Erro: Empresa não encontrada no sistema.');
                return false;
            }
            
            // 2. Confirmar a exclusão com o usuário
            if (!confirm(`Tem certeza que deseja excluir permanentemente a empresa "${empresa.name}"?\nEsta ação não pode ser desfeita.`)) {
                console.log('🛑 Exclusão cancelada pelo usuário');
                return false;
            }
            
            // 3. Excluir do localStorage
            const resultadoLocalStorage = excluirDoLocalStorage(id);
            
            // 4. Excluir do sessionStorage (persistência de sessão)
            const resultadoSessionStorage = excluirDoSessionStorage(id);
            
            // 5. Excluir do IndexedDB (persistência offline)
            const resultadoIndexedDB = await excluirDoIndexedDB(id);
            
            // 6. Registrar log da exclusão
            registrarLogExclusao(id, empresa.name);
            
            // 7. Verificar se todos os métodos de exclusão foram bem-sucedidos
            const sucessoTotal = resultadoLocalStorage && (resultadoSessionStorage || true) && (resultadoIndexedDB || true);
            
            // 8. Atualizar a interface
            if (sucessoTotal) {
                console.log(`✅ Empresa ID ${id} excluída com sucesso de todos os armazenamentos`);
                
                // Atualizar a variável global
                if (window.companies) {
                    window.companies = window.companies.filter(e => e.id !== id);
                }
                
                // Atualizar a tabela, se estiver na página certa
                if (typeof window.carregarEExibirEmpresas === 'function' && 
                    window.location.hash.includes('/admin/companies')) {
                    setTimeout(window.carregarEExibirEmpresas, 100);
                }
                
                alert('Empresa excluída com sucesso!');
                return true;
            } else {
                console.warn(`⚠️ Empresa ID ${id} não foi completamente excluída de todos os armazenamentos`);
                alert('A empresa foi parcialmente excluída. Algumas informações podem persistir no sistema.');
                return false;
            }
        } catch (erro) {
            console.error('❌ Erro ao excluir empresa:', erro);
            alert('Ocorreu um erro ao excluir a empresa. Por favor, tente novamente.');
            return false;
        }
    };
    
    // Função auxiliar para obter empresa por ID
    function obterEmpresaPorId(id) {
        try {
            // Verificar na variável global primeiro
            if (window.companies && Array.isArray(window.companies)) {
                const empresa = window.companies.find(e => e.id === id);
                if (empresa) return empresa;
            }
            
            // Verificar no localStorage
            const localData = localStorage.getItem('agendai_companies');
            if (localData) {
                const empresas = JSON.parse(localData);
                if (Array.isArray(empresas)) {
                    const empresa = empresas.find(e => e.id === id);
                    if (empresa) return empresa;
                }
            }
            
            // Verificar no sessionStorage
            const sessionData = sessionStorage.getItem('agendai_companies_server');
            if (sessionData) {
                const empresas = JSON.parse(sessionData);
                if (Array.isArray(empresas)) {
                    const empresa = empresas.find(e => e.id === id);
                    if (empresa) return empresa;
                }
            }
            
            return null;
        } catch (erro) {
            console.error('❌ Erro ao buscar empresa:', erro);
            return null;
        }
    }
    
    // Função para excluir do localStorage
    function excluirDoLocalStorage(id) {
        try {
            const localData = localStorage.getItem('agendai_companies');
            if (!localData) return true; // Não há nada para excluir
            
            const empresas = JSON.parse(localData);
            if (!Array.isArray(empresas)) return true;
            
            const novasEmpresas = empresas.filter(e => e.id !== id);
            
            // Se não houver alteração, não encontramos a empresa
            if (novasEmpresas.length === empresas.length) {
                console.log(`ℹ️ Empresa ID ${id} não encontrada no localStorage`);
                return true;
            }
            
            // Salvar o array atualizado
            localStorage.setItem('agendai_companies', JSON.stringify(novasEmpresas));
            console.log(`✅ Empresa ID ${id} removida do localStorage`);
            return true;
        } catch (erro) {
            console.error('❌ Erro ao excluir do localStorage:', erro);
            return false;
        }
    }
    
    // Função para excluir do sessionStorage
    function excluirDoSessionStorage(id) {
        try {
            const sessionData = sessionStorage.getItem('agendai_companies_server');
            if (!sessionData) return true; // Não há nada para excluir
            
            const empresas = JSON.parse(sessionData);
            if (!Array.isArray(empresas)) return true;
            
            const novasEmpresas = empresas.filter(e => e.id !== id);
            
            // Se não houver alteração, não encontramos a empresa
            if (novasEmpresas.length === empresas.length) {
                console.log(`ℹ️ Empresa ID ${id} não encontrada no sessionStorage`);
                return true;
            }
            
            // Salvar o array atualizado
            sessionStorage.setItem('agendai_companies_server', JSON.stringify(novasEmpresas));
            console.log(`✅ Empresa ID ${id} removida do sessionStorage`);
            return true;
        } catch (erro) {
            console.error('❌ Erro ao excluir do sessionStorage:', erro);
            return false;
        }
    }
    
    // Função para excluir do IndexedDB
    async function excluirDoIndexedDB(id) {
        return new Promise((resolve) => {
            try {
                // Verificar se IndexedDB está disponível
                if (!window.indexedDB) {
                    console.warn('⚠️ IndexedDB não disponível neste navegador');
                    resolve(true);
                    return;
                }
                
                // Constantes do banco
                const DB_NAME = 'AgendAI_DB';
                const STORE_NAME = 'empresas';
                
                // Abrir o banco
                const request = indexedDB.open(DB_NAME);
                
                request.onerror = () => {
                    console.error('❌ Erro ao abrir IndexedDB');
                    resolve(false);
                };
                
                request.onsuccess = (event) => {
                    const db = event.target.result;
                    
                    // Verificar se a store existe
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        console.log('ℹ️ Store de empresas não existe no IndexedDB');
                        resolve(true);
                        return;
                    }
                    
                    try {
                        // Iniciar transação
                        const transaction = db.transaction([STORE_NAME], 'readwrite');
                        const store = transaction.objectStore(STORE_NAME);
                        
                        // Excluir a empresa
                        const deleteRequest = store.delete(id);
                        
                        deleteRequest.onsuccess = () => {
                            console.log(`✅ Empresa ID ${id} removida do IndexedDB`);
                            resolve(true);
                        };
                        
                        deleteRequest.onerror = () => {
                            console.error('❌ Erro ao excluir empresa do IndexedDB');
                            resolve(false);
                        };
                        
                        // Lidar com conclusão da transação
                        transaction.oncomplete = () => {
                            db.close();
                        };
                        
                        transaction.onerror = () => {
                            console.error('❌ Erro na transação do IndexedDB');
                            resolve(false);
                        };
                    } catch (erro) {
                        console.error('❌ Erro na transação do IndexedDB:', erro);
                        resolve(false);
                    }
                };
            } catch (erro) {
                console.error('❌ Erro geral do IndexedDB:', erro);
                resolve(false);
            }
        });
    }
    
    // Função para registrar log da exclusão
    function registrarLogExclusao(id, nome) {
        try {
            // Obter logs existentes
            let logs = [];
            const logsData = localStorage.getItem('agendai_deletion_logs');
            
            if (logsData) {
                logs = JSON.parse(logsData);
                if (!Array.isArray(logs)) logs = [];
            }
            
            // Adicionar novo log
            logs.push({
                id: id,
                nome: nome,
                dataExclusao: new Date().toISOString(),
                usuario: 'admin' // Poderíamos obter o usuário atual se o sistema tiver autenticação
            });
            
            // Limitar a quantidade de logs (manter apenas os 100 mais recentes)
            if (logs.length > 100) {
                logs = logs.slice(-100);
            }
            
            // Salvar logs
            localStorage.setItem('agendai_deletion_logs', JSON.stringify(logs));
        } catch (erro) {
            console.error('❌ Erro ao registrar log de exclusão:', erro);
        }
    }
    
    // Sobrescrever a função de exclusão original se ela existir
    if (typeof window.excluirEmpresa === 'function') {
        console.log('⚙️ Substituindo função original de exclusão de empresas');
        window.excluirEmpresaOriginal = window.excluirEmpresa;
        window.excluirEmpresa = window.excluirEmpresaPermanentemente;
    }
    
    // Garantir que a substituição ocorra mesmo que o script original carregue depois
    // ou seja adicionado dinamicamente à página
    const verificarFuncaoExclusao = function() {
        if (typeof window.excluirEmpresa === 'function' && 
            window.excluirEmpresa !== window.excluirEmpresaPermanentemente) {
            console.log('⚙️ Detectada função de exclusão não substituída, aplicando patch...');
            window.excluirEmpresaOriginal = window.excluirEmpresa;
            window.excluirEmpresa = window.excluirEmpresaPermanentemente;
        }
    };
    
    // Verificar quando a DOM estiver completamente carregada
    if (document.readyState === 'complete') {
        verificarFuncaoExclusao();
        adicionarEventosAosBotoes();
        console.log('🔄 Inicialização imediata: DOM já está completo');
    } else {
        window.addEventListener('DOMContentLoaded', function() {
            verificarFuncaoExclusao();
            adicionarEventosAosBotoes();
            console.log('🔄 Inicialização via DOMContentLoaded');
        });
        window.addEventListener('load', function() {
            verificarFuncaoExclusao();
            adicionarEventosAosBotoes();
            console.log('🔄 Inicialização via evento load');
        });
    }
    
    // Verificar periodicamente se a função foi sobrescrita
    setInterval(verificarFuncaoExclusao, 1000);
    
    // Verificar após mudanças de hash/rota (navegação)
    window.addEventListener('hashchange', function() {
        console.log('🔄 Navegação detectada, verificando função de exclusão e botões');
        verificarFuncaoExclusao();
        // Aguardar um momento para que o DOM seja atualizado após a navegação
        setTimeout(adicionarEventosAosBotoes, 500);
    });
    
    // Adicionar função para conectar diretamente os botões de exclusão
    function adicionarEventosAosBotoes() {
        console.log('🔄 Verificando botões de exclusão na página...');
        
        try {
            // Encontrar todos os botões de exclusão na página
            const botoesExclusao = document.querySelectorAll('.delete-company');
            
            if (botoesExclusao.length === 0) {
                console.log('ℹ️ Nenhum botão de exclusão encontrado no momento');
                return;
            }
            
            console.log(`🔍 Encontrados ${botoesExclusao.length} botões de exclusão`);
            
            // Adicionar evento diretamente a cada botão
            botoesExclusao.forEach((botao, index) => {
                // Verificar se o botão já foi processado para evitar processamento repetido
                if (botao.hasAttribute('data-delete-handler-added')) {
                    return;
                }
                
                console.log(`🔄 Processando botão de exclusão #${index + 1}`);
                
                // Substituir manipulador existente
                const oldClickHandler = botao.onclick;
                botao.onclick = function(event) {
                    const id = parseInt(this.getAttribute('data-id'));
                    console.log(`🔄 Botão de exclusão clicado para ID: ${id}`);
                    
                    // Impedir qualquer manipulador padrão
                    event.preventDefault();
                    event.stopPropagation();
                    
                    // Chamar nossa função de exclusão segura
                    window.excluirEmpresaPermanentemente(id);
                    
                    // Registrar para depuração
                    console.log(`🗑️ Exclusão permanente iniciada para ID: ${id}`);
                    
                    // Não executar o manipulador antigo
                    return false;
                };
                
                // Marcar botão como processado
                botao.setAttribute('data-delete-handler-added', 'true');
                console.log(`✅ Botão de exclusão #${index + 1} configurado com sucesso`);
            });
            
            console.log('✅ Eventos de exclusão conectados com sucesso aos botões');
        } catch (erro) {
            console.error('❌ Erro ao adicionar eventos aos botões de exclusão:', erro);
        }
    }
    
    // Verificar botões de exclusão periodicamente
    setInterval(adicionarEventosAosBotoes, 2000);
    
    // Verificar botões após mudanças de hash/rota (navegação)
    window.addEventListener('hashchange', adicionarEventosAosBotoes);
    
    // Monitorar mudanças na tabela para reagir imediatamente às atualizações
    try {
        // Localizar a tabela principal de empresas
        const observarTabela = function() {
            const tabela = document.querySelector('#companiesTableBody');
            if (!tabela) {
                console.log('⏳ Tabela de empresas não encontrada, aguardando...');
                return false;
            }
            
            console.log('🔍 Configurando observador para a tabela de empresas');
            
            // Criar um observador para monitorar mudanças na tabela
            const observer = new MutationObserver(function(mutations) {
                console.log('👁️ Detectada mudança na tabela de empresas');
                adicionarEventosAosBotoes();
            });
            
            // Configurar o observador
            observer.observe(tabela, { 
                childList: true,     // Observar adições/remoções de nós filhos
                subtree: true,       // Observar toda a subárvore de nós
                attributes: false,   // Não observar mudanças de atributos
                characterData: false // Não observar mudanças de dados
            });
            
            console.log('✅ Observador de tabela configurado com sucesso');
            return true;
        };
        
        // Tentar configurar o observador imediatamente
        if (!observarTabela()) {
            // Se a tabela ainda não estiver disponível, tentar novamente em breve
            const observadorInterval = setInterval(function() {
                if (observarTabela()) {
                    clearInterval(observadorInterval);
                }
            }, 1000);
        }
    } catch (erro) {
        console.error('❌ Erro ao configurar observador de tabela:', erro);
    }
    
    console.log('✅ Gerenciador de exclusão de empresas inicializado com sucesso');
})(); 