/**
 * Script de debug para verificar se a tabela de empresas está sendo encontrada corretamente
 */

(function() {
    console.log('🔍 Iniciando debug da tabela de empresas...');
    
    // Função para verificar a tabela
    function debugTabela() {
        console.log('🔎 DEBUG: Verificando tabela de empresas...');
        
        // Verificar se estamos na página de empresas
        const isCompaniesPage = window.location.hash.includes('/admin/companies');
        console.log(`🔎 DEBUG: Estamos na página de empresas? ${isCompaniesPage}`);
        
        if (!isCompaniesPage) {
            console.log('🔎 DEBUG: Não estamos na página de empresas. Verificação ignorada.');
            return;
        }
        
        // Verificar todos os seletores possíveis
        const seletores = [
            '#companiesTable',
            '#companiesTableBody',
            '.table-responsive table',
            '.table-responsive tbody',
            'table.table-striped',
            'table.table-hover',
            'table tbody',
            '.card-body table',
            '.card-body tbody'
        ];
        
        console.log('🔎 DEBUG: Verificando seletores...');
        
        seletores.forEach(seletor => {
            const elemento = document.querySelector(seletor);
            console.log(`🔎 DEBUG: ${seletor} - ${elemento ? 'ENCONTRADO ✅' : 'NÃO ENCONTRADO ❌'}`);
            
            if (elemento) {
                console.log(`🔎 DEBUG: ${seletor} - ID: ${elemento.id || 'sem ID'}, Classes: ${elemento.className || 'sem classes'}`);
                
                // Verificar se tem filhos
                console.log(`🔎 DEBUG: ${seletor} - Número de filhos: ${elemento.children.length}`);
                
                // Verificar se é uma tabela
                if (elemento.tagName === 'TABLE') {
                    console.log(`🔎 DEBUG: ${seletor} - É uma tabela com ${elemento.rows.length} linhas`);
                    
                    // Verificar se tem tbody
                    const tbody = elemento.querySelector('tbody');
                    if (tbody) {
                        console.log(`🔎 DEBUG: ${seletor} - Tem tbody com ID: ${tbody.id || 'sem ID'} e ${tbody.children.length} filhos`);
                    } else {
                        console.log(`🔎 DEBUG: ${seletor} - Não tem tbody`);
                    }
                }
                
                // Verificar se é um tbody
                if (elemento.tagName === 'TBODY') {
                    console.log(`🔎 DEBUG: ${seletor} - É um tbody com ${elemento.children.length} filhos`);
                    
                    // Verificar se tem tr
                    const tr = elemento.querySelector('tr');
                    if (tr) {
                        console.log(`🔎 DEBUG: ${seletor} - Tem tr com ${tr.cells.length} células`);
                    } else {
                        console.log(`🔎 DEBUG: ${seletor} - Não tem tr`);
                    }
                }
            }
        });
        
        // Verificar a estrutura DOM da tabela
        console.log('🔎 DEBUG: Verificando estrutura DOM da tabela...');
        
        const tableResponsive = document.querySelector('.table-responsive');
        if (tableResponsive) {
            console.log('🔎 DEBUG: .table-responsive encontrado');
            console.log('🔎 DEBUG: Conteúdo HTML:', tableResponsive.innerHTML);
        } else {
            console.log('🔎 DEBUG: .table-responsive não encontrado');
        }
        
        // Verificar se há erros no console relacionados à tabela
        console.log('🔎 DEBUG: Verificação da tabela concluída');
    }
    
    // Executar verificação após um pequeno delay
    setTimeout(debugTabela, 1000);
    
    // Executar verificação novamente após 3 segundos
    setTimeout(debugTabela, 3000);
    
    console.log('✅ Script de debug da tabela inicializado com sucesso');
})();