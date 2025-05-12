/**
 * Script de correção para o problema da tabela de empresas não encontrada no DOM
 * Este script corrige a localização da tabela e garante que as empresas sejam carregadas corretamente
 */

(function() {
    console.log('🔍 Iniciando correção da tabela de empresas...');
    
    // Verificar imediatamente se a tabela existe
    function localizarTabela() {
        const tabela = document.querySelector('#companiesTable tbody');
        if (!tabela) {
            console.warn('⚠️ Tabela #companiesTable tbody não encontrada no carregamento inicial');
            return null;
        }
        console.log('✅ Tabela de empresas encontrada no DOM');
        return tabela;
    }
    
    // Função para carregar empresas e preencher a tabela
    function carregarEmpresas() {
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
            
            // Limpar tabela atual
            tabela.innerHTML = '';
            
            if (empresas.length === 0) {
                // Se não há empresas, mostrar mensagem
                tabela.innerHTML = `
                    <tr>
                        <td colspan="8" class="text-center py-4">
                            <div class="text-muted">
                                <i class="fas fa-info-circle me-2"></i>
                                Nenhuma empresa cadastrada. Use o botão "Nova Empresa" para adicionar.
                            </div>
                            <div class="mt-3">
                                <button type="button" class="btn btn-outline-secondary btn-sm" id="restaurarEmpresasPadrao">
                                    <i class="fas fa-undo me-1"></i> Restaurar empresas padrão
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
                console.log('ℹ️ Mensagem de "nenhuma empresa" exibida na tabela');
                
                // Configurar o botão para restaurar empresas padrão
                setTimeout(() => {
                    const btnRestaurar = document.getElementById('restaurarEmpresasPadrao');
                    if (btnRestaurar) {
                        btnRestaurar.onclick = function() {
                            restaurarEmpresasPadrao();
                        };
                    }
                }, 100);
                
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
                    <td>${empresa.planName || empresa.plan || 'N/A'}</td>
                    <td><span class="badge bg-${status.class}">${status.text}</span></td>
                    <td>${empresa.createdAt || 'N/A'}</td>
                    <td>
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-info view-company" data-id="${empresa.id}" title="Visualizar">
                                <i class="fas fa-eye"></i>
                            </button>
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
    
    // Função para criar a tabela de empresas se ela não existir
    function criarTabelaEmpresas() {
        console.log('🏗️ Criando tabela de empresas...');
        
        try {
            // Procurar pelo container que deve conter a tabela
            let container = document.querySelector('.card-body .table-responsive');
            
            // Se não existir, tentar encontrar o card-body
            if (!container) {
                const cardBody = document.querySelector('.card-body');
                
                if (cardBody) {
                    console.log('✅ Card-body encontrado, criando table-responsive dentro dele');
                    container = document.createElement('div');
                    container.className = 'table-responsive';
                    cardBody.appendChild(container);
                } else {
                    // Se não encontrou nem o card-body, tentar encontrar o container principal
                    const mainContainer = document.querySelector('.container-fluid');
                    
                    if (mainContainer) {
                        console.log('✅ Container principal encontrado, criando card dentro dele');
                        
                        // Criar estrutura completa
                        const card = document.createElement('div');
                        card.className = 'card shadow mb-4';
                        card.innerHTML = `
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary">Empresas Cadastradas</h6>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive"></div>
                            </div>
                        `;
                        
                        // Adicionar ao container principal
                        mainContainer.appendChild(card);
                        
                        // Obter o container table-responsive recém-criado
                        container = card.querySelector('.table-responsive');
                    } else {
                        console.error('🚫 Não foi possível encontrar um container adequado para a tabela');
                        return;
                    }
                }
            }
            
            // Criar a tabela dentro do container
            const tabela = document.createElement('table');
            tabela.className = 'table table-bordered';
            tabela.id = 'companiesTable';
            tabela.width = '100%';
            tabela.cellSpacing = '0';
            
            // Adicionar cabeçalho e corpo da tabela
            tabela.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CNPJ</th>
                        <th>Email</th>
                        <th>Plano</th>
                        <th>Status</th>
                        <th>Data de Cadastro</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
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
        // Configurar botões de visualizar
        document.querySelectorAll('.view-company').forEach(botao => {
            botao.onclick = function() {
                const id = parseInt(this.getAttribute('data-id'));
                visualizarEmpresa(id);
            };
        });
        
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
    
    // Função para visualizar detalhes de uma empresa
    function visualizarEmpresa(id) {
        console.log(`🔍 Visualizando empresa ID: ${id}`);
        
        try {
            // Encontrar empresa por ID
            const empresa = window.companies.find(e => e.id === id);
            
            if (!empresa) {
                console.error(`🚫 Empresa ID ${id} não encontrada!`);
                alert('Empresa não encontrada.');
                return;
            }
            
            // Construir mensagem com detalhes
            const detalhes = `
                Nome: ${empresa.name || 'N/A'}
                CNPJ: ${empresa.cnpj || 'N/A'}
                Email: ${empresa.email || 'N/A'}
                Telefone: ${empresa.phone || 'N/A'}
                Plano: ${empresa.planName || empresa.plan || 'N/A'}
                Status: ${empresa.statusText || empresa.status || 'N/A'}
                Endereço: ${empresa.address || 'N/A'}, ${empresa.city || 'N/A'}/${empresa.state || 'N/A'} - ${empresa.zip || 'N/A'}
                Data de Cadastro: ${empresa.createdAt || 'N/A'}
            `;
            
            // Mostrar detalhes
            alert(`Detalhes da Empresa:\n\n${detalhes}`);
        } catch (erro) {
            console.error('🚫 Erro ao visualizar empresa:', erro);
            alert('Erro ao visualizar detalhes da empresa.');
        }
    }
    
    // Função para editar uma empresa
    function editarEmpresa(id) {
        console.log(`✏️ Editando empresa ID: ${id}`);
        
        // Verificar se temos a função openAddCompanyModal ou openAddCompanyModalManually
        if (typeof window.openAddCompanyModal === 'function') {
            // Primeiro, carregar os dados da empresa na memória temporária
            const empresa = window.companies.find(e => e.id === id);
            if (!empresa) {
                console.error(`🚫 Empresa ID ${id} não encontrada!`);
                alert('Empresa não encontrada.');
                return;
            }
            
            // Armazenar a empresa para edição
            window.empresaEmEdicao = empresa;
            
            // Abrir o modal
            window.openAddCompanyModal();
            
            // Aguardar o modal abrir e então preencher os campos
            setTimeout(() => preencherFormularioEdicao(empresa), 500);
        } else if (typeof window.openAddCompanyModalManually === 'function') {
            // Usar a função manual se disponível
            window.openAddCompanyModalManually();
            
            // Aguardar o modal abrir e então preencher os campos
            setTimeout(() => {
                const empresa = window.companies.find(e => e.id === id);
                if (empresa) {
                    preencherFormularioEdicao(empresa);
                }
            }, 500);
        } else {
            console.error('🚫 Função para abrir modal não encontrada!');
            alert('Não foi possível abrir o formulário de edição. Tente recarregar a página.');
        }
    }
    
    // Função para preencher o formulário com dados da empresa
    function preencherFormularioEdicao(empresa) {
        console.log('📝 Preenchendo formulário com dados da empresa...');
        
        try {
            // Obter referência ao formulário
            const form = document.getElementById('companyForm');
            if (!form) {
                console.error('🚫 Formulário não encontrado!');
                return;
            }
            
            // Limpar validações anteriores
            form.classList.remove('was-validated');
            
            // Armazenar ID da empresa no formulário
            form.setAttribute('data-company-id', empresa.id);
            
            // Preencher campos
            const campos = [
                'companyName', 'companyCNPJ', 'companyEmail', 'companyPhone',
                'companyAddress', 'companyCity', 'companyState', 'companyZip'
            ];
            
            const mapeamentoCampos = {
                'companyName': 'name',
                'companyCNPJ': 'cnpj',
                'companyEmail': 'email',
                'companyPhone': 'phone',
                'companyAddress': 'address',
                'companyCity': 'city',
                'companyState': 'state',
                'companyZip': 'zip'
            };
            
            // Preencher os campos do formulário
            for (const campo of campos) {
                const elemento = document.getElementById(campo);
                if (elemento) {
                    const propriedade = mapeamentoCampos[campo];
                    elemento.value = empresa[propriedade] || '';
                }
            }
            
            // Selecionar plano e status
            if (empresa.plan) {
                const planSelect = document.getElementById('companyPlan');
                if (planSelect) {
                    for (let i = 0; i < planSelect.options.length; i++) {
                        if (planSelect.options[i].value == empresa.plan) {
                            planSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
            }
            
            if (empresa.status) {
                const statusSelect = document.getElementById('companyStatus');
                if (statusSelect) {
                    for (let i = 0; i < statusSelect.options.length; i++) {
                        if (statusSelect.options[i].value === empresa.status) {
                            statusSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
            }
            
            // Atualizar título do modal
            const modalTitle = document.querySelector('#addCompanyModal .modal-title');
            if (modalTitle) {
                modalTitle.textContent = 'Editar Empresa';
            }
            
            console.log('✅ Formulário preenchido com sucesso!');
        } catch (erro) {
            console.error('🚫 Erro ao preencher formulário:', erro);
        }
    }
    
    // Função para excluir uma empresa
    function excluirEmpresa(id) {
        console.log(`🗑️ Excluindo empresa ID: ${id}`);
        
        try {
            // Encontrar empresa por ID
            const empresa = window.companies.find(e => e.id === id);
            
            if (!empresa) {
                console.error(`🚫 Empresa ID ${id} não encontrada!`);
                alert('Empresa não encontrada.');
                return;
            }
            
            // Confirmar exclusão
            if (!confirm(`Deseja realmente excluir a empresa "${empresa.name}"?`)) {
                console.log('❌ Exclusão cancelada pelo usuário');
                return;
            }
            
            // Filtrar empresa do array
            const empresasFiltradas = window.companies.filter(e => e.id !== id);
            
            // Salvar no localStorage
            localStorage.setItem('agendai_companies', JSON.stringify(empresasFiltradas));
            
            // Atualizar variável global
            window.companies = empresasFiltradas;
            
            // Se todas as empresas foram removidas, marcar como exclusão intencional
            if (empresasFiltradas.length === 0) {
                console.log('📊 Todas as empresas foram removidas!');
                // Usar a função do DataPersistence se disponível
                if (window.DataPersistence && typeof window.DataPersistence.marcarExclusaoEmpresas === 'function') {
                    window.DataPersistence.marcarExclusaoEmpresas();
                } else {
                    // Fallback caso o script de persistência não esteja disponível
                    localStorage.setItem('agendai_companies_cleared', 'true');
                }
            }
            
            // Recarregar tabela
            carregarEmpresas();
            
            // Notificar usuário
            alert('Empresa excluída com sucesso!');
        } catch (erro) {
            console.error('🚫 Erro ao excluir empresa:', erro);
            alert('Erro ao excluir empresa.');
        }
    }
    
    // Função para restaurar empresas padrão
    function restaurarEmpresasPadrao() {
        console.log('🔄 Restaurando empresas padrão...');
        
        if (!confirm('Deseja restaurar as empresas de exemplo padrão?')) {
            console.log('❌ Restauração cancelada pelo usuário');
            return;
        }
        
        try {
            // Empresas padrão
            const empresasPadrao = [
                {
                    id: 1001,
                    name: "Salão Beleza Total",
                    cnpj: "12.345.678/0001-90",
                    email: "contato@belezatotal.com",
                    phone: "(11) 98765-4321",
                    address: "Rua das Flores, 123",
                    city: "São Paulo",
                    state: "SP",
                    zip: "01234-567",
                    plan: 2,
                    planName: "Plano Profissional",
                    status: "active",
                    statusText: "Ativo",
                    category: "salon",
                    createdAt: "01/05/2023"
                },
                {
                    id: 1002,
                    name: "Barbearia Vintage",
                    cnpj: "98.765.432/0001-10",
                    email: "contato@barbeariavintage.com",
                    phone: "(11) 91234-5678",
                    address: "Av. Paulista, 1000",
                    city: "São Paulo",
                    state: "SP",
                    zip: "01310-100",
                    plan: 1,
                    planName: "Plano Básico",
                    status: "active",
                    statusText: "Ativo",
                    category: "barber",
                    createdAt: "15/06/2023"
                }
            ];
            
            // Salvar no localStorage
            localStorage.setItem('agendai_companies', JSON.stringify(empresasPadrao));
            
            // Remover flag de exclusão intencional
            if (window.DataPersistence && typeof window.DataPersistence.resetarExclusaoEmpresas === 'function') {
                window.DataPersistence.resetarExclusaoEmpresas();
            } else {
                localStorage.removeItem('agendai_companies_cleared');
            }
            
            // Atualizar variável global
            window.companies = empresasPadrao;
            
            // Recarregar tabela
            carregarEmpresas();
            
            // Notificar usuário
            alert('Empresas padrão restauradas com sucesso!');
        } catch (erro) {
            console.error('🚫 Erro ao restaurar empresas padrão:', erro);
            alert('Erro ao restaurar empresas padrão.');
        }
    }
    
    // Tentar carregar as empresas após um curto período
    setTimeout(() => {
        // Verificar se o documento está pronto
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            carregarEmpresas();
        } else {
            // Aguardar o documento ficar pronto
            document.addEventListener('DOMContentLoaded', carregarEmpresas);
        }
    }, 500);
    
    // Configurar verificação periódica
    const intervaloVerificacao = setInterval(() => {
        const sucesso = carregarEmpresas();
        
        // Se conseguiu carregar com sucesso por 3 vezes consecutivas, reduzir a frequência
        if (sucesso) {
            window.contagemSucessos = (window.contagemSucessos || 0) + 1;
            
            if (window.contagemSucessos >= 3) {
                console.log('✅ Correção da tabela de empresas estabilizada');
                clearInterval(intervaloVerificacao);
                
                // Continuar verificando, mas com menos frequência
                setInterval(carregarEmpresas, 10000); // a cada 10 segundos
            }
        } else {
            // Resetar contagem de sucessos consecutivos
            window.contagemSucessos = 0;
        }
    }, 2000); // verificar a cada 2 segundos inicialmente
    
    console.log('✅ Script de correção da tabela de empresas carregado com sucesso!');
})(); 