/**
 * Script para gerenciar as rotas relacionadas aos planos
 * Este script garante que a página de planos seja carregada corretamente
 */

(function() {
    console.log('🚀 Inicializando gerenciador de rotas de planos...');
    
    // Verificar se estamos na rota de planos
    function verificarRotaPlanos() {
        const hash = window.location.hash;
        
        if (hash === '#/admin/plans') {
            console.log('✅ Rota de planos detectada. Carregando página...');
            carregarPaginaPlanos();
        }
    }
    
    // Função para carregar a página de planos
    function carregarPaginaPlanos() {
        console.log('🔄 Iniciando carregamento da página de planos...');
        
        // Se o objeto App estiver disponível, usar o método de carregamento de views do App
        if (window.App && typeof window.App.loadView === 'function') {
            console.log('✅ Usando App.loadView para carregar a página de planos');
            
            // Usar o método loadView do objeto App
            window.App.loadView('admin-plans', function() {
                console.log('✅ Callback de carregamento da página de planos executado');
                
                // Garantir que a opção de planos esteja ativa no menu
                document.querySelectorAll('.list-group-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                const plansMenuItem = document.querySelector('a[href="#/admin/plans"]');
                if (plansMenuItem) {
                    plansMenuItem.classList.add('active');
                    console.log('✅ Item de menu de planos marcado como ativo');
                }
            });
            
            return;
        }
        
        // Fallback: Se o objeto App não estiver disponível, usar o carregamento AJAX manual
        console.log('⚠️ Objeto App não encontrado, usando carregamento AJAX manual...');
        
        // Verificar se já estamos na página de planos
        if (document.querySelector('.plans-content')) {
            console.log('ℹ️ Página de planos já carregada');
            return;
        }
        
        console.log('🔄 Carregando página de planos via AJAX...');
        
        // Carregar a página via AJAX
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/views/admin/admin-plans.html', true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('✅ Conteúdo recebido com sucesso. Tamanho:', xhr.responseText.length);
                
                // Extrair apenas o conteúdo principal
                const parser = new DOMParser();
                const doc = parser.parseFromString(xhr.responseText, 'text/html');
                
                // Atualizar o título da página
                document.title = 'AgendAI - Planos';
                
                // Substituir o conteúdo da página
                const appContent = document.getElementById('app-content');
                if (appContent) {
                    console.log('✅ Container app-content encontrado, atualizando conteúdo...');
                    appContent.innerHTML = xhr.responseText;
                    console.log('✅ Conteúdo da página de planos atualizado');
                } else {
                    // Se não encontrar o app-content, tentar outros containers
                    console.log('⚠️ Container app-content não encontrado, tentando alternativas...');
                    
                    const pageContentWrapper = document.getElementById('page-content-wrapper');
                    if (pageContentWrapper) {
                        console.log('✅ Container page-content-wrapper encontrado, atualizando conteúdo...');
                        
                        // Extrair apenas o conteúdo dentro do page-content-wrapper
                        const newPageContent = doc.querySelector('#page-content-wrapper');
                        if (newPageContent) {
                            pageContentWrapper.innerHTML = newPageContent.innerHTML;
                            console.log('✅ Conteúdo da página de planos atualizado');
                        } else {
                            console.log('⚠️ Conteúdo page-content-wrapper não encontrado no HTML carregado, usando todo o conteúdo');
                            pageContentWrapper.innerHTML = xhr.responseText;
                        }
                    } else {
                        console.log('⚠️ Nenhum container específico encontrado, substituindo body...');
                        document.body.innerHTML = xhr.responseText;
                    }
                }
                
                // Atualizar a classe ativa no menu lateral
                document.querySelectorAll('.list-group-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                const plansMenuItem = document.querySelector('a[href="#/admin/plans"]');
                if (plansMenuItem) {
                    plansMenuItem.classList.add('active');
                    console.log('✅ Item de menu de planos marcado como ativo');
                } else {
                    console.warn('⚠️ Item de menu de planos não encontrado');
                }
                
                console.log('✅ Página de planos carregada com sucesso!');
                
                // Executar scripts embutidos na página
                const scripts = doc.querySelectorAll('script');
                if (scripts.length > 0) {
                    console.log(`Encontrados ${scripts.length} scripts na página de planos`);
                    scripts.forEach((script, index) => {
                        if (script.textContent && script.textContent.trim() !== '') {
                            console.log(`Executando script #${index + 1}...`);
                            try {
                                eval(script.textContent);
                            } catch (e) {
                                console.error(`Erro ao executar script #${index + 1}:`, e);
                            }
                        }
                    });
                }
                
                // Verificar se o Bootstrap está disponível
                if (typeof bootstrap !== 'undefined') {
                    console.log('✅ Bootstrap disponível, inicializando componentes...');
                    
                    // Inicializar tooltips
                    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                    tooltipTriggerList.map(function (tooltipTriggerEl) {
                        return new bootstrap.Tooltip(tooltipTriggerEl);
                    });
                    
                    // Inicializar popovers
                    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
                    popoverTriggerList.map(function (popoverTriggerEl) {
                        return new bootstrap.Popover(popoverTriggerEl);
                    });
                } else {
                    console.warn('⚠️ Bootstrap não disponível');
                }
            } else {
                console.error('❌ Erro ao carregar página de planos:', xhr.status);
                alert('Erro ao carregar a página de planos. Por favor, tente novamente.');
            }
        };
        
        xhr.onerror = function() {
            console.error('❌ Erro de rede ao carregar página de planos');
            alert('Erro de conexão ao carregar a página de planos. Verifique sua conexão e tente novamente.');
        };
        
        xhr.send();
    }
    
    // Executar verificação imediatamente
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('Documento já carregado, verificando rota de planos...');
        setTimeout(verificarRotaPlanos, 100);
    } else {
        console.log('Documento ainda carregando, aguardando evento DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', verificarRotaPlanos);
    }
    
    // Adicionar listener para mudanças na hash
    window.addEventListener('hashchange', function() {
        console.log('Hash alterada para:', window.location.hash);
        verificarRotaPlanos();
    });
    
    console.log('✅ Gerenciador de rotas de planos inicializado com sucesso');
})(); 