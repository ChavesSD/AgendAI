/**
 * Script para corrigir problemas nos cards de plano
 * Remove tabelas de empresas e outros elementos incorretos que podem aparecer neles
 */

(function() {
    console.log('🔧 Iniciando script para corrigir cards de planos...');
    
    // Função para remover elementos incorretos dos cards
    function limparCardsPlanos() {
        try {
            // Verificar se estamos na página de planos
            if (!window.location.hash.includes('/admin/plans')) {
                return; // Não executar se não estiver na página de planos
            }
            
            // Selecionar todos os cards de planos
            const cardsPlanos = document.querySelectorAll('.col-lg-4.mb-4 .card');
            
            if (cardsPlanos.length === 0) {
                console.log('⚠️ Nenhum card de plano encontrado no DOM');
                return;
            }
            
            console.log(`🔍 Verificando ${cardsPlanos.length} cards de planos...`);
            
            // Para cada card, verificar e remover elementos incorretos
            cardsPlanos.forEach((card, index) => {
                // Remover qualquer tabela dentro do card
                const tabelas = card.querySelectorAll('table');
                if (tabelas.length > 0) {
                    console.log(`🧹 Removendo ${tabelas.length} tabelas do card ${index + 1}`);
                    tabelas.forEach(tabela => tabela.remove());
                }
                
                // Remover divs de tabela responsiva
                const divsTabelaResponsiva = card.querySelectorAll('.table-responsive');
                if (divsTabelaResponsiva.length > 0) {
                    console.log(`🧹 Removendo ${divsTabelaResponsiva.length} divs de tabela do card ${index + 1}`);
                    divsTabelaResponsiva.forEach(div => div.remove());
                }
                
                // Remover qualquer elemento com ID relacionado a empresas
                const elementosEmpresas = card.querySelectorAll('[id*="companies"], [id*="company"]');
                if (elementosEmpresas.length > 0) {
                    console.log(`🧹 Removendo ${elementosEmpresas.length} elementos relacionados a empresas do card ${index + 1}`);
                    elementosEmpresas.forEach(elem => elem.remove());
                }
                
                // Remover navegação de paginação
                const navsPaginacao = card.querySelectorAll('nav[aria-label="Page navigation"]');
                if (navsPaginacao.length > 0) {
                    console.log(`🧹 Removendo ${navsPaginacao.length} elementos de paginação do card ${index + 1}`);
                    navsPaginacao.forEach(nav => nav.remove());
                }
                
                // Remover cabeçalhos de tabela
                const cabecalhosTabela = card.querySelectorAll('th');
                if (cabecalhosTabela.length > 0) {
                    console.log(`🧹 Removendo ${cabecalhosTabela.length} cabeçalhos de tabela do card ${index + 1}`);
                    cabecalhosTabela.forEach(th => {
                        if (th.parentElement) th.parentElement.remove();
                    });
                }
                
                // Remover linhas de tabela
                const linhasTabela = card.querySelectorAll('tr');
                if (linhasTabela.length > 0) {
                    console.log(`🧹 Removendo ${linhasTabela.length} linhas de tabela do card ${index + 1}`);
                    linhasTabela.forEach(tr => tr.remove());
                }
                
                // Remover corpos de tabela
                const tbodies = card.querySelectorAll('tbody');
                if (tbodies.length > 0) {
                    console.log(`🧹 Removendo ${tbodies.length} tbody do card ${index + 1}`);
                    tbodies.forEach(tbody => tbody.remove());
                }
                
                // Remover qualquer botão de ação relacionado a empresas
                const botoesAcao = card.querySelectorAll('.edit-company, .delete-company, .view-company');
                if (botoesAcao.length > 0) {
                    console.log(`🧹 Removendo ${botoesAcao.length} botões de ação de empresas do card ${index + 1}`);
                    botoesAcao.forEach(btn => {
                        if (btn.parentElement) btn.parentElement.remove();
                        else btn.remove();
                    });
                }
                
                // Encontrar outros botões que possam ter atributos data-id (típicos da tabela de empresas)
                const botoesDinamicos = card.querySelectorAll('button[data-id]');
                if (botoesDinamicos.length > 0) {
                    console.log(`🧹 Removendo ${botoesDinamicos.length} botões com data-id do card ${index + 1}`);
                    botoesDinamicos.forEach(btn => {
                        if (btn.parentElement && btn.parentElement.className.includes('btn-group')) {
                            btn.parentElement.remove();
                        } else {
                            btn.remove();
                        }
                    });
                }
            });
            
            console.log('✅ Limpeza completa dos cards de planos concluída');
        } catch (erro) {
            console.error('❌ Erro ao limpar cards de planos:', erro);
        }
    }
    
    // Executar limpeza imediatamente
    limparCardsPlanos();
    
    // Executar novamente após pequeno delay para garantir que o DOM está completo
    setTimeout(limparCardsPlanos, 500);
    
    // Executar novamente após um tempo maior para garantir que tudo carregou
    setTimeout(limparCardsPlanos, 1500);
    
    // Executar periodicamente para garantir que os elementos não voltem a aparecer
    setInterval(limparCardsPlanos, 3000);
    
    // Remover também ao mudar de rota e chegar na página de planos
    window.addEventListener('hashchange', function() {
        if (window.location.hash.includes('/admin/plans')) {
            console.log('🔄 Navegação para página de planos detectada, executando limpeza...');
            setTimeout(limparCardsPlanos, 300);
            setTimeout(limparCardsPlanos, 1000); // Segunda tentativa após um tempo maior
        }
    });
    
    console.log('✅ Script de correção de cards de planos inicializado com sucesso');
})(); 