/**
 * Script para sincronizar dados de empresas com o servidor
 * Versão 1.0 - Persistência de dados mesmo após recarregar a página
 */

(function() {
    console.log('🔄 Iniciando sincronização com servidor...');
    
    // Configuração da API
    const API_URL = '/api';
    const COMPANIES_ENDPOINT = '/companies';
    
    // Função para buscar empresas do servidor
    async function buscarEmpresasDoServidor() {
        try {
            console.log('🔍 Buscando empresas do servidor...');
            
            // Verificar se existe API mock configurada
            if (window.mockAPI) {
                console.log('ℹ️ Usando API mock para buscar empresas');
                return await window.mockAPI.getCompanies();
            }
            
            // Simular busca no servidor (como não temos backend real)
            return new Promise((resolve) => {
                // Verificar se existem dados no sessionStorage (persistente na sessão)
                const sessionData = sessionStorage.getItem('agendai_companies_server');
                if (sessionData) {
                    try {
                        const companies = JSON.parse(sessionData);
                        console.log(`✅ Recuperadas ${companies.length} empresas do sessionStorage`);
                        resolve(companies);
                    } catch (e) {
                        console.error('❌ Erro ao recuperar empresas do sessionStorage:', e);
                        resolve([]);
                    }
                } else {
                    console.log('ℹ️ Nenhuma empresa encontrada no servidor (sessionStorage)');
                    resolve([]);
                }
            });
        } catch (error) {
            console.error('❌ Erro ao buscar empresas do servidor:', error);
            return [];
        }
    }
    
    // Função para salvar empresas no servidor
    async function salvarEmpresasNoServidor(empresas) {
        try {
            console.log(`🔄 Salvando ${empresas.length} empresas no servidor...`);
            
            // Verificar se existe API mock configurada
            if (window.mockAPI) {
                console.log('ℹ️ Usando API mock para salvar empresas');
                return await window.mockAPI.saveCompanies(empresas);
            }
            
            // Simular salvamento no servidor (como não temos backend real)
            return new Promise((resolve) => {
                // Usar sessionStorage como "servidor" (persistente na sessão do navegador)
                sessionStorage.setItem('agendai_companies_server', JSON.stringify(empresas));
                console.log('✅ Empresas salvas com sucesso no sessionStorage');
                resolve(true);
            });
        } catch (error) {
            console.error('❌ Erro ao salvar empresas no servidor:', error);
            return false;
        }
    }
    
    // Função para reconciliar dados locais com o servidor
    async function reconciliarDados() {
        try {
            console.log('🔄 Reconciliando dados com o servidor...');
            
            // Buscar empresas do localStorage
            let empresasLocais = [];
            const localData = localStorage.getItem('agendai_companies');
            if (localData) {
                try {
                    empresasLocais = JSON.parse(localData);
                    if (!Array.isArray(empresasLocais)) {
                        empresasLocais = [];
                    }
                } catch (e) {
                    console.error('❌ Erro ao parsear empresas locais:', e);
                    empresasLocais = [];
                }
            }
            
            // Buscar empresas do servidor
            const empresasServidor = await buscarEmpresasDoServidor();
            
            // Se não temos dados locais mas temos no servidor, usar do servidor
            if (empresasLocais.length === 0 && empresasServidor.length > 0) {
                console.log('ℹ️ Usando dados do servidor, pois não há dados locais');
                localStorage.setItem('agendai_companies', JSON.stringify(empresasServidor));
                window.companies = empresasServidor;
                
                // Atualizar a interface, se estiver na página de empresas
                if (typeof window.carregarEExibirEmpresas === 'function' && 
                    window.location.hash.includes('/admin/companies')) {
                    window.carregarEExibirEmpresas();
                }
                
                return empresasServidor;
            }
            
            // Se temos dados locais mas não no servidor, enviar para o servidor
            if (empresasLocais.length > 0 && empresasServidor.length === 0) {
                console.log('ℹ️ Enviando dados locais para o servidor, pois não há dados no servidor');
                await salvarEmpresasNoServidor(empresasLocais);
                return empresasLocais;
            }
            
            // Se temos dados em ambos, fazer merge (preferência para dados locais mais recentes)
            if (empresasLocais.length > 0 && empresasServidor.length > 0) {
                console.log('ℹ️ Mesclando dados locais e do servidor...');
                
                // Mapa para controle por ID
                const empresasMerge = {};
                
                // Adicionar empresas do servidor
                empresasServidor.forEach(empresa => {
                    empresasMerge[empresa.id] = empresa;
                });
                
                // Sobrescrever/adicionar empresas locais (têm precedência)
                empresasLocais.forEach(empresa => {
                    empresasMerge[empresa.id] = empresa;
                });
                
                // Converter mapa para array
                const empresasMescladas = Object.values(empresasMerge);
                
                // Atualizar localStorage e servidor
                localStorage.setItem('agendai_companies', JSON.stringify(empresasMescladas));
                await salvarEmpresasNoServidor(empresasMescladas);
                
                // Atualizar variável global
                window.companies = empresasMescladas;
                
                // Atualizar a interface, se estiver na página de empresas
                if (typeof window.carregarEExibirEmpresas === 'function' && 
                    window.location.hash.includes('/admin/companies')) {
                    window.carregarEExibirEmpresas();
                }
                
                return empresasMescladas;
            }
            
            return empresasLocais;
        } catch (error) {
            console.error('❌ Erro ao reconciliar dados:', error);
            return [];
        }
    }
    
    // Sobrescrever a função salvarEmpresaDiretamente para sincronizar com o servidor
    const originalSalvarEmpresaDiretamente = window.salvarEmpresaDiretamente;
    window.salvarEmpresaDiretamente = async function(dadosEmpresa) {
        try {
            // Chamar a implementação original primeiro
            const resultado = originalSalvarEmpresaDiretamente 
                ? originalSalvarEmpresaDiretamente(dadosEmpresa) 
                : null;
            
            // Se a função original não existe ou falhou, implementar nossa própria lógica
            if (!resultado && !originalSalvarEmpresaDiretamente) {
                console.log('ℹ️ Usando implementação alternativa para salvar empresa');
                
                // Recuperar empresas do localStorage
                let empresas = [];
                const localData = localStorage.getItem('agendai_companies');
                if (localData) {
                    try {
                        empresas = JSON.parse(localData);
                        if (!Array.isArray(empresas)) {
                            empresas = [];
                        }
                    } catch (e) {
                        empresas = [];
                    }
                }
                
                // Encontrar índice da empresa (para atualização)
                const index = empresas.findIndex(e => e.id === dadosEmpresa.id);
                
                // Atualizar ou adicionar
                if (index >= 0) {
                    empresas[index] = dadosEmpresa;
                } else {
                    empresas.push(dadosEmpresa);
                }
                
                // Salvar no localStorage
                localStorage.setItem('agendai_companies', JSON.stringify(empresas));
                
                // Atualizar variável global
                window.companies = empresas;
            }
            
            // Sincronizar com o servidor
            console.log('🔄 Sincronizando alterações com o servidor...');
            const empresasAtuais = JSON.parse(localStorage.getItem('agendai_companies') || '[]');
            await salvarEmpresasNoServidor(empresasAtuais);
            
            return true;
        } catch (erro) {
            console.error('❌ Erro ao salvar e sincronizar empresa:', erro);
            return false;
        }
    };
    
    // Executar reconciliação de dados ao carregar a página
    async function inicializar() {
        try {
            await reconciliarDados();
            console.log('✅ Sincronização inicial concluída com sucesso');
        } catch (erro) {
            console.error('❌ Erro na sincronização inicial:', erro);
        }
    }
    
    // Iniciar reconciliação após pequeno delay para garantir que outros scripts foram carregados
    setTimeout(inicializar, 800);
    
    // Sincronizar também quando a página for recarregada
    window.addEventListener('beforeunload', async function() {
        try {
            // Recuperar dados atuais
            const empresasAtuais = JSON.parse(localStorage.getItem('agendai_companies') || '[]');
            
            // Salvar no sessionStorage para persistir durante recarregamentos
            await salvarEmpresasNoServidor(empresasAtuais);
        } catch (erro) {
            console.error('❌ Erro ao sincronizar antes de recarregar:', erro);
        }
    });
    
    // Sincronizar periodicamente (a cada 30 segundos)
    setInterval(async function() {
        try {
            // Recuperar dados atuais
            const empresasAtuais = JSON.parse(localStorage.getItem('agendai_companies') || '[]');
            
            // Salvar no servidor
            await salvarEmpresasNoServidor(empresasAtuais);
        } catch (erro) {
            console.error('❌ Erro na sincronização periódica:', erro);
        }
    }, 30000);
    
    console.log('✅ Sistema de sincronização com servidor inicializado');
})(); 