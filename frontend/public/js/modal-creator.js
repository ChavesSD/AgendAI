/**
 * Script para garantir que o modal exista no DOM
 * Este script verifica se o modal existe e, se não existir, cria-o dinamicamente
 */

(function() {
    console.log('🔍 Verificando existência do modal...');
    
    // Função para verificar e criar o modal se necessário
    function verificarECriarModal() {
        try {
            // Verificar se o modal já existe
            const modalExistente = document.getElementById('addCompanyModal');
            if (modalExistente) {
                console.log('✅ Modal já existe no DOM');
                return;
            }
            
            console.log('⚠️ Modal não encontrado! Criando dinamicamente...');
            
            // HTML do modal
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
                                        <label for="companyStatus" class="form-label">Status*</label>
                                        <select class="form-select" id="companyStatus" required>
                                            <option value="active">Ativo</option>
                                            <option value="inactive">Inativo</option>
                                            <option value="trial">Em teste</option>
                                        </select>
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
            
            console.log('✅ Modal criado dinamicamente no DOM');
        } catch (erro) {
            console.error('❌ Erro ao verificar/criar modal:', erro);
        }
    }
    
    // Executar verificação imediatamente
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        verificarECriarModal();
    } else {
        // Aguardar o DOM carregar
        document.addEventListener('DOMContentLoaded', verificarECriarModal);
    }
    
    // Executar novamente após um pequeno delay para garantir
    setTimeout(verificarECriarModal, 500);
    
    console.log('✅ Script de verificação do modal inicializado com sucesso');
})(); 