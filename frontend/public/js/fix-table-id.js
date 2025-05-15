/**
 * Script para corrigir o ID da tabela de empresas
 * Este script adiciona o ID "companiesTable" à tabela existente
 */

(function() {
    console.log('🔧 Iniciando correção do ID da tabela de empresas...');
    
    // Função para adicionar o ID à tabela
    function adicionarIdTabela() {
        try {
            // Procurar pela tabela na estrutura atual
            const tabela = document.querySelector('.table-responsive table');
            
            if (tabela) {
                // Verificar se já tem o ID
                if (!tabela.id) {
                    tabela.id = 'companiesTable';
                    console.log('✅ ID "companiesTable" adicionado à tabela com sucesso!');
                } else if (tabela.id !== 'companiesTable') {
                    console.log(`ID da tabela alterado de "${tabela.id}" para "companiesTable"`);
                    tabela.id = 'companiesTable';
                } else {
                    console.log('✅ Tabela já possui o ID "companiesTable"');
                }
                
                // Verificar se o tbody tem ID
                const tbody = tabela.querySelector('tbody');
                if (tbody && !tbody.id) {
                    tbody.id = 'companiesTableBody';
                    console.log('✅ ID "companiesTableBody" adicionado ao tbody da tabela');
                }
                
                return true;
            } else {
                console.warn('⚠️ Tabela não encontrada no DOM');
                return false;
            }
        } catch (erro) {
            console.error('❌ Erro ao adicionar ID à tabela:', erro);
            return false;
        }
    }
    
    // Executar imediatamente
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        adicionarIdTabela();
    } else {
        // Esperar o DOM carregar
        document.addEventListener('DOMContentLoaded', adicionarIdTabela);
    }
    
    // Executar novamente após um pequeno delay para garantir
    setTimeout(adicionarIdTabela, 500);
    
    // Executar sempre que a URL mudar (navegação SPA)
    window.addEventListener('hashchange', function() {
        // Verificar se estamos na página de empresas
        if (window.location.hash.includes('/admin/companies')) {
            console.log('🔄 Mudança de URL detectada para página de empresas. Verificando tabela...');
            setTimeout(adicionarIdTabela, 300);
        }
    });
    
    // Observar mudanças no DOM para detectar quando a tabela for adicionada
    try {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // Verificar se alguma tabela foi adicionada
                    let tabelaAdicionada = false;
                    
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node.nodeType === 1 && (
                            node.tagName === 'TABLE' || 
                            node.querySelector && node.querySelector('table')
                        )) {
                            tabelaAdicionada = true;
                            break;
                        }
                    }
                    
                    if (tabelaAdicionada) {
                        console.log('🔍 Nova tabela detectada no DOM. Verificando ID...');
                        adicionarIdTabela();
                    }
                }
            });
        });
        
        // Iniciar observação
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
        
        // Desconectar o observer após 30 segundos para não consumir recursos
        setTimeout(() => {
            observer.disconnect();
            console.log('🕒 Observer desconectado após 30 segundos');
        }, 30000);
        
    } catch (erro) {
        console.error('❌ Erro ao configurar MutationObserver:', erro);
    }
    
    console.log('✅ Script de correção do ID da tabela inicializado com sucesso');
})(); 