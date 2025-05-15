/**
 * Script para remover o menu de planos de todas as páginas
 */

(function() {
    console.log('🔧 Removendo menu de planos...');
    let executionCount = 0;
    const MAX_EXECUTIONS = 5;
    
    // Função para remover o item de menu de planos
    function removePlansMenuItem() {
        // Incrementar contador de execuções
        executionCount++;
        
        // Limitar número de execuções para evitar ciclos infinitos
        if (executionCount > MAX_EXECUTIONS) {
            console.log('✅ Limite de verificações de menu de planos atingido');
            return;
        }
        
        // Buscar todos os links para a página de planos
        const plansLinks = document.querySelectorAll('a[href="#/admin/plans"]');
        
        // Se não encontrar nenhum link, não há nada a fazer
        if (plansLinks.length === 0) {
            return;
        }
        
        // Remover cada link encontrado
        plansLinks.forEach(link => {
            console.log('🗑️ Removendo item de menu de planos');
            const menuItem = link.closest('.list-group-item, .nav-item, li');
            if (menuItem) {
                menuItem.remove();
            } else {
                link.remove();
            }
        });
    }
    
    // Função para interceptar redirecionamentos para a página de planos
    function interceptPlansRedirects() {
        // Interceptar apenas uma vez
        if (window.plansRedirectsIntercepted) {
            return;
        }
        
        const originalPushState = history.pushState;
        
        // Substituir a função pushState para interceptar navegações
        history.pushState = function(state, title, url) {
            // Verificar se a URL contém a página de planos
            if (url && url.includes('/admin/plans')) {
                console.log('🚫 Interceptando redirecionamento para página de planos');
                // Redirecionar para o dashboard em vez da página de planos
                url = '#/admin/dashboard';
            }
            
            return originalPushState.call(this, state, title, url);
        };
        
        // Também interceptar quando a URL for alterada diretamente
        window.addEventListener('hashchange', function(event) {
            if (window.location.hash === '#/admin/plans') {
                console.log('🚫 Interceptando acesso direto à página de planos');
                // Redirecionar para o dashboard
                window.location.hash = '#/admin/dashboard';
            }
        });
        
        // Marcar que já interceptamos
        window.plansRedirectsIntercepted = true;
    }
    
    // Executar quando o DOM estiver pronto
    function onDOMReady() {
        removePlansMenuItem();
        
        // Configurar um MutationObserver mais conservador
        if (!window.plansMenuObserver) {
            const observer = new MutationObserver(function(mutations) {
                // Verificar se há mudanças relevantes antes de executar
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Verificar se os nós adicionados contêm links para planos
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === 1) { // Elemento
                                const hasPlansLinks = node.querySelector && node.querySelector('a[href="#/admin/plans"]');
                                if (hasPlansLinks) {
                                    removePlansMenuItem();
                                    break;
                                }
                            }
                        }
                    }
                }
            });
            
            // Observar apenas o container da navegação ou sidebar
            const targetNode = document.querySelector('.sidebar, nav, header') || document.body;
            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
            
            window.plansMenuObserver = observer;
        }
    }
    
    // Interceptar redirecionamentos
    interceptPlansRedirects();
    
    // Executar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onDOMReady);
    } else {
        onDOMReady();
    }
    
    // Executar apenas uma vez após um pequeno atraso, em vez de repetidamente
    setTimeout(removePlansMenuItem, 1000);
    
    console.log('✅ Script de remoção de planos inicializado');
})(); 