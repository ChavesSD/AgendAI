/**
 * Script para corrigir diretamente a tabela no DOM
 * Este script modifica o HTML da página para garantir que a tabela tenha o ID correto
 */

(function() {
    console.log('🛠️ Iniciando correção direta da tabela no DOM...');
    
    // Função para corrigir a tabela
    function corrigirTabelaDiretamente() {
        try {
            console.log('🔍 Verificando se estamos na página de empresas...');
            
            // Verificar se estamos na página de empresas
            if (!window.location.hash.includes('/admin/companies')) {
                console.log('ℹ️ Não estamos na página de empresas. Verificação ignorada.');
                return;
            }
            
            console.log('✅ Estamos na página de empresas. Iniciando correção...');
            
            // Verificar se a tabela já existe com ID correto
            if (document.getElementById('companiesTable')) {
                console.log('✅ Tabela #companiesTable já existe no DOM.');
                return;
            }
            
            // Procurar pelo container da tabela
            const tableContainer = document.querySelector('.table-responsive');
            if (!tableContainer) {
                console.error('❌ Container .table-responsive não encontrado!');
                return;
            }
            
            console.log('✅ Container .table-responsive encontrado. Verificando tabela...');
            
            // Verificar se há uma tabela dentro do container
            const tabela = tableContainer.querySelector('table');
            if (!tabela) {
                console.error('❌ Tabela não encontrada dentro do container!');
                
                // Criar uma nova tabela
                console.log('🏗️ Criando nova tabela...');
                
                const novaTabelaHTML = `
                    <table class="table table-striped table-hover" id="companiesTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>CNPJ</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Data de Cadastro</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="companiesTableBody">
                            <tr>
                                <td colspan="7" class="text-center py-4">
                                    <div class="text-muted">
                                        <i class="fas fa-spinner fa-spin me-2"></i>
                                        Carregando empresas...
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                `;
                
                tableContainer.innerHTML = novaTabelaHTML;
                console.log('✅ Nova tabela criada com sucesso!');
                return;
            }
            
            console.log('✅ Tabela encontrada. Verificando ID...');
            
            // Adicionar ID à tabela se não tiver
            if (!tabela.id) {
                tabela.id = 'companiesTable';
                console.log('✅ ID "companiesTable" adicionado à tabela.');
            } else if (tabela.id !== 'companiesTable') {
                console.log(`🔄 Alterando ID da tabela de "${tabela.id}" para "companiesTable".`);
                tabela.id = 'companiesTable';
            }
            
            // Verificar se há um tbody
            let tbody = tabela.querySelector('tbody');
            if (!tbody) {
                console.log('❌ Tbody não encontrado. Criando novo tbody...');
                
                tbody = document.createElement('tbody');
                tbody.id = 'companiesTableBody';
                
                // Adicionar mensagem de carregamento
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-4">
                            <div class="text-muted">
                                <i class="fas fa-spinner fa-spin me-2"></i>
                                Carregando empresas...
                            </div>
                        </td>
                    </tr>
                `;
                
                tabela.appendChild(tbody);
                console.log('✅ Novo tbody criado e adicionado à tabela.');
            } else {
                // Adicionar ID ao tbody se não tiver
                if (!tbody.id) {
                    tbody.id = 'companiesTableBody';
                    console.log('✅ ID "companiesTableBody" adicionado ao tbody.');
                } else if (tbody.id !== 'companiesTableBody') {
                    console.log(`🔄 Alterando ID do tbody de "${tbody.id}" para "companiesTableBody".`);
                    tbody.id = 'companiesTableBody';
                }
            }
            
            console.log('✅ Correção direta da tabela concluída com sucesso!');
        } catch (erro) {
            console.error('❌ Erro ao corrigir tabela diretamente:', erro);
        }
    }
    
    // Executar correção imediatamente
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(corrigirTabelaDiretamente, 100);
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(corrigirTabelaDiretamente, 100));
    }
    
    // Executar novamente após um pequeno delay para garantir
    setTimeout(corrigirTabelaDiretamente, 500);
    
    // Executar sempre que a URL mudar (navegação SPA)
    window.addEventListener('hashchange', function() {
        // Verificar se estamos na página de empresas
        if (window.location.hash.includes('/admin/companies')) {
            console.log('🔄 Mudança de URL detectada para página de empresas. Corrigindo tabela...');
            setTimeout(corrigirTabelaDiretamente, 300);
        }
    });
    
    console.log('✅ Script de correção direta da tabela inicializado com sucesso');
})();