/**
 * Script para garantir que o botão "Nova Empresa" seja clicável
 * Este script adiciona um evento de clique diretamente ao elemento do botão
 */

(function() {
    console.log('🔍 Iniciando verificação do botão Nova Empresa...');
    
    // Função para garantir que o botão seja clicável
    function garantirBotaoClicavel() {
        try {
            // Verificar se estamos na página de empresas
            if (!window.location.hash.includes('/admin/companies')) {
                console.log('ℹ️ Não estamos na página de empresas. Verificação ignorada.');
                return;
            }
            
            console.log('🔍 Procurando botão Nova Empresa...');
            
            // Encontrar o botão pelo ID
            const btnNovaEmpresa = document.getElementById('newCompanyBtn');
            
            if (!btnNovaEmpresa) {
                console.warn('⚠️ Botão Nova Empresa não encontrado!');
                return;
            }
            
            console.log('✅ Botão Nova Empresa encontrado. Verificando se é clicável...');
            
            // Adicionar evento de clique diretamente ao elemento HTML
            btnNovaEmpresa.onclick = function(e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                
                console.log('🖱️ Botão Nova Empresa clicado via onclick direto!');
                
                // Tentar abrir o modal usando a função disponível
                if (typeof window.openAddCompanyModalManually === 'function') {
                    window.openAddCompanyModalManually();
                } else if (typeof window.openAddCompanyModal === 'function') {
                    window.openAddCompanyModal();
                } else {
                    console.error('❌ Nenhuma função para abrir o modal encontrada!');
                    
                    // Tentar abrir o modal diretamente
                    const modal = document.getElementById('addCompanyModal');
                    if (modal) {
                        // Método direto
                        modal.style.display = 'block';
                        modal.classList.add('show');
                        document.body.classList.add('modal-open');
                        
                        // Adicionar backdrop
                        if (!document.querySelector('.modal-backdrop')) {
                            const backdrop = document.createElement('div');
                            backdrop.className = 'modal-backdrop fade show';
                            document.body.appendChild(backdrop);
                        }
                        
                        console.log('✅ Modal aberto diretamente');
                    } else {
                        console.error('❌ Modal não encontrado!');
                        alert('Erro ao abrir o formulário de nova empresa. O modal não foi encontrado.');
                    }
                }
                
                return false;
            };
            
            console.log('✅ Evento onclick adicionado diretamente ao botão Nova Empresa');
            
            // Adicionar também via addEventListener para garantir
            btnNovaEmpresa.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🖱️ Botão Nova Empresa clicado via addEventListener!');
                
                // Chamar a função onclick
                btnNovaEmpresa.onclick();
            });
            
            console.log('✅ Evento addEventListener adicionado ao botão Nova Empresa');
            
            // Adicionar classe para indicar que o botão está pronto
            btnNovaEmpresa.classList.add('btn-clickable');
            
            console.log('✅ Botão Nova Empresa agora é clicável!');
        } catch (erro) {
            console.error('❌ Erro ao garantir que o botão seja clicável:', erro);
        }
    }
    
    // Executar após um pequeno delay
    setTimeout(garantirBotaoClicavel, 1000);
    
    // Executar novamente após um delay maior para garantir
    setTimeout(garantirBotaoClicavel, 2000);
    
    // Executar sempre que a URL mudar
    window.addEventListener('hashchange', function() {
        if (window.location.hash.includes('/admin/companies')) {
            setTimeout(garantirBotaoClicavel, 500);
        }
    });
    
    console.log('✅ Script para garantir botão clicável inicializado com sucesso');
})(); 