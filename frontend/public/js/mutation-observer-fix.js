/**
 * Script para corrigir erros relacionados ao MutationObserver
 */

(function() {
    console.log('🔧 Iniciando correção para erros de MutationObserver...');
    
    // Desconectar todos os MutationObservers existentes para evitar erros
    try {
        // Método 1: Armazenar e desconectar observers existentes
        if (window._observers && Array.isArray(window._observers)) {
            window._observers.forEach(observer => {
                try {
                    if (observer && typeof observer.disconnect === 'function') {
                        observer.disconnect();
                        console.log('✅ Observer existente desconectado com sucesso');
                    }
                } catch (e) {
                    console.error('❌ Erro ao desconectar observer:', e);
                }
            });
        }
        
        // Método 2: Substituir o construtor para capturar e gerenciar novos observers
        const OriginalMutationObserver = window.MutationObserver;
        
        window.MutationObserver = function(callback) {
            // Criar um observer seguro com tratamento de erros
            const safeCallback = function(mutations, observer) {
                try {
                    // Filtrar mutações para evitar loops infinitos
                    const filteredMutations = mutations.filter(mutation => {
                        // Verificar nodes adicionados
                        if (mutation.addedNodes.length > 0) {
                            // Verificar se são elementos críticos
                            for (let i = 0; i < mutation.addedNodes.length; i++) {
                                const node = mutation.addedNodes[i];
                                // Ignorar elementos script e elementos criados pelo nosso código
                                if (node.nodeName === 'SCRIPT' || 
                                    (node.className && 
                                     typeof node.className === 'string' && 
                                     node.className.includes('agendai-injected'))) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    });
                    
                    // Se não houver mudanças relevantes, não chame o callback
                    if (filteredMutations.length === 0) {
                        return;
                    }
                    
                    // Chamar o callback original com as mudanças filtradas
                    callback(filteredMutations, observer);
                } catch (error) {
                    console.error('❌ Erro no callback do MutationObserver:', error);
                    
                    // Tentar desconectar para evitar mais erros
                    try {
                        if (observer && typeof observer.disconnect === 'function') {
                            observer.disconnect();
                            console.log('✅ Observer desconectado após erro');
                        }
                    } catch (e) {
                        console.error('❌ Erro ao desconectar observer após erro:', e);
                    }
                }
            };
            
            // Criar observer com o wrapper
            const observer = new OriginalMutationObserver(safeCallback);
            
            // Armazenar para potencial limpeza futura
            if (!window._observers) window._observers = [];
            window._observers.push(observer);
            
            return observer;
        };
        
        // Copiar as propriedades do protótipo original
        window.MutationObserver.prototype = OriginalMutationObserver.prototype;
        
        console.log('✅ MutationObserver substituído com versão mais segura');
    } catch (error) {
        console.error('❌ Erro ao aplicar correção para MutationObserver:', error);
    }
    
    // Função auxiliar para criar um observer mais seguro
    window.createSafeMutationObserver = function(callbackFn, targetElement, options) {
        try {
            // Garantir opções padrão
            const defaultOptions = { 
                childList: true, 
                subtree: true, 
                attributes: false, 
                characterData: false 
            };
            
            const mergedOptions = Object.assign({}, defaultOptions, options || {});
            
            // Criar um wrapper para o callback
            const safeCallback = function(mutations, observer) {
                try {
                    callbackFn(mutations, observer);
                } catch (error) {
                    console.error('❌ Erro no callback do observer seguro:', error);
                    
                    // Desconectar apenas se o erro for grave
                    if (error.message && (
                        error.message.includes('idLowerCase') ||
                        error.message.includes('forEach') ||
                        error.message.includes('is not a function')
                    )) {
                        try {
                            observer.disconnect();
                            console.log('✅ Observer desconectado após erro grave');
                        } catch (e) {
                            console.error('❌ Erro ao desconectar observer após erro grave:', e);
                        }
                    }
                }
            };
            
            // Criar o observer
            const observer = new MutationObserver(safeCallback);
            
            // Iniciar observação
            observer.observe(targetElement || document.body, mergedOptions);
            
            console.log('✅ Observer seguro criado e iniciado');
            return observer;
        } catch (error) {
            console.error('❌ Erro ao criar observer seguro:', error);
            return null;
        }
    };
    
    console.log('✅ Script de correção para MutationObserver inicializado com sucesso');
})(); 