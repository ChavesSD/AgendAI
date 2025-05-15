/**
 * Script para adicionar dinamicamente o botão Nova Empresa na página de empresas
 * Este script funciona com o MutationObserver para garantir que o botão seja adicionado
 * mesmo se a página for carregada dinamicamente.
 * Versão 1.5 - Com debounce e limitação de reconexões
 */

(function() {
    console.log('🔍 Iniciando script para adicionar botão Nova Empresa (v1.5)...');
    
    // Verificar se jQuery está disponível
    const jQueryAvailable = (typeof jQuery !== 'undefined');
    if (jQueryAvailable) {
        console.log('✅ jQuery disponível, versão: ' + jQuery.fn.jquery);
    }
    
    // Variáveis para controle de debounce e reconexões
    let lastReconnectTime = 0;
    let reconnectCount = 0;
    let modalOpened = false;
    let buttonCreationInProgress = false;
    let modalLoadingInProgress = false;
    
    // Função de debounce para limitar a frequência de chamadas
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Carregar proativamente o script fix-company-modal.js para garantir que a função openAddCompanyModalManually esteja disponível
    function carregarScriptModal() {
        if (modalLoadingInProgress) {
            console.log('⏳ Carregamento do script modal já está em andamento');
            return Promise.resolve();
        }
        
        modalLoadingInProgress = true;
        
        if (typeof window.openAddCompanyModalManually === 'function') {
            console.log('✅ Função openAddCompanyModalManually já está disponível');
            modalLoadingInProgress = false;
            return Promise.resolve();
        }
        
        if (document.querySelector('script[src*="fix-company-modal.js"]')) {
            console.log('⏳ Script fix-company-modal.js já foi carregado, aguardando inicialização...');
            return new Promise((resolve) => {
                // Verificar periodicamente se a função está disponível
                const checkInterval = setInterval(() => {
                    if (typeof window.openAddCompanyModalManually === 'function') {
                        clearInterval(checkInterval);
                        console.log('✅ Função openAddCompanyModalManually agora está disponível');
                        modalLoadingInProgress = false;
                        resolve();
                    }
                }, 100);
                
                // Timeout após 5 segundos
                setTimeout(() => {
                    clearInterval(checkInterval);
                    console.warn('⚠️ Timeout esperando pela função openAddCompanyModalManually');
                    modalLoadingInProgress = false;
                    resolve();
                }, 5000);
            });
        }
        
        console.log('🔄 Carregando script fix-company-modal.js proativamente...');
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = '/public/src/js/fix-company-modal.js';
            script.onload = function() {
                console.log('✅ Script fix-company-modal.js carregado com sucesso');
                // Verificar periodicamente se a função está disponível após o carregamento
                const checkInterval = setInterval(() => {
                    if (typeof window.openAddCompanyModalManually === 'function') {
                        clearInterval(checkInterval);
                        console.log('✅ Função openAddCompanyModalManually está disponível após carregamento');
                        modalLoadingInProgress = false;
                        resolve();
                    }
                }, 100);
                
                // Timeout após 3 segundos
                setTimeout(() => {
                    clearInterval(checkInterval);
                    console.warn('⚠️ Timeout esperando pela função após carregamento');
                    modalLoadingInProgress = false;
                    resolve();
                }, 3000);
            };
            script.onerror = function() {
                console.error('❌ Erro ao carregar script fix-company-modal.js');
                modalLoadingInProgress = false;
                resolve();
            };
            document.body.appendChild(script);
        });
    }
    
    // Chamar imediatamente para garantir que o script esteja disponível
    carregarScriptModal();
    
    // Não evitar execução duplicada, para garantir que o botão sempre seja recriado quando necessário
    // Apenas registrar que foi executado para fins de debug
    if (window.createCompanyButtonExecuted) {
        console.log('ℹ️ Script de criação do botão sendo executado novamente');
    }
    window.createCompanyButtonExecuted = true;
    
    // Função para verificar se estamos na página de empresas
    function isPaginaEmpresas() {
        return window.location.hash.includes('/admin/companies') || 
               document.title.includes('Empresas') ||
               document.querySelector('h1')?.textContent.includes('Empresas') ||
               document.querySelector('h2')?.textContent.includes('Gestão de Empresas');
    }
    
    // Função para criar e adicionar o botão
    function criarBotaoNovaEmpresa() {
        // Evitar múltiplas chamadas simultâneas
        if (buttonCreationInProgress) {
            return;
        }
        
        buttonCreationInProgress = true;
        
        try {
            // Verificar se já existe
            const existingButton = document.getElementById('newCompanyBtn');
            if (existingButton) {
                // Limitar a frequência de reconexão de eventos
                const now = Date.now();
                if (now - lastReconnectTime < 5000) { // Limitar a uma reconexão a cada 5 segundos
                    buttonCreationInProgress = false;
                    return;
                }
                
                // Limitar o número total de reconexões
                reconnectCount++;
                if (reconnectCount > 3) {
                    console.log('🛑 Limite de reconexões atingido. O botão já deve estar funcional.');
                    buttonCreationInProgress = false;
                    return;
                }
                
                lastReconnectTime = now;
                console.log('🔄 Reconectando eventos ao botão Nova Empresa (reconexão #' + reconnectCount + ')');
                
                // Remover todos os event listeners anteriores e recriar o botão
                const newButton = existingButton.cloneNode(true);
                if (existingButton.parentNode) {
                    existingButton.parentNode.replaceChild(newButton, existingButton);
                }
                
                // Adicionar o evento de clique novamente
                if (jQueryAvailable) {
                    $(newButton).on('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        handleButtonClick();
                    });
                } else {
                    newButton.onclick = function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        handleButtonClick();
                    };
                }
                
                // Adicionar um atributo de data para indicar que o botão foi reconectado
                newButton.setAttribute('data-reconnected', reconnectCount.toString());
                
                console.log('✅ Eventos do botão Nova Empresa reconectados com sucesso!');
                buttonCreationInProgress = false;
                return;
            }
            
            console.log('🔧 Tentando criar botão Nova Empresa...');
            
            // Verificar se estamos na página correta
            if (!isPaginaEmpresas()) {
                console.log('ℹ️ Não estamos na página de empresas. Abortando criação do botão.');
                buttonCreationInProgress = false;
                return;
            }
            
            // Encontrar o local onde o botão deve ser adicionado (cabeçalho da página)
            let header;
            
            if (jQueryAvailable) {
                header = $('.card-header').get(0);
                if (!header) {
                    // Alternativa: procurar no título da página
                    header = $('h2:contains("Gestão de Empresas")').parent().get(0);
                }
            } else {
                header = document.querySelector('.card-header');
                if (!header) {
                    // Alternativa: procurar no título da página
                    const pageTitle = document.querySelector('h2');
                    if (pageTitle && pageTitle.textContent.includes('Gestão de Empresas')) {
                        header = pageTitle.parentElement;
                    }
                }
            }
            
            if (!header) {
                console.warn('⚠️ Cabeçalho da página não encontrado para adicionar o botão Nova Empresa');
                buttonCreationInProgress = false;
                return;
            }
            
            // Criar o botão
            const btnNovaEmpresa = document.createElement('button');
            btnNovaEmpresa.id = 'newCompanyBtn';
            btnNovaEmpresa.className = 'btn btn-primary float-end';
            btnNovaEmpresa.innerHTML = '<i class="fas fa-plus-circle me-1"></i> Nova Empresa';
            
            // Adicionar o botão no cabeçalho
            header.appendChild(btnNovaEmpresa);
            
            // Adicionar o evento de clique para abrir o modal
            if (jQueryAvailable) {
                $(btnNovaEmpresa).on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleButtonClick();
                });
            } else {
                btnNovaEmpresa.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleButtonClick();
                };
            }
            
            // Garantir que o botão esteja visível
            btnNovaEmpresa.style.display = 'inline-block';
            btnNovaEmpresa.style.visibility = 'visible';
            btnNovaEmpresa.style.opacity = '1';
            
            console.log('✅ Botão Nova Empresa criado com sucesso!');
            
            // Resetar o contador de reconexões quando um novo botão é criado
            reconnectCount = 0;
        } finally {
            buttonCreationInProgress = false;
        }
    }
    
    // Função para lidar com o clique no botão
    function handleButtonClick() {
        // Evitar cliques múltiplos
        if (modalOpened) {
            console.log('⚠️ Modal já está sendo aberto, ignorando clique');
            return;
        }
        
        modalOpened = true;
        console.log('🖱️ Botão Nova Empresa clicado! Tentando abrir modal...');
        
        setTimeout(() => {
            modalOpened = false;
        }, 1000); // Resetar flag após 1 segundo
        
        // Verificar se a função está disponível
        if (typeof window.openAddCompanyModalManually === 'function') {
            console.log('✅ Função openAddCompanyModalManually encontrada, executando...');
            try {
                window.openAddCompanyModalManually();
            } catch (error) {
                console.error('❌ Erro ao executar openAddCompanyModalManually:', error);
                alert('Erro ao abrir o formulário de nova empresa. Recarregue a página e tente novamente.');
            }
        } else {
            console.error('❌ Função openAddCompanyModalManually não encontrada');
            // Tentar carregar o script novamente e depois abrir o modal
            carregarScriptModal().then(() => {
                if (typeof window.openAddCompanyModalManually === 'function') {
                    try {
                        window.openAddCompanyModalManually();
                    } catch (error) {
                        console.error('❌ Erro ao executar openAddCompanyModalManually após carregamento:', error);
                        alert('Erro ao abrir o formulário de nova empresa. Recarregue a página e tente novamente.');
                    }
                } else {
                    alert('Erro ao abrir o formulário de nova empresa. Recarregue a página e tente novamente.');
                }
            });
        }
    }
    
    // Função para iniciar o processo de criação do botão
    function initButtonCreation() {
        // Verificar se já estamos na página de empresas
        if (isPaginaEmpresas()) {
            console.log('✅ Página de empresas detectada, criando botão imediatamente...');
            // Pequeno atraso para garantir que todos os elementos foram carregados
            setTimeout(criarBotaoNovaEmpresa, 300);
        }
        
        // Verificar periodicamente se o botão precisa ser recriado, mas com menor frequência
        setInterval(function() {
            if (isPaginaEmpresas()) {
                const botao = document.getElementById('newCompanyBtn');
                if (!botao) {
                    console.log('Botão Nova Empresa não encontrado, recriando...');
                    criarBotaoNovaEmpresa();
                }
            }
        }, 5000); // Verificar a cada 5 segundos em vez de 2
    }
    
    // Iniciar criação do botão após garantir que o script do modal esteja carregado
    carregarScriptModal().then(() => {
        initButtonCreation();
    });
    
    // Usar MutationObserver para detectar quando elementos são adicionados ao DOM
    try {
        // Função debounced para criar o botão
        const debouncedCriarBotao = debounce(criarBotaoNovaEmpresa, 500);
        
        const observer = new MutationObserver(function(mutations) {
            // Verificar se estamos na página de empresas antes de processar as mutações
            if (!isPaginaEmpresas()) {
                return;
            }
            
            let shouldCreateButton = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // Procurar elementos específicos que indicam que estamos na página de empresas
                    Array.from(mutation.addedNodes).forEach(node => {
                        if (node.nodeType === 1 && node.textContent && 
                            (node.textContent.includes('Gestão de Empresas') || 
                             node.textContent.includes('Empresas Cadastradas'))) {
                            shouldCreateButton = true;
                        }
                    });
                }
            });
            
            if (shouldCreateButton) {
                debouncedCriarBotao();
            }
        });
        
        // Iniciar observação com opções mais limitadas para reduzir o número de chamadas
        observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            characterData: false
        });
        
        // Verificar também quando a URL muda (navegação por hash)
        const hashChangeHandler = debounce(function() {
            if (isPaginaEmpresas()) {
                setTimeout(criarBotaoNovaEmpresa, 300);
            }
        }, 500);
        
        if (jQueryAvailable) {
            $(window).on('hashchange', hashChangeHandler);
        } else {
            window.addEventListener('hashchange', hashChangeHandler);
        }
        
        console.log('👁️ MutationObserver configurado para criar o botão automaticamente');
    } catch (error) {
        console.error('❌ Erro ao configurar MutationObserver:', error);
    }
    
    console.log('✅ Script de criação do botão Nova Empresa inicializado com sucesso');
})(); 