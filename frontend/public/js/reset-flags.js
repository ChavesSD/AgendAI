/**
 * Script para preservar empresas cadastradas no AgendAI
 * Este script garante que as empresas cadastradas não sejam excluídas automaticamente
 */

(function() {
    console.log('🔒 Iniciando proteção de empresas cadastradas...');
    
    // Remover todas as flags que causam exclusão automática
    localStorage.removeItem('agendai_companies_cleared');
    localStorage.removeItem('agendai_defaults_removed');
    localStorage.removeItem('clearDefaultsExecuted');
    localStorage.removeItem('removeDefaultCompaniesExecuted');
    
    // Verificar se existe a empresa cadastrada e salvá-la em variável de sessão para backup
    try {
        const empresasData = localStorage.getItem('agendai_companies');
        if (empresasData && empresasData !== '[]') {
            // Validar se é um array válido
            const empresas = JSON.parse(empresasData);
            if (Array.isArray(empresas) && empresas.length > 0) {
                // Fazer backup das empresas na sessionStorage
                sessionStorage.setItem('agendai_companies_backup', empresasData);
                console.log(`✅ Backup de ${empresas.length} empresas realizado com sucesso`);
            }
        }
    } catch (e) {
        console.error('❌ Erro ao fazer backup das empresas:', e);
    }
    
    // Função para restaurar empresas se necessário
    // Esta função será executada a cada 2 segundos
    function verificarERestaurarEmpresas() {
        try {
            // Verificar se as empresas sumiram
            const empresasAtuais = localStorage.getItem('agendai_companies');
            if (!empresasAtuais || empresasAtuais === '[]') {
                // Verificar se temos backup
                const backupEmpresas = sessionStorage.getItem('agendai_companies_backup');
                if (backupEmpresas && backupEmpresas !== '[]') {
                    // Restaurar do backup
                    localStorage.setItem('agendai_companies', backupEmpresas);
                    // Atualizar a variável global
                    try {
                        window.companies = JSON.parse(backupEmpresas);
                    } catch (e) {
                        console.error('❌ Erro ao atualizar variável global:', e);
                    }
                    console.log('🔄 Empresas restauradas do backup!');
                }
            } else {
                // Empresas existem, atualizar o backup
                sessionStorage.setItem('agendai_companies_backup', empresasAtuais);
            }
        } catch (e) {
            console.error('❌ Erro ao verificar e restaurar empresas:', e);
        }
    }
    
    // Verificar e restaurar imediatamente
    verificarERestaurarEmpresas();
    
    // Configurar verificação a cada 2 segundos
    setInterval(verificarERestaurarEmpresas, 2000);
    
    console.log('✅ Proteção de empresas cadastradas ativada');
})(); 