/**
 * Script de proteção extra para empresas cadastradas
 * Intercepta qualquer tentativa de limpar empresas do localStorage
 */

(function() {
    console.log('🛡️ Ativando proteção extra para empresas cadastradas...');
    
    // Backup do método original de setItem do localStorage
    const originalSetItem = localStorage.setItem;
    
    // Sobrescrever o método setItem para interceptar limpezas não autorizadas
    localStorage.setItem = function(key, value) {
        // Se for a chave de empresas e estiver tentando definir como array vazio
        if (key === 'agendai_companies' && (value === '[]' || value === '{}')) {
            // Verificar se veio de um clique no botão excluir (que define uma flag temporária)
            if (!sessionStorage.getItem('delete_company_action')) {
                console.warn('🚫 Tentativa bloqueada de remover todas as empresas detectada!');
                
                // Verificar se temos backup
                const backup = sessionStorage.getItem('agendai_companies_backup');
                if (backup && backup !== '[]' && backup !== '{}') {
                    console.log('🔄 Usando backup armazenado em vez de limpar empresas');
                    // Chamar o método original com o backup
                    originalSetItem.call(localStorage, key, backup);
                    return;
                }
            } else {
                // Remover a flag temporária após uso
                sessionStorage.removeItem('delete_company_action');
            }
        }
        
        // Qualquer tentativa de definir flags de exclusão é bloqueada
        if (key === 'agendai_companies_cleared' || key === 'agendai_defaults_removed') {
            console.warn(`🚫 Tentativa bloqueada de definir flag ${key}`);
            return;
        }
        
        // Chamar o método original para outros casos
        originalSetItem.call(localStorage, key, value);
    };
    
    // Interceptar cliques no botão de exclusão de empresas
    document.addEventListener('click', function(e) {
        // Identificar botões de exclusão pelo seletor comum
        if (e.target.closest('.btn-delete, .btn-excluir, [data-action="delete"]')) {
            console.log('🗑️ Botão de exclusão clicado - permitindo ação temporariamente');
            // Definir flag temporária para permitir a exclusão
            sessionStorage.setItem('delete_company_action', 'true');
            // A flag será removida após o uso no localStorage.setItem sobrescrito
        }
    });
    
    // Verificar constantemente e restaurar empresas se necessário
    setInterval(function() {
        try {
            const empresasAtuais = localStorage.getItem('agendai_companies');
            const backup = sessionStorage.getItem('agendai_companies_backup');
            
            // Se não houver empresas mas existir backup, restaurar
            if ((!empresasAtuais || empresasAtuais === '[]' || empresasAtuais === '{}') && 
                backup && backup !== '[]' && backup !== '{}') {
                console.log('🔄 Restaurando empresas automaticamente...');
                localStorage.setItem('agendai_companies', backup);
                
                // Atualizar a variável global
                try {
                    window.companies = JSON.parse(backup);
                } catch (e) {
                    console.error('❌ Erro ao atualizar variável global:', e);
                }
            }
            
            // Se houver empresas, atualizar o backup
            if (empresasAtuais && empresasAtuais !== '[]' && empresasAtuais !== '{}') {
                sessionStorage.setItem('agendai_companies_backup', empresasAtuais);
            }
        } catch (e) {
            console.error('❌ Erro na verificação de proteção:', e);
        }
    }, 1000);
    
    console.log('✅ Proteção extra para empresas cadastradas ativada com sucesso');
})(); 