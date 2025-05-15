/**
 * Script para corrigir inicialização de modais do Bootstrap
 * Resolve o erro "Cannot read properties of undefined (reading 'backdrop')"
 */

(function() {
    console.log('🔧 Inicializando correção de modais do Bootstrap...');
    
    // Função para inicializar modais de forma segura
    function inicializarModais() {
        try {
            // Verificar se o Bootstrap está disponível
            if (typeof bootstrap === 'undefined') {
                console.warn('⚠️ Bootstrap não está disponível ainda. Tentando novamente em 500ms...');
                setTimeout(inicializarModais, 500);
                return;
            }
            
            console.log('✅ Bootstrap disponível. Inicializando modais...');
            
            // Selecionar todos os modais na página
            const modais = document.querySelectorAll('.modal');
            
            if (modais.length === 0) {
                console.log('ℹ️ Nenhum modal encontrado na página atual');
                return;
            }
            
            // Inicializar cada modal com configurações padrão
            modais.forEach((modal, index) => {
                try {
                    // Configurações padrão para resolver problemas comuns
                    const modalInstance = new bootstrap.Modal(modal, {
                        backdrop: true,
                        keyboard: true,
                        focus: true
                    });
                    
                    // Armazenar instância para uso posterior
                    modal._bsModal = modalInstance;
                    
                    console.log(`✅ Modal #${index + 1} (${modal.id || 'sem-id'}) inicializado com sucesso`);
                } catch (err) {
                    console.error(`❌ Erro ao inicializar modal #${index + 1}:`, err);
                }
            });
            
            // Adicionar correção para botões que abrem modais
            const botoesModal = document.querySelectorAll('[data-bs-toggle="modal"]');
            botoesModal.forEach((botao, index) => {
                const targetId = botao.getAttribute('data-bs-target');
                if (targetId) {
                    // Remover listener existente para evitar duplicação
                    botao.removeEventListener('click', handleModalClick);
                    // Adicionar novo listener
                    botao.addEventListener('click', handleModalClick);
                    console.log(`✅ Botão modal #${index + 1} corrigido (target: ${targetId})`);
                }
            });
            
            console.log('✅ Inicialização de modais concluída');
        } catch (err) {
            console.error('❌ Erro durante inicialização de modais:', err);
        }
    }
    
    // Handler para cliques em botões de modal
    function handleModalClick(e) {
        try {
            e.preventDefault();
            
            const targetId = this.getAttribute('data-bs-target');
            if (!targetId) return;
            
            const modal = document.querySelector(targetId);
            if (!modal) {
                console.warn(`⚠️ Modal ${targetId} não encontrado no DOM`);
                return;
            }
            
            // Verificar se o modal já tem uma instância do Bootstrap
            if (modal._bsModal) {
                modal._bsModal.show();
            } else {
                // Criar instância sob demanda se não existir
                try {
                    const modalInstance = new bootstrap.Modal(modal, {
                        backdrop: true,
                        keyboard: true,
                        focus: true
                    });
                    modal._bsModal = modalInstance;
                    modalInstance.show();
                } catch (modalErr) {
                    console.error('❌ Erro ao criar instância de modal:', modalErr);
                }
            }
        } catch (err) {
            console.error('❌ Erro ao abrir modal:', err);
        }
    }
    
    // Verificar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarModais);
    } else {
        // Se o DOM já estiver pronto, inicializar imediatamente
        inicializarModais();
    }
    
    // Inicializar novamente após o carregamento completo
    window.addEventListener('load', inicializarModais);
    
    // Inicializar após navegação em aplicações SPA
    document.addEventListener('spa:pagechange', inicializarModais);
    
    // Disponibilizar função globalmente para uso em outros scripts
    window.inicializarModaisBootstrap = inicializarModais;
    
    console.log('✅ Sistema de correção de modais inicializado com sucesso');
})(); 