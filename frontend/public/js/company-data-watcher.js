/**
 * Script para monitorar alterações nos dados de empresas e atualizar a tabela automaticamente
 */

(function() {
    console.log('👀 Iniciando monitoramento de dados de empresas...');
    
    // Variável para armazenar o último valor conhecido do localStorage
    let ultimoValorConhecido = localStorage.getItem('agendai_companies');
    
    // Função para verificar se houve alteração nos dados
    function verificarAlteracoes() {
        try {
            // Verificar se estamos na página de empresas
            if (!window.location.hash.includes('/admin/companies')) {
                return; // Não estamos na página relevante
            }
            
            // Obter valor atual
            const valorAtual = localStorage.getItem('agendai_companies');
            
            // Se o valor mudou, atualizar a tabela
            if (valorAtual !== ultimoValorConhecido) {
                console.log('🔄 Detectada alteração nos dados de empresas!');
                ultimoValorConhecido = valorAtual;
                
                // Atualizar a variável global window.companies
                try {
                    window.companies = JSON.parse(valorAtual) || [];
                } catch (e) {
                    console.error('❌ Erro ao analisar JSON de empresas:', e);
                    window.companies = [];
                }
                
                // Chamar função para atualizar a tabela
                if (typeof window.carregarEExibirEmpresas === 'function') {
                    console.log('🔄 Atualizando tabela de empresas...');
                    window.carregarEExibirEmpresas();
                } else {
                    console.error('❌ Função carregarEExibirEmpresas não encontrada!');
                    
                    // Tentar atualizar manualmente
                    const tbody = document.querySelector('#companiesTableBody');
                    if (tbody) {
                        console.log('🔄 Tentando atualizar tabela manualmente...');
                        // Simplificado: apenas forçar recarregamento da página
                        location.reload();
                    }
                }
            }
        } catch (erro) {
            console.error('❌ Erro ao verificar alterações:', erro);
        }
    }
    
    // Criar uma versão simplificada de localStorage.setItem para detectar alterações
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        // Chamar a implementação original
        originalSetItem.apply(this, arguments);
        
        // Se a chave for a de empresas, verificar alterações
        if (key === 'agendai_companies') {
            ultimoValorConhecido = value;
            
            // Verificar se estamos na página de empresas
            if (window.location.hash.includes('/admin/companies')) {
                console.log('🔄 Dados de empresas atualizados, atualizando tabela...');
                
                // Atualizar a tabela com um pequeno delay
                setTimeout(function() {
                    if (typeof window.carregarEExibirEmpresas === 'function') {
                        window.carregarEExibirEmpresas();
                    }
                }, 100);
            }
        }
    };
    
    // Verificar alterações periodicamente (a cada 2 segundos)
    setInterval(verificarAlteracoes, 2000);
    
    // Verificar também ao carregar a página
    setTimeout(verificarAlteracoes, 500);
    
    // Verificar também ao mudar de hash (navegação SPA)
    window.addEventListener('hashchange', function() {
        if (window.location.hash.includes('/admin/companies')) {
            setTimeout(verificarAlteracoes, 300);
        }
    });
    
    console.log('✅ Monitoramento de dados de empresas inicializado com sucesso!');
})(); 