/**
 * Script para garantir que o campo de seleção de plano esteja presente no modal da empresa
 */

(function() {
    console.log('🔍 Verificando se o campo de plano está presente no modal...');
    
    // Função para injetar o campo de plano se não existir
    function adicionarCampoPlanoCasoNecessario() {
        try {
            // Obter o modal
            const modal = document.getElementById('addCompanyModal');
            if (!modal) {
                console.log('⚠️ Modal ainda não existe no DOM, aguardando...');
                return false;
            }
            
            // Verificar se o campo já existe
            const planSelect = modal.querySelector('#companyPlan');
            if (planSelect) {
                console.log('✅ Campo de plano já existe no modal');
                return true;
            }
            
            console.log('⚠️ Campo de plano não encontrado no modal, adicionando...');
            
            // Encontrar a div de categoria para injetar o campo de plano após ela
            const categoryDiv = modal.querySelector('.modal-body form .row:nth-child(3)');
            if (!categoryDiv) {
                console.error('❌ Não foi possível encontrar a div da categoria para adicionar o campo de plano');
                return false;
            }
            
            // Criar o HTML do campo de plano
            const planHTML = `
            <div class="row mb-3">
                <div class="col-md-12">
                    <label for="companyPlan" class="form-label">Plano*</label>
                    <select class="form-select" id="companyPlan" required>
                        <option value="">Selecione um plano...</option>
                        <option value="1">Plano Básico - R$ 50,00/mês (Até 50 agendamentos/mês, 3 profissionais)</option>
                        <option value="2">Plano Intermediário - R$ 70,00/mês (Até 150 agendamentos/mês, 7 profissionais)</option>
                        <option value="3">Plano Avançado - R$ 100,00/mês (Agendamentos e profissionais ilimitados)</option>
                    </select>
                </div>
            </div>`;
            
            // Inserir após a div da categoria
            categoryDiv.insertAdjacentHTML('afterend', planHTML);
            
            console.log('✅ Campo de plano adicionado com sucesso ao modal');
            return true;
        } catch (error) {
            console.error('❌ Erro ao adicionar campo de plano:', error);
            return false;
        }
    }
    
    // Executar logo após o carregamento da página
    setTimeout(adicionarCampoPlanoCasoNecessario, 500);
    
    // Executar também quando o modal for aberto
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'newCompanyBtn') {
            setTimeout(adicionarCampoPlanoCasoNecessario, 500);
        }
    });
    
    // Observer para monitorar a adição do modal ao DOM
    const bodyObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.id === 'addCompanyModal' || (node.querySelector && node.querySelector('#addCompanyModal'))) {
                        console.log('🔍 Modal detectado! Verificando campo de plano...');
                        setTimeout(adicionarCampoPlanoCasoNecessario, 300);
                    }
                }
            }
        });
    });
    
    // Configurar e iniciar o observer
    bodyObserver.observe(document.body, { childList: true, subtree: true });
    
    console.log('✅ Monitor de campo de plano inicializado');
})(); 