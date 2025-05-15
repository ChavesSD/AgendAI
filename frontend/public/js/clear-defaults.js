/**
 * Script para limpar definitivamente planos e empresas padrão do AgendAI
 * Este script é executado automaticamente e remove permanentemente todos os dados padrão
 */

(function() {
    // Evitar execuções repetidas
    if (window.clearDefaultsExecuted) {
        return;
    }
    window.clearDefaultsExecuted = true;
    
    console.log('🧹 Iniciando limpeza definitiva de dados padrão...');
    
    // Função para limpar todos os planos padrão
    function limparPlanosDefinitivamente() {
        try {
            // Verificar se já foi limpo
            if (localStorage.getItem('agendai_plans_removed') === 'true') {
                console.log('✅ Planos já foram removidos anteriormente');
                return true;
            }
            
            // Marcar que todos os planos foram excluídos intencionalmente
            localStorage.setItem('agendai_plans_cleared', 'true');
            
            // Limpar a lista de planos
            localStorage.setItem('agendai_plans', JSON.stringify([]));
            
            // Marcar todos os IDs de planos padrão como excluídos
            const planosExcluidos = [1, 2, 3]; // IDs dos planos padrão
            localStorage.setItem('agendai_excluded_plans', JSON.stringify(planosExcluidos));
            
            // Limpar a variável global se existir
            if (typeof window.plans !== 'undefined') {
                window.plans = [];
            }
            
            // Marcar como removido para não executar novamente
            localStorage.setItem('agendai_plans_removed', 'true');
            
            console.log('✅ Planos padrão removidos definitivamente');
            return true;
        } catch (error) {
            console.error('❌ Erro ao limpar planos padrão:', error);
            return false;
        }
    }
    
    // Função para limpar todas as empresas padrão
    function limparEmpresasDefinitivamente() {
        try {
            // Verificar se já foi limpo
            if (localStorage.getItem('agendai_companies_cleared') === 'true') {
                console.log('✅ Empresas já foram removidas anteriormente');
                return true;
            }
            
            // Marcar que todas as empresas foram excluídas intencionalmente
            localStorage.setItem('agendai_companies_cleared', 'true');
            
            // Limpar a lista de empresas
            localStorage.setItem('agendai_companies', JSON.stringify([]));
            
            // Marcar todos os CNPJs de empresas padrão como excluídos (se existir esse mecanismo)
            const empresasExcluidas = ['00000000000000', '11111111111111', '22222222222222']; // CNPJs ou IDs das empresas padrão
            localStorage.setItem('agendai_excluded_companies', JSON.stringify(empresasExcluidas));
            
            // Limpar a variável global se existir
            if (typeof window.companies !== 'undefined') {
                window.companies = [];
            }
            
            console.log('✅ Empresas padrão removidas definitivamente');
            return true;
        } catch (error) {
            console.error('❌ Erro ao limpar empresas padrão:', error);
            return false;
        }
    }

    // Criar flag permanente para indicar que os dados padrão foram removidos
    function marcarDadosPadraoRemovidos() {
        try {
            localStorage.setItem('agendai_defaults_removed', 'true');
            console.log('✅ Flag de remoção de dados padrão configurada');
            return true;
        } catch (error) {
            console.error('❌ Erro ao configurar flag de remoção:', error);
            return false;
        }
    }
    
    // Função para executar a limpeza
    function executarLimpezaDefinitiva() {
        // Verificar se a limpeza já foi realizada anteriormente
        if (localStorage.getItem('agendai_defaults_removed') === 'true') {
            console.log('✅ Dados padrão já foram removidos anteriormente');
            return;
        }
        
        console.log('🔄 Executando limpeza definitiva de dados padrão...');
        
        // Executar a limpeza
        const planosLimpos = limparPlanosDefinitivamente();
        const empresasLimpas = limparEmpresasDefinitivamente();
        
        // Se ambas as limpezas foram bem-sucedidas, marcar como concluído
        if (planosLimpos && empresasLimpas) {
            marcarDadosPadraoRemovidos();
            console.log('✅ Limpeza definitiva de dados padrão concluída com sucesso');
        } else {
            console.warn('⚠️ Limpeza parcial: nem todos os dados puderam ser removidos');
        }
    }
    
    // Sobrescrever funções de restauração para evitar que dados padrão retornem
    function sobrescreverFuncoesRestauracao() {
        try {
            // Sobrescrever window.restaurarPlanosPadrao se existir
            if (typeof window.restaurarPlanosPadrao === 'function') {
                const originalRestaurarPlanos = window.restaurarPlanosPadrao;
                window.restaurarPlanosPadrao = function(...args) {
                    console.log('⚠️ Tentativa de restaurar planos padrão bloqueada - planos foram removidos definitivamente');
                    return false;
                };
                console.log('✅ Função restaurarPlanosPadrao sobrescrita para impedir restauração');
            }
            
            // Sobrescrever outras funções de restauração se necessário
            if (typeof window.restaurarEmpresasPadrao === 'function') {
                const originalRestaurarEmpresas = window.restaurarEmpresasPadrao;
                window.restaurarEmpresasPadrao = function(...args) {
                    console.log('⚠️ Tentativa de restaurar empresas padrão bloqueada - empresas foram removidas definitivamente');
                    return false;
                };
                console.log('✅ Função restaurarEmpresasPadrao sobrescrita para impedir restauração');
            }
            
            return true;
        } catch (error) {
            console.error('❌ Erro ao sobrescrever funções de restauração:', error);
            return false;
        }
    }
    
    // Executar a limpeza ao carregar o script
    executarLimpezaDefinitiva();
    
    // Sobrescrever funções de restauração
    sobrescreverFuncoesRestauracao();
    
    // Executar apenas uma vez, não em cada carregamento de página
    if (!window.cleanupUIExecuted) {
        window.cleanupUIExecuted = true;
        
        // Remover possíveis botões de restauração da interface
        window.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                try {
                    // Remover botões de restauração de planos
                    const btnRestaurarPlanos = document.getElementById('restaurarPlanosPadrao');
                    if (btnRestaurarPlanos) {
                        btnRestaurarPlanos.remove();
                        console.log('✅ Botão de restauração de planos removido da interface');
                    }
                    
                    // Remover botões de restauração de empresas
                    const btnRestaurarEmpresas = document.getElementById('restaurarEmpresasPadrao');
                    if (btnRestaurarEmpresas) {
                        btnRestaurarEmpresas.remove();
                        console.log('✅ Botão de restauração de empresas removido da interface');
                    }
                    
                    // Substituir mensagens de "nenhum plano" para não mostrar botão de restauração
                    const mensagensVazias = document.querySelectorAll('[colspan]');
                    mensagensVazias.forEach(msg => {
                        if (msg.textContent.includes('Restaurar planos padrão') || 
                            msg.textContent.includes('Restaurar empresas padrão')) {
                            msg.innerHTML = `
                                <div class="text-muted mb-3">
                                    <i class="fas fa-info-circle me-2"></i>
                                    Nenhum item cadastrado.
                                </div>
                            `;
                            console.log('✅ Mensagem de restauração substituída');
                        }
                    });
                    
                } catch (error) {
                    console.error('❌ Erro ao remover elementos de restauração da interface:', error);
                }
            }, 1000);
        });
    }
    
    // Verificar se a limpeza de planos já foi executada
    if (!localStorage.getItem('agendai_plans_removed')) {
        console.log('🧹 Limpando dados de planos do localStorage...');
        
        // Remover todas as entradas do localStorage relacionadas a planos
        localStorage.removeItem('agendai_plans');
        localStorage.removeItem('agendai_plans_v2');
        localStorage.removeItem('agendai_plans_cleared');
        localStorage.removeItem('agendai_excluded_plans');
        
        // Limpar também window.plans
        if (typeof window.plans !== 'undefined') {
            window.plans = undefined;
            console.log('🧹 Variável window.plans limpa');
        }
        
        // Marcar como limpo para não executar novamente
        localStorage.setItem('agendai_plans_removed', 'true');
        console.log('✅ Todos os dados de planos removidos com sucesso');
    }
    
    console.log('✅ Script de limpeza definitiva carregado com sucesso');
})(); 