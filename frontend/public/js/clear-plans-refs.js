/**
 * Script para remover completamente todas as referências a planos no sistema
 */

(function() {
    console.log('🧹 Iniciando limpeza definitiva de planos...');
    
    // Verificar se já foi executado nesta sessão
    if (window.cleanPlansExecuted) {
        console.log('✅ Limpeza de planos já foi executada nesta sessão');
        return;
    }
    window.cleanPlansExecuted = true;
    
    // Lista de chaves relacionadas a planos para remover
    const plansKeys = [
        'agendai_plans',
        'agendai_plans_v2',
        'agendai_plans_cleared',
        'agendai_plans_removed',
        'agendai_excluded_plans'
    ];
    
    // Remover todas as chaves relacionadas a planos
    plansKeys.forEach(key => {
        try {
            if (localStorage.getItem(key) !== null) {
                localStorage.removeItem(key);
                console.log(`🗑️ ${key} removido do localStorage`);
            }
        } catch (e) {
            console.error(`❌ Erro ao remover ${key}:`, e);
        }
    });
    
    // Limpar a variável global de planos
    if (window.plans) {
        window.plans = null;
        delete window.plans;
        console.log('🗑️ Variável global window.plans removida');
    }
    
    // Verificar empresas e remover referências a planos
    try {
        const empresasJSON = localStorage.getItem('agendai_companies');
        if (empresasJSON) {
            let empresas = JSON.parse(empresasJSON);
            
            if (Array.isArray(empresas) && empresas.length > 0) {
                console.log(`📋 Limpando referências a planos em ${empresas.length} empresas...`);
                
                // Remover referências a planos em cada empresa
                empresas = empresas.map(empresa => {
                    // Remover campos relacionados a planos
                    if (empresa) {
                        delete empresa.plan;
                        delete empresa.planId;
                        delete empresa.planName;
                        delete empresa.plan_id;
                    }
                    return empresa;
                });
                
                // Salvar de volta no localStorage
                localStorage.setItem('agendai_companies', JSON.stringify(empresas));
                console.log('✅ Referências a planos removidas das empresas');
                
                // Atualizar variável global
                if (window.companies) {
                    window.companies = empresas;
                }
            }
        }
    } catch (e) {
        console.error('❌ Erro ao limpar referências a planos nas empresas:', e);
    }
    
    console.log('✅ Limpeza de planos concluída com sucesso');
})(); 