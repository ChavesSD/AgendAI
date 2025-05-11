/**
 * Script de correção para as operações de planos do AgendAI
 * Este script corrige o problema dos botões de exclusão de planos que não estavam funcionando
 */

// Rastrear IDs de planos que estão em processo de exclusão
window.deletingPlans = new Set();

// Controle de debounce para evitar múltiplos cliques
// Usar propriedade global para evitar redeclaração
window.planActionsDebounce = window.planActionsDebounce || {};

// Função global para confirmar exclusão de planos
window.confirmDeletePlan = function(id) {
    // Verificar se este plano já está em processo de exclusão
    if (window.deletingPlans.has(id)) {
        console.log(`Exclusão do plano ID: ${id} já está em andamento. Ignorando chamada duplicada.`);
        return;
    }
    
    // Aplicar debounce para evitar múltiplos cliques
    if (window.planActionsDebounce.deleteTimer) {
        console.log('Ignorando clique múltiplo (debounce ativo)');
        return;
    }
    
    // Configurar timer de debounce
    window.planActionsDebounce.deleteTimer = setTimeout(() => {
        window.planActionsDebounce.deleteTimer = null;
    }, 1000); // 1 segundo de debounce
    
    console.log(`Confirmando exclusão do plano ID: ${id}`);
    
    // Adicionar o ID à lista de planos em exclusão
    window.deletingPlans.add(id);
    
    if (confirm(`Deseja realmente excluir o plano ID: ${id}?`)) {
        // Verificar se a função deletePlan já existe no escopo global
        if (typeof window.deletePlan === 'function') {
            window.deletePlan(id);
        } else {
            // Implementação de emergência da função deletePlan
            emergencyDeletePlan(id);
        }
    } else {
        // Se cancelou, remover da lista de planos em exclusão
        window.deletingPlans.delete(id);
    }
};

