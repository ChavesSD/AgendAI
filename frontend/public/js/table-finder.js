/**
 * Script para garantir que a tabela de empresas seja encontrada corretamente
 * Este script executa imediatamente e tenta localizar a tabela por diferentes métodos
 */

(function() {
    console.log('🔎 Iniciando script de localização da tabela de empresas...');
    
    // Função para verificar e corrigir a tabela
    function verificarTabela() {
        try {
            // Verificar se estamos na página de empresas
            if (!window.location.hash.includes('/admin/companies')) {
                console.log('ℹ️ Não estamos na página de empresas. Verificação ignorada.');
                return;
            }
            
            console.log('🔍 Verificando tabela de empresas...');
            
            // Verificar se a tabela existe com ID correto
            let tabela = document.querySelector('#companiesTable');
            let tbody = document.querySelector('#companiesTableBody');
            
            if (!tabela) {
                console.warn('⚠️ Tabela #companiesTable não encontrada!');
                
                // Tentar encontrar qualquer tabela
                tabela = document.querySelector('.table-responsive table');
                
                if (tabela) {
                    console.log('✅ Tabela encontrada sem ID. Adicionando ID "companiesTable".');
                    tabela.id = 'companiesTable';
                } else {
                    console.error('❌ Nenhuma tabela encontrada na página!');
                }
            } else {
                console.log('✅ Tabela #companiesTable encontrada.');
            }
            
            // Verificar o tbody
            if (!tbody) {
                console.warn('⚠️ Tbody #companiesTableBody não encontrado!');
                
                // Tentar encontrar o tbody dentro da tabela
                if (tabela) {
                    tbody = tabela.querySelector('tbody');
                    
                    if (tbody) {
                        console.log('✅ Tbody encontrado sem ID. Adicionando ID "companiesTableBody".');
                        tbody.id = 'companiesTableBody';
                    } else {
                        console.error('❌ Nenhum tbody encontrado na tabela!');
                        
                        // Criar tbody se não existir
                        tbody = document.createElement('tbody');
                        tbody.id = 'companiesTableBody';
                        tabela.appendChild(tbody);
                        console.log('✅ Tbody criado e adicionado à tabela.');
                    }
                }
            } else {
                console.log('✅ Tbody #companiesTableBody encontrado.');
            }
            
            // Verificar se a tabela está vazia
            if (tbody && tbody.children.length === 0) {
                console.log('ℹ️ Tabela está vazia. Adicionando mensagem temporária.');
                
                // Adicionar mensagem temporária
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
            }
            
            console.log('✅ Verificação da tabela concluída.');
            return true;
        } catch (erro) {
            console.error('❌ Erro ao verificar tabela:', erro);
            return false;
        }
    }
    
    // Executar verificação imediatamente
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(verificarTabela, 100);
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(verificarTabela, 100));
    }
    
    // Executar novamente após um pequeno delay para garantir
    setTimeout(verificarTabela, 500);
    
    // Executar sempre que a URL mudar (navegação SPA)
    window.addEventListener('hashchange', function() {
        // Verificar se estamos na página de empresas
        if (window.location.hash.includes('/admin/companies')) {
            console.log('🔄 Mudança de URL detectada para página de empresas. Verificando tabela...');
            setTimeout(verificarTabela, 300);
        }
    });
    
    console.log('✅ Script de localização da tabela inicializado com sucesso');
})();