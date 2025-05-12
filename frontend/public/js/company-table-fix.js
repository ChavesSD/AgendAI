/**
 * Script de correção para o problema da tabela de empresas não encontrada no DOM
 * Este script corrige a localização da tabela e garante que as empresas sejam carregadas corretamente
 */

(function() {
    // Evitar múltiplas execuções
    if (window.companyTableFixExecuted) {
        console.log('🔄 Script de correção da tabela já foi executado anteriormente');
        return;
    }
    window.companyTableFixExecuted = true;
    
    // Contador de tentativas
    window.companyTableAttempts = 0;
    const MAX_ATTEMPTS = 5;
    
    console.log('🔍 Iniciando correção da tabela de empresas...');
    
    // Função para obter o texto do plano baseado no ID
    function getPlanText(planId) {
        const planos = {
            '1': 'Plano Básico - R$ 50,00/mês',
            '2': 'Plano Intermediário - R$ 70,00/mês',
            '3': 'Plano Avançado - R$ 100,00/mês'
        };
        return planos[planId] || 'Plano não especificado';
    }
    
    // Verificar imediatamente se a tabela existe
    function localizarTabela() {
        // Verificar se estamos na página de empresas
        if (!window.location.hash.includes('/admin/companies')) {
            console.log('ℹ️ Não estamos na página de empresas. Operação ignorada.');
            return null;
        }
        
        window.companyTableAttempts++;
        
        // Limitar número de tentativas
        if (window.companyTableAttempts > MAX_ATTEMPTS) {
            console.log(`✅ Limite de ${MAX_ATTEMPTS} tentativas de localização da tabela atingido. Verificação interrompida.`);
            return null;
        }
        
        // Tentar encontrar pelo ID do tbody primeiro
        let tabela = document.querySelector('#companiesTableBody');
        if (tabela) {
            console.log('✅ Tabela de empresas encontrada pelo ID do tbody: #companiesTableBody');
            return tabela;
        }
        
        // Tentar encontrar pelo ID da tabela
        tabela = document.querySelector('#companiesTable tbody');
        if (!tabela) {
            console.warn(`⚠️ Tabela #companiesTable tbody não encontrada (tentativa ${window.companyTableAttempts}/${MAX_ATTEMPTS})`);
            return null;
        }
        console.log('✅ Tabela de empresas encontrada no DOM');
        return tabela;
    }
    
    // Função para carregar empresas e preencher a tabela
    function carregarEmpresas() {
        // Verificar se estamos na página correta
        if (!window.location.hash.includes('/admin/companies')) {
            console.log('ℹ️ Não estamos na página de empresas. Carregamento ignorado.');
            return false;
        }
        
        console.log('📊 Tentando carregar empresas...');
        
        try {
            // Recuperar empresas do localStorage
            const empresasJSON = localStorage.getItem('agendai_companies');
            let empresas = [];
            
            if (empresasJSON) {
                try {
                    empresas = JSON.parse(empresasJSON);
                    if (!Array.isArray(empresas)) {
                        console.error('🚫 Dados no localStorage não são um array!');
                        empresas = [];
                    }
                } catch (e) {
                    console.error('🚫 Erro ao analisar JSON de empresas:', e);
                    empresas = [];
                }
            }
            
            // Atualizar variável global
            window.companies = empresas;
            
            console.log(`📋 Encontradas ${empresas.length} empresas no localStorage`);
            
            // Tentar localizar a tabela
            let tabela = localizarTabela();
            
            // Se não encontrou a tabela, tente outro seletor comum
            if (!tabela) {
                console.log('🔍 Tentando localizar a tabela com seletores alternativos...');
                
                // Tentar outros seletores possíveis
                const seletoresAlternativos = [
                    '.table-responsive table tbody',
                    '#page-content-wrapper table tbody',
                    'table.table-bordered tbody',
                    'table tbody',
                    '.card-body table tbody'
                ];
                
                for (const seletor of seletoresAlternativos) {
                    tabela = document.querySelector(seletor);
                    if (tabela) {
                        console.log(`✅ Tabela encontrada com seletor alternativo: ${seletor}`);
                        
                        // Se encontrou uma tabela sem ID, vamos adicionar o ID apropriado
                        const tabelaPai = tabela.closest('table');
                        if (tabelaPai && !tabelaPai.id) {
                            tabelaPai.id = 'companiesTable';
                            console.log('✅ ID "companiesTable" adicionado à tabela encontrada');
                        }
                        break;
                    }
                }
            }
            
            // Se ainda não encontrou, verificar se a página já carregou completamente
            if (!tabela && document.readyState !== 'complete') {
                console.log('⏳ Página ainda está carregando, aguardando...');
                return false; // Indica que devemos tentar novamente mais tarde
            }
            
            // Se ainda não encontrou, talvez a tabela não exista - vamos criá-la
            if (!tabela) {
                console.warn('⚠️ Tabela não encontrada com nenhum seletor. Tentando criar...');
                criarTabelaEmpresas();
                return false; // Voltar mais tarde para preencher a tabela recém-criada
            }
            
            // Limpar tabela antes de preencher
            tabela.innerHTML = '';
            
            // Verificar se há empresas para exibir
            if (empresas.length === 0) {
                tabela.innerHTML = `
                    <tr>
                        <td colspan="8" class="text-center py-4">
                            <div class="text-muted">
                                <i class="fas fa-info-circle me-2"></i>
                                Nenhuma empresa cadastrada. Use o botão "Nova Empresa" para adicionar.
                            </div>
                        </td>
                    </tr>
                `;
                return true;
            }
            
            // Mapear status para texto e classes
            const statusMap = {
                'active': { text: 'Ativo', class: 'success' },
                'inactive': { text: 'Inativo', class: 'danger' },
                'trial': { text: 'Em teste', class: 'warning' }
            };
            
            // Adicionar cada empresa à tabela
            empresas.forEach(empresa => {
                // Determinar status
                const status = empresa.status ? 
                    (statusMap[empresa.status] || { text: empresa.status, class: 'secondary' }) : 
                    { text: 'Indefinido', class: 'secondary' };
                
                // Criar linha
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${empresa.id || '-'}</td>
                    <td>${empresa.name || 'N/A'}</td>
                    <td>${empresa.cnpj || 'N/A'}</td>
                    <td>${empresa.email || 'N/A'}</td>
                    <td><span class="badge bg-${status.class}">${status.text}</span></td>
                    <td>${getPlanText(empresa.plan) || 'N/A'}</td>
                    <td>${empresa.createdAt || 'N/A'}</td>
                    <td>
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-primary edit-company" data-id="${empresa.id}" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-danger delete-company" data-id="${empresa.id}" title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                
                // Adicionar à tabela
                tabela.appendChild(linha);
            });
            
            // Configurar eventos dos botões de ação
            configurarBotoesAcao();
            
            console.log('✅ Tabela de empresas atualizada com sucesso!');
            return true;
        } catch (erro) {
            console.error('🚫 Erro ao carregar empresas:', erro);
            return false;
        }
    }
    
    // Função para remover tabelas de empresas em locais incorretos
    function removerTabelasIncorretas() {
        // Se estamos na página de empresas, não remover a tabela principal
        if (window.location.hash.includes('/admin/companies')) {
            return;
        }
        
        console.log('🧹 Verificando tabelas de empresas em locais incorretos...');
        
        try {
            // Procurar por tabelas de empresas
            const tabelasEmpresas = document.querySelectorAll('#companiesTable, [id*="companies"], .table-responsive table');
            
            if (tabelasEmpresas.length > 0) {
                console.log(`🧹 Removendo ${tabelasEmpresas.length} tabelas de empresas em locais incorretos`);
                tabelasEmpresas.forEach(tabela => {
                    // Se estiver em um card ou outro container, remover o container inteiro
                    const containerPai = tabela.closest('.card-body, .table-responsive');
                    if (containerPai) {
                        containerPai.innerHTML = '';
                    } else {
                        tabela.remove();
                    }
                });
            }
            
            // Remover elementos específicos relacionados a tabelas de empresas
            const elementosEmpresas = document.querySelectorAll('[id*="companiesTable"], [id*="companiesTableBody"]');
            if (elementosEmpresas.length > 0) {
                console.log(`🧹 Removendo ${elementosEmpresas.length} elementos relacionados a tabelas de empresas`);
                elementosEmpresas.forEach(elem => elem.remove());
            }
            
            // Remover botões de ação de empresas
            const botoesAcao = document.querySelectorAll('.edit-company, .delete-company, .view-company');
            if (botoesAcao.length > 0) {
                console.log(`🧹 Removendo ${botoesAcao.length} botões de ação de empresas`);
                botoesAcao.forEach(btn => {
                    if (btn.parentElement && btn.parentElement.className.includes('btn-group')) {
                        btn.parentElement.remove();
                    } else {
                        btn.remove();
                    }
                });
            }
        } catch (erro) {
            console.error('❌ Erro ao remover tabelas incorretas:', erro);
        }
    }
    
    // Função para criar a tabela de empresas do zero
    function criarTabelaEmpresas() {
        // Verificar se estamos na página de empresas
        if (!window.location.hash.includes('/admin/companies')) {
            console.log('ℹ️ Não estamos na página de empresas. Criação de tabela ignorada.');
            return;
        }
        
        try {
            console.log('🏗️ Tentando criar tabela de empresas...');
            
            // Encontrar o container da tabela
            const container = document.querySelector('.table-responsive');
            if (!container) {
                console.error('🚫 Container para tabela não encontrado!');
                return;
            }
            
            // Verificar se já existe uma tabela
            if (container.querySelector('table')) {
                console.log('ℹ️ Já existe uma tabela no container. Criação ignorada.');
                return;
            }
            
            // Criar a tabela
            const tabela = document.createElement('table');
            tabela.id = 'companiesTable';
            tabela.className = 'table table-striped table-hover';
            
            // Adicionar cabeçalho e corpo da tabela
            tabela.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CNPJ</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Plano</th>
                        <th>Data de Cadastro</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="companiesTableBody">
                    <tr>
                        <td colspan="8" class="text-center py-4">
                            <div class="text-muted">
                                <i class="fas fa-spinner fa-spin me-2"></i>
                                Carregando empresas...
                            </div>
                        </td>
                    </tr>
                </tbody>
            `;
            
            // Adicionar a tabela ao container
            container.appendChild(tabela);
            
            console.log('✅ Tabela de empresas criada com sucesso!');
        } catch (erro) {
            console.error('🚫 Erro ao criar tabela de empresas:', erro);
        }
    }
    
    // Função para configurar os botões de ação da tabela
    function configurarBotoesAcao() {
        // Verificar se estamos na página de empresas
        if (!window.location.hash.includes('/admin/companies')) {
            return;
        }
        
        // Configurar botões de editar
        document.querySelectorAll('.edit-company').forEach(botao => {
            botao.onclick = function() {
                const id = parseInt(this.getAttribute('data-id'));
                editarEmpresa(id);
            };
        });
        
        // Configurar botões de excluir
        document.querySelectorAll('.delete-company').forEach(botao => {
            botao.onclick = function() {
                const id = parseInt(this.getAttribute('data-id'));
                excluirEmpresa(id);
            };
        });
    }
    
    // Função para editar uma empresa (a ser implementada fora deste script)
    function editarEmpresa(id) {
        console.log(`🖊️ Editar empresa com ID: ${id}`);
        
        // Verificar se a função global está disponível
        if (typeof window.editarEmpresa === 'function') {
            window.editarEmpresa(id);
        } else if (typeof window.openCompanyModal === 'function') {
            window.openCompanyModal(id);
        } else {
            console.warn('⚠️ Função para editar empresa não encontrada!');
            // Tentar abrir o modal diretamente
            const modal = document.getElementById('companyModal');
            if (modal) {
                const empresas = window.companies || [];
                const empresa = empresas.find(e => e.id === id);
                
                if (empresa) {
                    // Preencher formulário com dados da empresa
                    document.getElementById('companyId')?.value = empresa.id;
                    document.getElementById('companyName')?.value = empresa.name;
                    document.getElementById('companyCNPJ')?.value = empresa.cnpj;
                    document.getElementById('companyEmail')?.value = empresa.email;
                    document.getElementById('companyStatus')?.value = empresa.status;
                    
                    // Se houver um campo para plano, selecioná-lo
                    if (empresa.plan) {
                        const planSelect = document.getElementById('companyPlan');
                        if (planSelect) {
                            for (let i = 0; i < planSelect.options.length; i++) {
                                if (planSelect.options[i].value === empresa.plan) {
                                    planSelect.selectedIndex = i;
                                    break;
                                }
                            }
                        }
                    }
                    
                    // Abrir modal
                    new bootstrap.Modal(modal).show();
                }
            }
        }
    }
    
    // Função para excluir uma empresa (a ser implementada fora deste script)
    function excluirEmpresa(id) {
        console.log(`🗑️ Excluir empresa com ID: ${id}`);
        
        // Verificar se a função global está disponível
        if (typeof window.excluirEmpresa === 'function') {
            window.excluirEmpresa(id);
        } else if (typeof window.deleteCompany === 'function') {
            window.deleteCompany(id);
        } else {
            console.warn('⚠️ Função para excluir empresa não encontrada!');
            
            // Implementar exclusão básica aqui
            if (confirm('Tem certeza que deseja excluir esta empresa?')) {
                // Obter empresas
                const empresasJSON = localStorage.getItem('agendai_companies');
                let empresas = [];
                
                if (empresasJSON) {
                    try {
                        empresas = JSON.parse(empresasJSON);
                    } catch (e) {
                        empresas = [];
                    }
                }
                
                // Remover empresa pelo ID
                const novasEmpresas = empresas.filter(e => e.id !== id);
                
                // Salvar empresas atualizadas
                localStorage.setItem('agendai_companies', JSON.stringify(novasEmpresas));
                
                // Atualizar variável global
                window.companies = novasEmpresas;
                
                // Recarregar tabela
                carregarEmpresas();
                
                console.log(`✅ Empresa ${id} excluída com sucesso.`);
            }
        }
    }
    
    // Executar verificação inicial
    const verificarDomCarregado = function() {
        // Executar remoção de tabelas incorretas
        removerTabelasIncorretas();
        
        // Carregar empresas apenas na página apropriada
        if (window.location.hash.includes('/admin/companies')) {
            carregarEmpresas();
        }
    };
    
    // Verificar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', verificarDomCarregado);
    } else {
        verificarDomCarregado();
    }
    
    // Verificar novamente após um delay
    setTimeout(verificarDomCarregado, 500);
    setTimeout(verificarDomCarregado, 1500);
    
    // Executar quando a URL mudar
    window.addEventListener('hashchange', function() {
        console.log('🔄 URL alterada:', window.location.hash);
        
        // Remover tabelas incorretas em todas as páginas
        removerTabelasIncorretas();
        
        // Carregar empresas apenas na página apropriada
        if (window.location.hash.includes('/admin/companies')) {
            setTimeout(function() {
                carregarEmpresas();
            }, 300);
        }
    });
    
    // Executar limpeza de tabelas incorretas periodicamente
    setInterval(removerTabelasIncorretas, 3000);
    
    console.log('✅ Script de correção da tabela de empresas inicializado com sucesso');
})(); 