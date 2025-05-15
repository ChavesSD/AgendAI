/**
 * Script para forçar a recuperação de dados após o carregamento da página
 * Este script detecta se a página foi recarregada e força a restauração dos dados
 */

(function() {
    console.log('🔄 Iniciando sistema de recuperação forçada de dados...');
    
    // Função para verificar se a página foi recarregada
    function verificarRecarregamento() {
        // Usar performance navigation type para verificar se foi um recarregamento
        if (window.performance && 
            window.performance.navigation && 
            window.performance.navigation.type === 1) {
            return true;
        }
        
        // Verificar via sessionStorage
        if (sessionStorage.getItem('agendai_page_visited')) {
            return true;
        }
        
        // Marcar como visitada
        sessionStorage.setItem('agendai_page_visited', 'true');
        return false;
    }
    
    // Função principal para restaurar dados
    async function restaurarDados() {
        try {
            // Verificar se estamos na página de empresas
            if (!window.location.hash.includes('/admin/companies')) {
                return; // Não estamos na página relevante
            }
            
            console.log('🔍 Verificando necessidade de restauração de dados...');
            
            // Verificar os dados no localStorage
            const localData = localStorage.getItem('agendai_companies');
            
            // Se não temos dados no localStorage mas temos no sessionStorage (servidor simulado)
            if (!localData || localData === '[]' || localData === 'null') {
                // Tentar recuperar do sessionStorage
                const serverData = sessionStorage.getItem('agendai_companies_server');
                
                if (serverData) {
                    try {
                        const empresas = JSON.parse(serverData);
                        if (Array.isArray(empresas) && empresas.length > 0) {
                            console.log(`🔄 Restaurando ${empresas.length} empresas do sessionStorage para localStorage...`);
                            
                            // Salvar no localStorage
                            localStorage.setItem('agendai_companies', serverData);
                            
                            // Atualizar variável global
                            window.companies = empresas;
                            
                            // Atualizar a tabela
                            if (typeof window.carregarEExibirEmpresas === 'function') {
                                console.log('🔄 Atualizando tabela após restauração...');
                                
                                // Esperar um pouco para garantir que outros scripts foram inicializados
                                setTimeout(() => {
                                    window.carregarEExibirEmpresas();
                                }, 500);
                            }
                            
                            console.log('✅ Dados restaurados com sucesso!');
                        }
                    } catch (e) {
                        console.error('❌ Erro ao processar dados do sessionStorage:', e);
                    }
                }
            } else {
                // Temos dados no localStorage, garantir que estão também no sessionStorage
                try {
                    const empresas = JSON.parse(localData);
                    if (Array.isArray(empresas) && empresas.length > 0) {
                        sessionStorage.setItem('agendai_companies_server', localData);
                        console.log('✅ Dados existentes no localStorage sincronizados com sessionStorage');
                    }
                } catch (e) {
                    console.error('❌ Erro ao processar dados do localStorage:', e);
                }
            }
        } catch (erro) {
            console.error('❌ Erro ao restaurar dados:', erro);
        }
    }
    
    // Função para realizar monitoramento contínuo
    function monitorarLimpezaLocalStorage() {
        // Armazenar o valor atual
        let valorAnterior = localStorage.getItem('agendai_companies');
        
        // Verificar a cada segundo
        setInterval(() => {
            const valorAtual = localStorage.getItem('agendai_companies');
            
            // Se o valor foi para null ou vazio, mas antes tinha dados
            if ((!valorAtual || valorAtual === '[]' || valorAtual === 'null') && 
                valorAnterior && valorAnterior !== '[]' && valorAnterior !== 'null') {
                console.log('⚠️ Detectada limpeza do localStorage! Tentando restaurar dados...');
                
                // Restaurar do sessionStorage (servidor simulado)
                const serverData = sessionStorage.getItem('agendai_companies_server');
                if (serverData && serverData !== '[]' && serverData !== 'null') {
                    localStorage.setItem('agendai_companies', serverData);
                    console.log('✅ Dados restaurados após limpeza do localStorage');
                    
                    // Atualizar a tabela se estivermos na página correta
                    if (typeof window.carregarEExibirEmpresas === 'function' && 
                        window.location.hash.includes('/admin/companies')) {
                        setTimeout(() => window.carregarEExibirEmpresas(), 100);
                    }
                }
            }
            
            // Atualizar o valor anterior
            valorAnterior = valorAtual;
        }, 1000);
    }
    
    // Executar a restauração após um pequeno delay
    setTimeout(async () => {
        const foiRecarregamento = verificarRecarregamento();
        if (foiRecarregamento) {
            console.log('⚠️ Página foi recarregada, forçando restauração de dados...');
        }
        
        await restaurarDados();
        monitorarLimpezaLocalStorage();
        
        console.log('✅ Sistema de recuperação forçada de dados inicializado');
    }, 1500);
})(); 