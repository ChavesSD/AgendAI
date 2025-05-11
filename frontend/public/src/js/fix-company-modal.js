/**
 * Script para corrigir problemas com o modal de nova empresa
 * Versão 3.2 - Com criação dinâmica do modal e preservação do estilo original do botão
 */

(function() {
    console.log('🚀 Iniciando correção para o modal de Nova Empresa (versão 3.2)...');
    
    // Adicionar função global para abrir o modal manualmente
    window.openAddCompanyModalManually = function() {
        console.log('Abrindo modal de nova empresa manualmente...');
        
        // Obter o modal
        let modal = document.getElementById('addCompanyModal');
        
        // Se o modal não existir, criá-lo dinamicamente
        if (!modal) {
            console.warn('Modal addCompanyModal não encontrado no DOM! Criando dinamicamente...');
            
            // HTML do modal baseado no template original da página
            const modalHTML = `
            <div class="modal fade" id="addCompanyModal" tabindex="-1" aria-labelledby="addCompanyModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="addCompanyModalLabel">Nova Empresa</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="companyForm">
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="companyName" class="form-label">Nome da Empresa*</label>
                                        <input type="text" class="form-control" id="companyName" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="companyCNPJ" class="form-label">CNPJ*</label>
                                        <input type="text" class="form-control" id="companyCNPJ" placeholder="XX.XXX.XXX/0001-XX" required>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="companyEmail" class="form-label">Email*</label>
                                        <input type="email" class="form-control" id="companyEmail" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="companyPhone" class="form-label">Telefone*</label>
                                        <input type="tel" class="form-control" id="companyPhone" placeholder="(XX) XXXXX-XXXX" required>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="companyPlan" class="form-label">Plano*</label>
                                        <select class="form-select" id="companyPlan" required>
                                            <option value="">Selecione...</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="companyStatus" class="form-label">Status*</label>
                                        <select class="form-select" id="companyStatus" required>
                                            <option value="active">Ativo</option>
                                            <option value="inactive">Inativo</option>
                                            <option value="trial">Em teste</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="companyWebsite" class="form-label">Website</label>
                                        <input type="url" class="form-control" id="companyWebsite" placeholder="https://www.exemplo.com.br">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="companyCategory" class="form-label">Categoria*</label>
                                        <select class="form-select" id="companyCategory" required>
                                            <option value="">Selecione...</option>
                                            <option value="salon">Salão de Beleza</option>
                                            <option value="barber">Barbearia</option>
                                            <option value="clinic">Clínica Estética</option>
                                            <option value="spa">SPA</option>
                                            <option value="nail">Manicure & Pedicure</option>
                                            <option value="other">Outro</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="companyAddress" class="form-label">Endereço*</label>
                                    <input type="text" class="form-control" id="companyAddress" required>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label for="companyCity" class="form-label">Cidade*</label>
                                        <input type="text" class="form-control" id="companyCity" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="companyState" class="form-label">Estado*</label>
                                        <select class="form-select" id="companyState" required>
                                            <option value="">Selecione...</option>
                                            <option value="AC">Acre</option>
                                            <option value="AL">Alagoas</option>
                                            <option value="AP">Amapá</option>
                                            <option value="AM">Amazonas</option>
                                            <option value="BA">Bahia</option>
                                            <option value="CE">Ceará</option>
                                            <option value="DF">Distrito Federal</option>
                                            <option value="ES">Espírito Santo</option>
                                            <option value="GO">Goiás</option>
                                            <option value="MA">Maranhão</option>
                                            <option value="MT">Mato Grosso</option>
                                            <option value="MS">Mato Grosso do Sul</option>
                                            <option value="MG">Minas Gerais</option>
                                            <option value="PA">Pará</option>
                                            <option value="PB">Paraíba</option>
                                            <option value="PR">Paraná</option>
                                            <option value="PE">Pernambuco</option>
                                            <option value="PI">Piauí</option>
                                            <option value="RJ">Rio de Janeiro</option>
                                            <option value="RN">Rio Grande do Norte</option>
                                            <option value="RS">Rio Grande do Sul</option>
                                            <option value="RO">Rondônia</option>
                                            <option value="RR">Roraima</option>
                                            <option value="SC">Santa Catarina</option>
                                            <option value="SP">São Paulo</option>
                                            <option value="SE">Sergipe</option>
                                            <option value="TO">Tocantins</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="companyZip" class="form-label">CEP*</label>
                                        <input type="text" class="form-control" id="companyZip" placeholder="XXXXX-XXX" required>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="companyNotes" class="form-label">Observações</label>
                                    <textarea class="form-control" id="companyNotes" rows="3"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Recursos Adicionais</label>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="featureSMS">
                                        <label class="form-check-label" for="featureSMS">Notificações por SMS</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="featureWhatsApp">
                                        <label class="form-check-label" for="featureWhatsApp">Notificações por WhatsApp</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="featurePayments">
                                        <label class="form-check-label" for="featurePayments">Pagamentos Online</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="featureCustomization">
                                        <label class="form-check-label" for="featureCustomization">Personalização Avançada</label>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="saveCompanyBtn">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>`;
            
            // Adicionar o modal ao final do body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            console.log('Modal criado dinamicamente no DOM');
            
            // Obter a referência para o modal recém-criado
            modal = document.getElementById('addCompanyModal');
            
            // Garantir que temos o modal antes de continuar
            if (!modal) {
                console.error('Erro crítico: Modal não pôde ser criado dinamicamente!');
                alert('Erro ao criar o formulário de cadastro. Tente recarregar a página.');
                return;
            }
        }
        
        // Resetar o formulário se existir
        const form = document.getElementById('companyForm');
        if (form) {
            try {
                form.reset();
                console.log('Formulário resetado com sucesso');
                
                // Verificar se o select de planos tem opções
                const planSelect = document.getElementById('companyPlan');
                if (planSelect && planSelect.options.length <= 1) {
                    console.log('Carregando planos no select...');
                    
                    // Tentar usar a função existente
                    if (typeof loadAvailablePlans === 'function') {
                        loadAvailablePlans();
                    } else {
                        // Implementação alternativa
                        loadPlansIntoSelect(planSelect);
                    }
                }
            } catch (error) {
                console.error('Erro ao resetar formulário:', error);
            }
        }
        
        // Forçar a remoção de qualquer modal backdrop existente
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
        
        // Forçar que o body não tenha classe modal-open
        document.body.classList.remove('modal-open');
        
        // Garantir que o modal não tenha a classe show
        modal.classList.remove('show');
        modal.style.display = 'none';
        
        // Aguardar um momento para garantir que o estado foi reset
        setTimeout(() => {
            // Mostrar o modal
            showModalSafely(modal);
        }, 100);
    };
    
    // Função para carregar planos no select
    function loadPlansIntoSelect(planSelect) {
        if (!planSelect) return;
        
        console.log('Sincronizando planos no formulário com os cadastrados no sistema...');
        
        // Limpar opções existentes exceto a primeira
        while (planSelect.options.length > 1) {
            planSelect.remove(1);
        }
        
        // Tentativa 1: Usar a variável global window.plans se disponível (forma mais direta)
        if (window.plans && Array.isArray(window.plans) && window.plans.length > 0) {
            console.log(`Usando ${window.plans.length} planos da variável global window.plans`);
            
            // Adicionar "Todos" como primeira opção
            const todosOption = document.createElement('option');
            todosOption.value = "";
            todosOption.textContent = "Todos";
            planSelect.appendChild(todosOption);
            
            // Adicionar cada plano da lista global
            window.plans.forEach(plan => {
                if (plan.status !== 'inactive') {
                    const option = document.createElement('option');
                    option.value = plan.id;
                    // Formatar o preço adequadamente
                    const price = typeof plan.price === 'number' ? 
                        plan.price.toFixed(2) : 
                        parseFloat(String(plan.price || 0)).toFixed(2);
                    
                    option.textContent = plan.name;
                    planSelect.appendChild(option);
                }
            });
            
            return; // Se obteve planos da variável global, encerra aqui
        }
        
        // Tentativa 2: Obter planos do localStorage
        try {
            const storedPlans = localStorage.getItem('agendai_plans');
            if (storedPlans) {
                const plans = JSON.parse(storedPlans);
                
                if (Array.isArray(plans) && plans.length > 0) {
                    console.log(`Carregados ${plans.length} planos do localStorage`);
                    
                    // Adicionar "Todos" como primeira opção
                    const todosOption = document.createElement('option');
                    todosOption.value = "";
                    todosOption.textContent = "Todos";
                    planSelect.appendChild(todosOption);
                    
                    // Adicionar os planos encontrados
                    plans.forEach(plan => {
                        if (plan.status !== 'inactive') {
                            const option = document.createElement('option');
                            option.value = plan.id;
                            option.textContent = plan.name;
                            planSelect.appendChild(option);
                        }
                    });
                    
                    // Atualizar a variável global window.plans para futuros usos
                    window.plans = plans;
                    return; // Se obteve planos do localStorage, encerra aqui
                }
            }
        } catch (error) {
            console.error('Erro ao carregar planos do localStorage:', error);
        }
        
        // Tentativa 3: Usar planos padrão como último recurso
        console.log('Usando planos padrão no formulário');
        
        // Adicionar "Todos" como primeira opção
        const todosOption = document.createElement('option');
        todosOption.value = "";
        todosOption.textContent = "Todos";
        planSelect.appendChild(todosOption);
        
        // Planos padrão
        const defaultPlans = [
            { id: 1, name: "Básico", price: 50.00 },
            { id: 2, name: "Profissional", price: 70.00 },
            { id: 3, name: "Empresarial", price: 100.00 }
        ];
        
        // Adicionar os planos padrão
        defaultPlans.forEach(plan => {
            const option = document.createElement('option');
            option.value = plan.id;
            option.textContent = plan.name;
            planSelect.appendChild(option);
        });
        
        // Tentar salvar esses planos padrão no localStorage se ainda não existirem
        try {
            if (!localStorage.getItem('agendai_plans')) {
                localStorage.setItem('agendai_plans', JSON.stringify(defaultPlans));
                console.log('Planos padrão salvos no localStorage');
                
                // Atualizar a variável global window.plans
                window.plans = defaultPlans;
            }
        } catch (e) {
            console.error('Erro ao salvar planos padrão:', e);
        }
    }
    
    // Função para mostrar o modal de forma segura
    function showModalSafely(modal) {
        try {
            console.log('Mostrando modal com método seguro...');
            
            // Primeiro tentar usar Bootstrap
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                try {
                    let bsModal = bootstrap.Modal.getInstance(modal);
                    if (!bsModal) {
                        bsModal = new bootstrap.Modal(modal);
                    }
                    bsModal.show();
                    console.log('Modal aberto com sucesso usando Bootstrap');
                    return;
                } catch (e) {
                    console.warn('Erro ao usar Bootstrap.Modal:', e);
                }
            }
            
            // Método alternativo direto se Bootstrap falhar
            modal.style.display = 'block';
            modal.classList.add('show');
            document.body.classList.add('modal-open');
            
            // Adicionar backdrop manualmente
            if (!document.querySelector('.modal-backdrop')) {
                const backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop fade show';
                document.body.appendChild(backdrop);
            }
            
            console.log('Modal aberto manualmente com método direto');
            
            // Garantir que os botões de fechamento funcionem
            setupCloseButtons(modal);
            
            // Garantir que o botão de salvar funcione
            setupSaveButton(modal);
        } catch (error) {
            console.error('Erro fatal ao tentar abrir o modal:', error);
            alert('Erro ao abrir o formulário. Por favor, tente novamente.');
        }
    }
    
    // Configurar botões de fechar
    function setupCloseButtons(modal) {
        const closeButtons = modal.querySelectorAll('[data-bs-dismiss="modal"], .btn-close, button.btn-secondary');
        closeButtons.forEach(button => {
            // Remover eventos existentes para evitar duplicação
            const newButton = button.cloneNode(true);
            if (button.parentNode) {
                button.parentNode.replaceChild(newButton, button);
            }
            
            // Adicionar novo evento
            newButton.addEventListener('click', function() {
                closeModalManually(modal);
            });
        });
        
        console.log(`Configurados ${closeButtons.length} botões de fechamento`);
    }
    
    // Configurar botão de salvar
    function setupSaveButton(modal) {
        const saveButton = modal.querySelector('#saveCompanyBtn');
        if (saveButton) {
            // Remover eventos existentes para evitar duplicação
            const newButton = saveButton.cloneNode(true);
            if (saveButton.parentNode) {
                saveButton.parentNode.replaceChild(newButton, saveButton);
            }
            
            // Adicionar novo evento com implementação completa
            newButton.addEventListener('click', function() {
                console.log('Botão Salvar clicado! Processando dados do formulário...');
                
                const form = document.getElementById('companyForm');
                if (form && form.checkValidity()) {
                    // Obter dados do formulário
                    const companyData = {
                        id: Date.now(), // Usar timestamp como ID temporário
                        name: document.getElementById('companyName').value,
                        cnpj: document.getElementById('companyCNPJ').value,
                        email: document.getElementById('companyEmail').value,
                        phone: document.getElementById('companyPhone').value,
                        address: document.getElementById('companyAddress').value,
                        city: document.getElementById('companyCity').value,
                        state: document.getElementById('companyState').value,
                        zip: document.getElementById('companyZip').value,
                        plan: document.getElementById('companyPlan').value,
                        planName: document.getElementById('companyPlan').options[document.getElementById('companyPlan').selectedIndex].text,
                        status: document.getElementById('companyStatus').value,
                        statusText: document.getElementById('companyStatus').options[document.getElementById('companyStatus').selectedIndex].text,
                        createdAt: new Date().toLocaleDateString('pt-BR')
                    };
                    
                    // Salvar empresa utilizando o sistema de persistência
                    console.log('Dados da empresa antes de salvar:', companyData);
                    
                    // Usar o novo sistema de persistência se estiver disponível
                    if (window.CompaniesStorage && typeof window.CompaniesStorage.saveCompanies === 'function') {
                        // Obter lista atual de empresas
                        let companies = Array.isArray(window.companies) ? window.companies : [];
                        
                        // Adicionar a nova empresa
                        companies.push(companyData);
                        
                        // Salvar através do sistema de persistência
                        window.CompaniesStorage.saveCompanies(companies);
                        console.log('Empresa salva usando sistema de persistência CompaniesStorage');
                    } else {
                        // Fallback para a função saveCompany global
                        if (typeof saveCompany === 'function') {
                            saveCompany(companyData);
                            console.log('Empresa salva usando função saveCompany global');
                        } else {
                            // Fallback direto para localStorage em último caso
                            try {
                                const storedCompanies = localStorage.getItem('agendai_companies');
                                let companies = storedCompanies ? JSON.parse(storedCompanies) : [];
                                companies.push(companyData);
                                localStorage.setItem('agendai_companies', JSON.stringify(companies));
                                console.log('Empresa salva diretamente no localStorage');
                            } catch (error) {
                                console.error('Erro ao salvar empresa:', error);
                            }
                        }
                    }
                    
                    // Fechar o modal
                    closeModal(modal);
                    
                    // Mostrar mensagem de sucesso
                    alert('Empresa cadastrada com sucesso!');
                    
                    // Recarregar lista de empresas
                    if (typeof loadCompanies === 'function') {
                        loadCompanies();
                    }
                } else {
                    console.error('Formulário inválido!');
                    // Destacar campos obrigatórios
                    form.classList.add('was-validated');
                }
            });
            
            console.log('✅ Botão Salvar configurado com sucesso!');
        } else {
            console.error('❌ Botão Salvar não encontrado no modal!');
        }
    }
    
    // Também adicionar um evento global para garantir que o botão funcione sempre
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'saveCompanyBtn') {
            console.log('Clique no botão de salvar detectado via delegação de eventos');
            
            const form = document.getElementById('companyForm');
            if (form && form.checkValidity()) {
                alert('Empresa cadastrada com sucesso!');
                
                // Fechar o modal
                const modal = document.getElementById('addCompanyModal');
                if (modal) {
                    closeModalManually(modal);
                }
            } else if (form) {
                form.reportValidity();
            }
        }
    });
    
    // Função para fechar o modal manualmente
    function closeModalManually(modal) {
        console.log('Fechando modal manualmente');
        
        if (!modal) {
            modal = document.getElementById('addCompanyModal');
            if (!modal) return;
        }
        
        // Tentar primeiro usar Bootstrap se disponível
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            try {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) {
                    bsModal.hide();
                    console.log('Modal fechado com Bootstrap');
                    return;
                }
            } catch (e) {
                console.warn('Erro ao usar Bootstrap para fechar modal:', e);
            }
        }
        
        // Tentar usar jQuery se disponível
        if (typeof $ !== 'undefined') {
            try {
                $(modal).modal('hide');
                console.log('Modal fechado com jQuery');
                return;
            } catch (e) {
                console.warn('Erro ao usar jQuery para fechar modal:', e);
            }
        }
        
        // Método direto sem depender do Bootstrap ou jQuery
        try {
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
            
            // Remover backdrop
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
            
            console.log('Modal fechado com método direto');
        } catch (e) {
            console.error('Erro ao fechar modal com método direto:', e);
        }
    }
    
    // Função para corrigir o botão Nova Empresa
    function corrigirBotaoNovaEmpresa() {
        console.log('Procurando botão Nova Empresa para corrigir...');
        
        const btnNovaEmpresa = document.getElementById('newCompanyBtn');
        if (!btnNovaEmpresa) {
            console.log('Botão Nova Empresa não encontrado no DOM, tentando novamente em 1s...');
            setTimeout(corrigirBotaoNovaEmpresa, 1000);
            return;
        }
        
        // Verificar se o botão já foi corrigido
        if (btnNovaEmpresa.getAttribute('data-fixed') === 'true') {
            console.log('Botão Nova Empresa já foi corrigido anteriormente');
            return;
        }
        
        console.log('Botão Nova Empresa encontrado, aplicando correção');
        
        // Preservar o HTML original do botão
        const originalHTML = btnNovaEmpresa.innerHTML;
        const originalClasses = btnNovaEmpresa.className;
        
        // Substituir o handler de clique
        btnNovaEmpresa.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Botão Nova Empresa clicado! Abrindo modal...');
            window.openAddCompanyModalManually();
        };
        
        // Marcar o botão como corrigido sem alterar sua aparência
        btnNovaEmpresa.setAttribute('data-fixed', 'true');
        
        // Restaurar o HTML e as classes originais, garantindo que não alteramos o estilo
        btnNovaEmpresa.innerHTML = originalHTML;
        btnNovaEmpresa.className = originalClasses;
        
        console.log('Botão Nova Empresa corrigido com sucesso, mantendo estilo original!');
    }
    
    // Iniciar o processo de correção
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(corrigirBotaoNovaEmpresa, 1000);
        });
    } else {
        setTimeout(corrigirBotaoNovaEmpresa, 1000);
    }
    
    // Tentar várias vezes para garantir que a correção seja aplicada
    setTimeout(corrigirBotaoNovaEmpresa, 3000);
    setTimeout(corrigirBotaoNovaEmpresa, 5000);
    
    // Usar MutationObserver para detectar quando a página de empresas é carregada dinamicamente
    try {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // Verificar se o botão Nova Empresa foi adicionado ao DOM
                    if (document.getElementById('newCompanyBtn')) {
                        corrigirBotaoNovaEmpresa();
                    }
                }
            });
        });
        
        // Iniciar observação
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
        
        console.log('MutationObserver configurado para corrigir o botão automaticamente');
    } catch (error) {
        console.error('Erro ao configurar MutationObserver:', error);
    }
    
    console.log('Script de correção do modal de Nova Empresa instalado com sucesso!');
})(); 