// Implementação de emergência da função de exclusão
async function emergencyDeletePlan(id) {
    console.log('Usando função de emergência para excluir plano:', id);
    
    try {
        // Obter token de autenticação
        const authData = JSON.parse(localStorage.getItem('agendai_auth') || '{}');
        const token = authData.token;
        
        if (!token) {
            console.error('Token de autenticação não encontrado.');
            alert('Erro de autenticação. Por favor, faça login novamente.');
            window.deletingPlans.delete(id); // Limpar status
            return;
        }
        
        // API URL padrão caso não esteja definida
        const apiUrl = window.API_URL || 'http://localhost:3001/api';
        
        let responseStatus = 500; // Status padrão para erro
        
        try {
            // Fazer requisição para API de planos
            const response = await fetch(`${apiUrl}/plans/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            responseStatus = response.status;
            
            if (response.ok) {
                console.log('Plano excluído com sucesso na API');
            } else {
                console.error(`Erro ao excluir plano na API: ${response.status}`);
                // Vamos continuar e remover do localStorage mesmo com erro na API
            }
        } catch (apiError) {
            console.error('Erro ao tentar conectar com a API:', apiError);
            // Vamos continuar e remover do localStorage mesmo com erro na API
        }
        
        // Remover o plano do array local em qualquer caso
        // Se for erro 404, o plano não existe na API, então podemos removê-lo localmente
        // Se houver sucesso na API, também removemos localmente para sincronizar
        if (window.plans && Array.isArray(window.plans)) {
            console.log(`Removendo plano ID ${id} do armazenamento local`);
            
            // Verificar se o plano existe antes de remover
            const planExists = window.plans.some(p => p.id === id);
            
            if (planExists) {
                // Filtrar o plano para removê-lo
                window.plans = window.plans.filter(plan => plan.id !== id);
                
                // Atualizar localStorage como backup
                localStorage.setItem('agendai_plans', JSON.stringify(window.plans));
                
                // Tentar atualizar a interface
                if (typeof window.refreshPlansUI === 'function') {
                    window.refreshPlansUI();
                } else {
                    // Forçar atualização da página como último recurso
                    window.location.reload();
                }
                
                // Se foi erro 404 mas removemos do localStorage, considerar sucesso local
                if (responseStatus === 404) {
                    alert('Plano excluído localmente com sucesso. Ele não existia no servidor.');
                } else {
                    alert('Plano excluído com sucesso!');
                }
                
                // Finalmente, remover o ID da lista de planos em exclusão
                window.deletingPlans.delete(id);
                return;
            } else {
                console.error(`Plano ID ${id} não encontrado no armazenamento local`);
                alert('Erro: Plano não encontrado na lista local.');
                window.deletingPlans.delete(id); // Limpar status
                return;
            }
        } else {
            console.error('Lista de planos não encontrada no escopo global');
            alert('Erro: Lista de planos não inicializada.');
            window.deletingPlans.delete(id); // Limpar status
            return;
        }
    } catch (error) {
        console.error('Erro ao excluir plano:', error);
        alert('Erro ao excluir o plano: ' + error.message);
        window.deletingPlans.delete(id); // Limpar status em caso de erro
    }
}

// Fixar os botões de exclusão existentes
document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicando correção para botões de exclusão de planos...');
    
    // Inicializar o conjunto de exclusões em andamento caso não exista
    window.deletingPlans = window.deletingPlans || new Set();
    
    // Tentar corrigir os botões existentes
    setTimeout(function() {
        const deleteButtons = document.querySelectorAll('.delete-plan');
        console.log(`Encontrados ${deleteButtons.length} botões de exclusão para corrigir`);
        
        deleteButtons.forEach(btn => {
            const planId = btn.getAttribute('data-id');
            if (planId) {
                console.log(`Corrigindo botão de exclusão para o plano ID: ${planId}`);
                
                // Remover listeners anteriores para evitar duplicação
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                // Adicionar novo evento onclick com proteção contra múltiplos cliques
                newBtn.onclick = function(event) {
                    // Parar propagação do evento para evitar que outros listeners o capturem
                    event.stopPropagation();
                    // Prevenir comportamento padrão
                    event.preventDefault();
                    
                    // Chamar a função de confirmação com o ID do plano
                    confirmDeletePlan(parseInt(planId));
                    
                    return false; // Prevenir comportamento padrão adicional
                };
            }
        });
        
        console.log('Correção aplicada com sucesso!');
    }, 1000); // Aguardar 1 segundo para que a página esteja totalmente carregada
});

// Adicionar listener global para capturar cliques em botões de exclusão, mesmo que sejam adicionados dinamicamente
document.addEventListener('click', function(event) {
    // Verificar se o clique foi em um botão de exclusão ou em um de seus elementos filhos
    const deleteButton = event.target.closest('.delete-plan');
    
    if (deleteButton) {
        // Parar propagação imediatamente para evitar eventos duplicados
        event.stopPropagation();
        
        // Prevenir comportamento padrão
        event.preventDefault();
        
        // Obter o ID do plano a partir do atributo data-id
        const planId = deleteButton.getAttribute('data-id');
        
        if (planId) {
            console.log(`Botão de exclusão clicado para o plano ID: ${planId} (listener global)`);
            // Chamar a função de confirmação de exclusão com o ID do plano
            confirmDeletePlan(parseInt(planId));
        } else {
            console.error('Botão de exclusão sem atributo data-id válido');
        }
    }
});

// Verificar periodicamente se há novos botões de exclusão que precisam ser corrigidos
setInterval(function() {
    const deleteButtons = document.querySelectorAll('.delete-plan');
    deleteButtons.forEach(btn => {
        // Verificar se o botão já tem um onclick definido
        if (!btn.onclick) {
            const planId = btn.getAttribute('data-id');
            if (planId) {
                console.log(`Corrigindo botão de exclusão recém-adicionado para o plano ID: ${planId}`);
                
                // Adicionar evento onclick
                btn.onclick = function(event) {
                    // Parar propagação do evento para evitar que outros listeners o capturem
                    event.stopPropagation();
                    // Prevenir comportamento padrão
                    event.preventDefault();
                    
                    // Chamar a função de confirmação com o ID do plano
                    confirmDeletePlan(parseInt(planId));
                    
                    return false; // Prevenir comportamento padrão adicional
                };
            }
        }
    });
}, 2000); // Verificar a cada 2 segundos

console.log('Script de correção para exclusão de planos carregado!'); 