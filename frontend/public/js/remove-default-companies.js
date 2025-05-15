/**
 * Script para remover empresas padrão do sistema
 * Versão 1.0 - Corrigido para evitar erros de sintaxe
 */

(function() {
    console.log('🧹 Iniciando remoção de empresas padrão...');
    
    // Verificar se já foi executado
    if (window.removeDefaultCompaniesExecuted) {
        console.log('✅ Remoção de empresas padrão já foi executada');
        return;
    }
    window.removeDefaultCompaniesExecuted = true;
    
    try {
        // Marcar que as empresas foram removidas intencionalmente
        localStorage.setItem('agendai_companies_cleared', 'true');
        
        // Verificar se já existem empresas personalizadas
        const companiesData = localStorage.getItem('agendai_companies');
        if (!companiesData || companiesData === '[]') {
            // Se não existirem empresas ou for um array vazio, inicializar com array vazio
            localStorage.setItem('agendai_companies', JSON.stringify([]));
            console.log('✅ Lista de empresas inicializada com array vazio');
        } else {
            try {
                // Verificar se os dados são um array válido
                const companies = JSON.parse(companiesData);
                if (!Array.isArray(companies)) {
                    // Se não for um array, inicializar com array vazio
                    localStorage.setItem('agendai_companies', JSON.stringify([]));
                    console.log('⚠️ Dados de empresas inválidos, reinicializando com array vazio');
                } else {
                    console.log(`ℹ️ Mantendo ${companies.length} empresas existentes no localStorage`);
                }
            } catch (e) {
                // Se houver erro ao parsear JSON, inicializar com array vazio
                localStorage.setItem('agendai_companies', JSON.stringify([]));
                console.error('❌ Erro ao analisar dados de empresas:', e);
            }
        }
        
        // Atualizar variável global
        window.companies = JSON.parse(localStorage.getItem('agendai_companies')) || [];
        
        console.log('✅ Remoção de empresas padrão concluída');
    } catch (error) {
        console.error('❌ Erro ao remover empresas padrão:', error);
    }
})(); 