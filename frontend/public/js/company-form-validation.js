/**
 * Script para validar o formulário de empresa e garantir que os dados sejam salvos corretamente
 */

(function() {
    console.log('🧪 Iniciando validação do formulário de empresa...');
    
    // Função para verificar todos os elementos do formulário
    function validarFormulario() {
        console.log('🔍 Verificando elementos do formulário...');
        
        const elementosRequeridos = [
            'companyName',
            'companyCNPJ',
            'companyEmail',
            'companyPhone',
            'companyAddress',
            'companyCity',
            'companyState',
            'companyZip',
            'companyStatus',
            'companyCategory'
        ];
        
        let todosElementosPresentes = true;
        
        // Verificar se cada elemento existe no DOM
        elementosRequeridos.forEach(id => {
            const elemento = document.getElementById(id);
            if (!elemento) {
                console.error(`❌ Elemento #${id} não encontrado no formulário!`);
                todosElementosPresentes = false;
            } else {
                console.log(`✅ Elemento #${id} encontrado`);
            }
        });
        
        if (!todosElementosPresentes) {
            console.error('❌ Alguns elementos do formulário estão faltando!');
            return false;
        }
        
        console.log('✅ Todos os elementos do formulário estão presentes!');
        return true;
    }
    
    // Função para conectar ao botão de salvar
    function conectarBotaoSalvar() {
        console.log('🔌 Conectando ao botão de salvar...');
        
        const botaoSalvar = document.getElementById('saveCompanyBtn');
        if (!botaoSalvar) {
            console.error('❌ Botão de salvar não encontrado!');
            return false;
        }
        
        console.log('✅ Botão de salvar encontrado. Adicionando ouvinte de eventos...');
        
        // Remover eventos anteriores para evitar duplicação
        const novoBotao = botaoSalvar.cloneNode(true);
        botaoSalvar.parentNode.replaceChild(novoBotao, botaoSalvar);
        
        // Adicionar novo ouvinte de eventos
        novoBotao.addEventListener('click', function() {
            console.log('🖱️ Botão de salvar clicado! Coletando dados do formulário...');
            salvarEmpresaManualmente();
        });
        
        console.log('✅ Ouvinte de eventos adicionado ao botão de salvar!');
        return true;
    }
    
    // Função para capturar e salvar dados do formulário manualmente
    function salvarEmpresaManualmente() {
        const form = document.getElementById('companyForm');
        
        if (!form) {
            console.error('❌ Formulário não encontrado!');
            return false;
        }
        
        if (!form.checkValidity()) {
            console.error('❌ Formulário inválido! Verificando campos...');
            
            // Destacar campos com erro
            form.classList.add('was-validated');
            
            // Verificar quais campos estão com erro
            const campos = form.querySelectorAll('input, select');
            campos.forEach(campo => {
                if (!campo.validity.valid) {
                    console.error(`❌ Campo ${campo.id} inválido: ${campo.validationMessage}`);
                }
            });
            
            return false;
        }
        
        console.log('✅ Formulário válido! Capturando dados...');
        
        try {
            // Capturar dados do formulário
            const empresaData = {
                id: form.hasAttribute('data-company-id') ? parseInt(form.getAttribute('data-company-id')) : Date.now(),
                name: document.getElementById('companyName').value,
                cnpj: document.getElementById('companyCNPJ').value,
                email: document.getElementById('companyEmail').value,
                phone: document.getElementById('companyPhone').value,
                address: document.getElementById('companyAddress').value,
                city: document.getElementById('companyCity').value,
                state: document.getElementById('companyState').value,
                zip: document.getElementById('companyZip').value,
                status: document.getElementById('companyStatus').value,
                category: document.getElementById('companyCategory').value
            };
            
            // Adicionar data de criação para novas empresas
            if (!empresaData.createdAt) {
                const dataAtual = new Date();
                const dia = String(dataAtual.getDate()).padStart(2, '0');
                const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
                const ano = dataAtual.getFullYear();
                empresaData.createdAt = `${dia}/${mes}/${ano}`;
            }
            
            console.log('📊 Dados da empresa capturados:', empresaData);
            
            // Usar função global para salvar empresa (se disponível)
            if (typeof window.salvarEmpresaDiretamente === 'function') {
                console.log('🔄 Usando função global para salvar empresa...');
                const resultado = window.salvarEmpresaDiretamente(empresaData);
                
                if (resultado) {
                    console.log('✅ Empresa salva com sucesso!');
                    
                    // Fechar o modal
                    const modal = document.getElementById('addCompanyModal');
                    if (modal && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                        const bsModal = bootstrap.Modal.getInstance(modal);
                        if (bsModal) bsModal.hide();
                    }
                    
                    return true;
                } else {
                    console.error('❌ Erro ao salvar empresa!');
                    return false;
                }
            } else {
                console.error('❌ Função global salvarEmpresaDiretamente não encontrada!');
                
                // Implementar método alternativo de salvamento
                console.log('🔄 Usando método alternativo para salvar empresa...');
                
                // Recuperar empresas existentes
                let empresas = [];
                try {
                    const empresasJSON = localStorage.getItem('agendai_companies');
                    if (empresasJSON) {
                        empresas = JSON.parse(empresasJSON);
                        if (!Array.isArray(empresas)) {
                            empresas = [];
                        }
                    }
                } catch (e) {
                    console.error('Erro ao recuperar empresas:', e);
                    empresas = [];
                }
                
                // Verificar se é atualização ou nova empresa
                const index = empresas.findIndex(e => e.id === empresaData.id);
                if (index >= 0) {
                    // Atualizar empresa existente
                    empresas[index] = empresaData;
                } else {
                    // Adicionar nova empresa
                    empresas.push(empresaData);
                }
                
                // Salvar no localStorage
                localStorage.setItem('agendai_companies', JSON.stringify(empresas));
                
                // Atualizar variável global
                window.companies = empresas;
                
                console.log('✅ Empresa salva com sucesso (método alternativo)!');
                
                // Fechar o modal
                const modal = document.getElementById('addCompanyModal');
                if (modal && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                    const bsModal = bootstrap.Modal.getInstance(modal);
                    if (bsModal) bsModal.hide();
                }
                
                // Forçar atualização da tabela
                if (typeof window.carregarEExibirEmpresas === 'function') {
                    console.log('🔄 Atualizando tabela...');
                    window.carregarEExibirEmpresas();
                }
                
                alert('Empresa salva com sucesso!');
                return true;
            }
        } catch (erro) {
            console.error('❌ Erro ao salvar empresa:', erro);
            alert('Erro ao salvar empresa: ' + erro.message);
            return false;
        }
    }
    
    // Executar verificação após pequeno delay para garantir que o DOM esteja carregado
    setTimeout(function() {
        validarFormulario();
        conectarBotaoSalvar();
    }, 1000);
    
    // Executar após mudança de URL (navegação SPA)
    window.addEventListener('hashchange', function() {
        if (window.location.hash.includes('/admin/companies')) {
            setTimeout(function() {
                validarFormulario();
                conectarBotaoSalvar();
            }, 500);
        }
    });
    
    console.log('✅ Script de validação do formulário de empresa inicializado com sucesso!');
})(); 