/**
 * Script para corrigir o problema do botão "Nova Empresa" que não está abrindo o modal
 * Este script garante que o botão tenha o evento de clique correto
 */

(function() {
    console.log('🔧 Iniciando correção do botão Nova Empresa...');
    
    // Função para corrigir o botão
    function corrigirBotaoNovaEmpresa() {
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
            
            console.log('✅ Botão Nova Empresa encontrado. Removendo eventos existentes...');
            
            // Remover qualquer evento de clique existente
            const novoBtn = btnNovaEmpresa.cloneNode(true);
            if (btnNovaEmpresa.parentNode) {
                btnNovaEmpresa.parentNode.replaceChild(novoBtn, btnNovaEmpresa);
            }
            
            console.log('✅ Eventos existentes removidos. Adicionando novo evento de clique...');
            
            // Adicionar novo evento de clique
            novoBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🖱️ Botão Nova Empresa clicado! Tentando abrir modal...');
                
                // Tentar abrir o modal usando a função openAddCompanyModalManually
                if (typeof window.openAddCompanyModalManually === 'function') {
                    console.log('Chamando função openAddCompanyModalManually...');
                    window.openAddCompanyModalManually();
                } else {
                    console.error('❌ Função openAddCompanyModalManually não encontrada!');
                    
                    // Tentar abrir o modal diretamente
                    const modal = document.getElementById('addCompanyModal');
                    if (modal) {
                        console.log('Tentando abrir modal diretamente...');
                        
                        // Tentar usar Bootstrap
                        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                            try {
                                let bsModal = bootstrap.Modal.getInstance(modal);
                                if (!bsModal) {
                                    bsModal = new bootstrap.Modal(modal);
                                }
                                bsModal.show();
                                console.log('Modal aberto com Bootstrap');
                            } catch (erro) {
                                console.warn('Erro ao abrir modal com Bootstrap:', erro);
                                
                                // Método alternativo
                                modal.style.display = 'block';
                                modal.classList.add('show');
                                document.body.classList.add('modal-open');
                                
                                // Adicionar backdrop
                                if (!document.querySelector('.modal-backdrop')) {
                                    const backdrop = document.createElement('div');
                                    backdrop.className = 'modal-backdrop fade show';
                                    document.body.appendChild(backdrop);
                                }
                                
                                console.log('Modal aberto com método alternativo');
                            }
                        } else if (typeof jQuery !== 'undefined') {
                            // Tentar usar jQuery
                            try {
                                $(modal).modal('show');
                                console.log('Modal aberto com jQuery');
                            } catch (erro) {
                                console.warn('Erro ao abrir modal com jQuery:', erro);
                                
                                // Método alternativo
                                modal.style.display = 'block';
                                modal.classList.add('show');
                                document.body.classList.add('modal-open');
                                
                                // Adicionar backdrop
                                if (!document.querySelector('.modal-backdrop')) {
                                    const backdrop = document.createElement('div');
                                    backdrop.className = 'modal-backdrop fade show';
                                    document.body.appendChild(backdrop);
                                }
                                
                                console.log('Modal aberto com método alternativo');
                            }
                        } else {
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
                            
                            console.log('Modal aberto com método direto');
                        }
                    } else {
                        console.error('❌ Modal não encontrado!');
                        alert('Erro ao abrir o formulário de nova empresa. O modal não foi encontrado.');
                    }
                }
            });
            
            console.log('✅ Novo evento de clique adicionado com sucesso!');
        } catch (erro) {
            console.error('❌ Erro ao corrigir botão Nova Empresa:', erro);
        }
    }
    
    // Executar correção após um pequeno delay
    setTimeout(corrigirBotaoNovaEmpresa, 500);
    
    // Executar novamente após um delay maior para garantir
    setTimeout(corrigirBotaoNovaEmpresa, 1500);
    
    // Executar sempre que a URL mudar
    window.addEventListener('hashchange', function() {
        if (window.location.hash.includes('/admin/companies')) {
            setTimeout(corrigirBotaoNovaEmpresa, 300);
        }
    });
    
    console.log('✅ Script de correção do botão Nova Empresa inicializado com sucesso');
})(); 