/**
 * AgendAI - Página de Agendamento
 * Script para gerenciar a funcionalidade da página de agendamento
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do BookingApp
    BookingApp.init();
});

// Aplicação de Agendamento
const BookingApp = {
    // Estado da aplicação
    currentStep: 1,
    totalSteps: 4,
    selectedProfessional: null,
    selectedServices: [], // Array para armazenar múltiplos serviços
    totalPrice: 0, // Armazenar o valor total
    selectedDate: null,
    selectedTime: null,
    companyData: null,
    
    // Elementos DOM importantes
    elements: {
        steps: null,
        progressSteps: null,
        prevButton: null,
        nextButton: null,
        confirmButton: null,
        professionalCards: null,
        serviceCards: null,
        calendar: null,
        timeSlots: null
    },
    
    // Inicialização da aplicação
    init() {
        console.log('Inicializando aplicação de agendamento...');
        
        // Carrega os elementos DOM
        this.loadElements();
        
        // Configura os event listeners
        this.setupEventListeners();
        
        // Carrega os dados da empresa (simulação)
        this.loadCompanyData();
        
        // Inicializa o calendário
        this.initCalendar();
        
        // Não chamamos mais o showWelcomeModal aqui para evitar conflitos
        // Agora a inicialização rápida cuida disso
        
        console.log('Aplicação de agendamento inicializada com sucesso!');
    },
    
    // Carrega os elementos DOM importantes
    loadElements() {
        this.elements.steps = document.querySelectorAll('.booking-step');
        this.elements.progressSteps = document.querySelectorAll('.progress-steps li');
        this.elements.prevButton = document.getElementById('prev-step');
        this.elements.nextButton = document.getElementById('next-step');
        this.elements.confirmButton = document.getElementById('confirm-booking');
        this.elements.professionalCards = document.querySelectorAll('.professional-card');
        this.elements.serviceCards = document.querySelectorAll('.service-card');
    },
    
    // Configura os event listeners
    setupEventListeners() {
        // Botões de navegação
        this.elements.prevButton.addEventListener('click', () => this.previousStep());
        this.elements.nextButton.addEventListener('click', () => this.nextStep());
        this.elements.confirmButton.addEventListener('click', () => this.submitBooking());
        
        // Seleção de profissionais
        this.elements.professionalCards.forEach(card => {
            card.addEventListener('click', () => this.selectProfessional(card));
        });
        
        // Seleção de serviços
        this.elements.serviceCards.forEach(card => {
            card.addEventListener('click', () => this.selectService(card));
        });
        
        // Botões específicos de profissionais
        document.querySelectorAll('.select-professional').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = button.closest('.professional-card');
                this.selectProfessional(card);
                this.nextStep();
            });
        });
        
        // Botões específicos de serviços
        document.querySelectorAll('.select-service').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = button.closest('.service-card');
                this.selectService(card);
                
                // Atualizando o texto do botão com base no estado de seleção
                const isSelected = card.classList.contains('selected');
                button.textContent = isSelected ? 'Remover' : 'Selecionar';
                button.classList.toggle('btn-outline-primary', !isSelected);
                button.classList.toggle('btn-primary', isSelected);
                
                // Não avançamos automaticamente para permitir seleção de múltiplos serviços
            });
        });
        
        // Navegação do calendário
        document.getElementById('prev-month').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('next-month').addEventListener('click', () => this.changeMonth(1));
    },
    
    // Carrega os dados da empresa (simulação - no futuro virá da API)
    loadCompanyData() {
        // Simulação de dados da empresa
        this.companyData = {
            id: 'emp123',
            name: 'Salão Beauty Style',
            category: 'Salão de Beleza',
            logo: '/src/img/company-placeholder.png',
            address: 'Av. Principal, 123 - Centro',
            phone: '(11) 98765-4321',
            email: 'contato@beautyStyle.com',
            primaryColor: '#3a86ff',
            secondaryColor: '#4361ee',
            professionals: [
                {
                    id: 1,
                    name: 'João Silva',
                    title: 'Cabeleireiro',
                    image: '/src/img/professionals/prof1.jpg',
                    rating: 4.5,
                    reviewCount: 120
                },
                {
                    id: 2,
                    name: 'Maria Oliveira',
                    title: 'Cabeleireira e Maquiadora',
                    image: '/src/img/professionals/prof2.jpg',
                    rating: 5.0,
                    reviewCount: 85
                },
                {
                    id: 3,
                    name: 'Carlos Santos',
                    title: 'Barbeiro',
                    image: '/src/img/professionals/prof3.jpg',
                    rating: 4.0,
                    reviewCount: 65
                }
            ],
            services: [
                {
                    id: 1,
                    name: 'Corte de Cabelo',
                    description: 'Corte profissional personalizado de acordo com o seu estilo.',
                    duration: 30,
                    price: 50.00
                },
                {
                    id: 2,
                    name: 'Hidratação',
                    description: 'Tratamento para restaurar a hidratação dos fios e melhorar a aparência do cabelo.',
                    duration: 45,
                    price: 70.00
                },
                {
                    id: 3,
                    name: 'Coloração',
                    description: 'Coloração profissional com produtos de alta qualidade.',
                    duration: 90,
                    price: 120.00
                },
                {
                    id: 4,
                    name: 'Barba',
                    description: 'Corte e modelagem de barba com toalha quente e produtos especiais.',
                    duration: 30,
                    price: 40.00
                }
            ],
            schedule: {
                // Dados de horários disponíveis serão carregados dinamicamente
            }
        };
        
        // Aplica os dados da empresa na interface
        this.applyCompanyData();
    },
    
    // Aplica os dados da empresa na interface
    applyCompanyData() {
        // Dados do cabeçalho
        document.getElementById('company-name').textContent = this.companyData.name;
        document.getElementById('company-category').textContent = this.companyData.category;
        document.getElementById('company-address').textContent = this.companyData.address;
        document.getElementById('company-phone').textContent = this.companyData.phone;
        document.getElementById('company-email').textContent = this.companyData.email;
        document.getElementById('footer-company-name').textContent = this.companyData.name;
        
        // Dados do modal de boas-vindas
        document.getElementById('welcome-company-name').textContent = this.companyData.name;
        document.getElementById('welcome-phone').textContent = this.companyData.phone;
        document.getElementById('welcome-email').textContent = this.companyData.email;
        
        // Logo da empresa (verifica se existe)
        const logoImg = document.getElementById('company-logo');
        if (logoImg && this.companyData.logo) {
            logoImg.src = this.companyData.logo;
            logoImg.alt = this.companyData.name;
        }
        
        // Aplica cores personalizadas
        if (this.companyData.primaryColor) {
            document.documentElement.style.setProperty('--booking-primary', this.companyData.primaryColor);
        }
        
        if (this.companyData.secondaryColor) {
            document.documentElement.style.setProperty('--booking-accent', this.companyData.secondaryColor);
        }
        
        // Não chamamos mais o showWelcomeModal aqui para evitar conflitos
    },
    
    // Mostra o modal de boas-vindas
    showWelcomeModal() {
        console.log('Tentando mostrar o modal de boas-vindas do arquivo JS...');
        
        // Verifica se o modal já foi exibido
        if (localStorage.getItem('welcome_modal_exibido') === 'true') {
            console.log('Modal já foi exibido anteriormente, não exibindo novamente do JS.');
            return;
        }
        
        try {
            // Verificando se o modal já está sendo exibido
            const modalBackdrop = document.querySelector('.modal-backdrop');
            const welcomeModalElement = document.getElementById('welcome-modal');
            
            if (modalBackdrop || (welcomeModalElement && welcomeModalElement.classList.contains('show'))) {
                console.log('Modal já está sendo exibido, não vamos interferir.');
                return;
            }
            
            if (!welcomeModalElement) {
                console.error('Elemento do modal de boas-vindas não encontrado!');
                return;
            }
            
            console.log('Elemento do modal encontrado no JS, tentando criar instância do Bootstrap Modal');
            
            // Verifica se o Bootstrap está disponível
            if (typeof bootstrap === 'undefined') {
                console.error('Bootstrap não está disponível!');
                return;
            }
            
            // Cria e exibe o modal
            const welcomeModal = new bootstrap.Modal(welcomeModalElement, {
                backdrop: 'static',
                keyboard: false
            });
            welcomeModal.show();
            
            // Marca o modal como exibido
            localStorage.setItem('welcome_modal_exibido', 'true');
            
            console.log('Modal de boas-vindas exibido com sucesso pelo arquivo JS!');
        } catch (error) {
            console.error('Erro ao mostrar o modal de boas-vindas do JS:', error);
        }
    },
    
    // Avança para o próximo passo
    nextStep() {
        // Validação antes de avançar
        if (!this.validateCurrentStep()) {
            return;
        }
        
        // Atualiza o passo atual
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateSteps();
        }
    },
    
    // Retorna ao passo anterior
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateSteps();
        }
    },
    
    // Atualiza a visualização das etapas
    updateSteps() {
        // Atualiza as etapas de progresso
        this.elements.progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            
            // Remove todas as classes
            step.classList.remove('active', 'completed');
            
            // Adiciona as classes apropriadas
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            }
        });
        
        // Atualiza a visibilidade das etapas
        this.elements.steps.forEach((step, index) => {
            const stepNumber = index + 1;
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Atualiza os botões de navegação
        this.elements.prevButton.disabled = (this.currentStep === 1);
        
        // Mostra o botão de confirmação apenas na última etapa
        if (this.currentStep === this.totalSteps) {
            this.elements.nextButton.style.display = 'none';
            this.elements.confirmButton.style.display = 'block';
            this.updateConfirmationData();
        } else {
            this.elements.nextButton.style.display = 'block';
            this.elements.confirmButton.style.display = 'none';
        }
    },
    
    // Valida o passo atual antes de avançar
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1: // Validação de profissional
                if (!this.selectedProfessional) {
                    alert('Por favor, selecione um profissional para continuar.');
                    return false;
                }
                return true;
                
            case 2: // Validação de serviço
                if (!this.selectedServices.length) {
                    alert('Por favor, selecione pelo menos um serviço para continuar.');
                    return false;
                }
                return true;
                
            case 3: // Validação de data e hora
                if (!this.selectedDate || !this.selectedTime) {
                    alert('Por favor, selecione uma data e horário para continuar.');
                    return false;
                }
                return true;
                
            case 4: // Validação do formulário de cliente
                const form = document.getElementById('customer-form');
                return form.checkValidity();
                
            default:
                return true;
        }
    },
    
    // Seleciona um profissional
    selectProfessional(card) {
        // Remove a seleção de todos os cards
        this.elements.professionalCards.forEach(c => c.classList.remove('selected'));
        
        // Adiciona a classe de seleção ao card clicado
        card.classList.add('selected');
        
        // Armazena o ID do profissional selecionado
        const professionalId = card.getAttribute('data-professional-id');
        this.selectedProfessional = this.companyData.professionals.find(p => p.id == professionalId);
        
        // Atualiza os elementos que mostram o profissional selecionado
        const professionalNameElements = document.querySelectorAll('#selected-professional-name, #selected-professional-name-2');
        professionalNameElements.forEach(el => {
            if (el) el.textContent = this.selectedProfessional.name;
        });
        
        console.log('Profissional selecionado:', this.selectedProfessional);
    },
    
    // Seleciona um serviço
    selectService(card) {
        // Obter o ID do serviço
        const serviceId = parseInt(card.getAttribute('data-service-id'));
        const service = this.companyData.services.find(s => s.id === serviceId);
        
        if (!service) {
            console.error('Serviço não encontrado!');
            return;
        }
        
        // Verificar se o serviço já está selecionado
        const index = this.selectedServices.findIndex(s => s.id === serviceId);
        
        if (index !== -1) {
            // Se já estiver selecionado, remover da lista
            this.selectedServices.splice(index, 1);
            card.classList.remove('selected');
            console.log(`Serviço ${service.name} removido da seleção.`);
        } else {
            // Se não estiver selecionado, adicionar à lista
            this.selectedServices.push(service);
            card.classList.add('selected');
            console.log(`Serviço ${service.name} adicionado à seleção.`);
        }
        
        // Recalcular o preço total
        this.totalPrice = this.selectedServices.reduce((total, s) => total + s.price, 0);
        
        // Atualizar a exibição da seleção de serviços
        this.updateServicesDisplay();
        
        console.log('Serviços selecionados:', this.selectedServices);
        console.log('Preço total: R$', this.totalPrice.toFixed(2));
    },
    
    // Atualiza a exibição dos serviços selecionados
    updateServicesDisplay() {
        // Atualizar o texto que mostra os serviços selecionados
        const serviceNameElement = document.getElementById('selected-service-name');
        const totalElement = document.getElementById('total-price');
        
        if (serviceNameElement) {
            if (this.selectedServices.length === 0) {
                serviceNameElement.textContent = 'nenhum serviço selecionado';
            } else if (this.selectedServices.length === 1) {
                serviceNameElement.textContent = this.selectedServices[0].name;
            } else {
                serviceNameElement.textContent = `${this.selectedServices.length} serviços selecionados`;
            }
        }
        
        // Atualizar o elemento que mostra o preço total (se existir)
        if (totalElement) {
            totalElement.textContent = `Total: R$ ${this.totalPrice.toFixed(2)}`;
        }
    },
    
    // Inicializa o calendário
    initCalendar() {
        // Data atual
        const currentDate = new Date();
        this.currentMonth = currentDate.getMonth();
        this.currentYear = currentDate.getFullYear();
        
        // Renderiza o calendário
        this.renderCalendar();
        
        // Configura event listeners para o calendário
        document.getElementById('prev-month').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('next-month').addEventListener('click', () => this.changeMonth(1));
    },
    
    // Renderiza o calendário
    renderCalendar() {
        const date = new Date(this.currentYear, this.currentMonth, 1);
        const monthNameElement = document.getElementById('current-month');
        const daysContainer = document.getElementById('calendar-days');
        
        if (!monthNameElement || !daysContainer) return;
        
        // Nomes dos meses em português
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                           'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        
        // Define o nome do mês e ano no cabeçalho
        monthNameElement.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        
        // Limpa o contêiner de dias
        daysContainer.innerHTML = '';
        
        // Obtém o primeiro dia do mês (0 = Domingo, 1 = Segunda, etc)
        const firstDayOfMonth = date.getDay();
        
        // Obtém o último dia do mês
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        
        // Dia atual
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Adiciona células vazias para os dias antes do primeiro dia do mês
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement('div');
            daysContainer.appendChild(emptyDay);
        }
        
        // Adiciona os dias do mês
        for (let day = 1; day <= lastDay; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = day;
            
            // Verifica se é o dia atual
            const isToday = day === currentDay && this.currentMonth === currentMonth && this.currentYear === currentYear;
            if (isToday) {
                dayElement.classList.add('today');
            }
            
            // Verifica se o dia é no passado (desabilitado)
            const dayDate = new Date(this.currentYear, this.currentMonth, day);
            if (dayDate < today && !isToday) {
                dayElement.classList.add('disabled');
            } else {
                // Adiciona event listener para seleção de dia
                dayElement.addEventListener('click', () => {
                    if (!dayElement.classList.contains('disabled')) {
                        this.selectDate(day);
                    }
                });
            }
            
            daysContainer.appendChild(dayElement);
        }
    },
    
    // Muda o mês exibido no calendário
    changeMonth(delta) {
        this.currentMonth += delta;
        
        // Ajusta o ano se necessário
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        
        // Renderiza o calendário novamente
        this.renderCalendar();
        
        // Limpa os horários se houver um dia selecionado
        if (this.selectedDate) {
            document.getElementById('selected-date-display').textContent = 'Selecione uma data para ver os horários disponíveis';
            document.getElementById('time-slots').innerHTML = `
                <div class="time-slot-placeholder">
                    <p class="text-center">Selecione uma data no calendário para ver os horários disponíveis</p>
                </div>
            `;
            this.selectedDate = null;
            this.selectedTime = null;
        }
    },
    
    // Seleciona uma data no calendário
    selectDate(day) {
        // Remove a seleção de todos os dias
        document.querySelectorAll('.calendar-day').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Adiciona a classe de seleção ao dia clicado
        const dayElements = document.querySelectorAll('.calendar-day');
        dayElements.forEach(el => {
            if (el.textContent == day) {
                el.classList.add('selected');
            }
        });
        
        // Armazena a data selecionada
        this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
        
        // Formata a data para exibição
        const formattedDate = this.formatDate(this.selectedDate);
        
        // Atualiza o elemento que mostra a data selecionada
        const dateElement = document.getElementById('selected-date-display');
        if (dateElement) {
            dateElement.textContent = `Horários disponíveis para ${formattedDate}`;
        }
        
        // Carrega os horários disponíveis
        this.loadAvailableTimeSlots();
    },
    
    // Carrega os horários disponíveis para a data selecionada
    loadAvailableTimeSlots() {
        // Simulação de horários disponíveis
        const timeSlots = [
            { time: '09:00', available: true },
            { time: '09:30', available: true },
            { time: '10:00', available: true },
            { time: '10:30', available: false },
            { time: '11:00', available: true },
            { time: '11:30', available: true },
            { time: '13:30', available: true },
            { time: '14:00', available: true },
            { time: '14:30', available: true },
            { time: '15:00', available: false },
            { time: '15:30', available: true },
            { time: '16:00', available: true },
            { time: '16:30', available: true },
            { time: '17:00', available: true },
            { time: '17:30', available: false }
        ];
        
        // Renderiza os horários
        const timeSlotsContainer = document.getElementById('time-slots');
        if (timeSlotsContainer) {
            timeSlotsContainer.innerHTML = '';
            
            timeSlots.forEach(slot => {
                const timeSlotElement = document.createElement('div');
                timeSlotElement.classList.add('time-slot');
                
                if (!slot.available) {
                    timeSlotElement.classList.add('disabled');
                } else {
                    timeSlotElement.addEventListener('click', () => this.selectTime(slot.time));
                }
                
                timeSlotElement.textContent = slot.time;
                timeSlotsContainer.appendChild(timeSlotElement);
            });
        }
    },
    
    // Seleciona um horário
    selectTime(time) {
        // Remove a seleção de todos os horários
        document.querySelectorAll('.time-slot').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Adiciona a classe de seleção ao horário clicado
        const timeElements = document.querySelectorAll('.time-slot');
        timeElements.forEach(el => {
            if (el.textContent === time) {
                el.classList.add('selected');
            }
        });
        
        // Armazena o horário selecionado
        this.selectedTime = time;
        
        console.log('Horário selecionado:', this.selectedTime);
    },
    
    // Atualiza os dados na tela de confirmação
    updateConfirmationData() {
        if (!this.selectedProfessional || !this.selectedServices.length || !this.selectedDate || !this.selectedTime) {
            return;
        }
        
        // Formata a data para exibição
        const formattedDate = this.formatDate(this.selectedDate);
        
        // Atualiza os elementos com os dados selecionados
        document.getElementById('confirm-professional').textContent = this.selectedProfessional.name;
        document.getElementById('confirm-services').textContent = this.selectedServices.map(s => s.name).join(', ');
        document.getElementById('confirm-date').textContent = formattedDate;
        document.getElementById('confirm-time').textContent = this.selectedTime;
        document.getElementById('confirm-duration').textContent = `${this.selectedServices.reduce((total, s) => total + s.duration, 0)} minutos`;
        document.getElementById('confirm-price').textContent = `R$ ${this.selectedServices.reduce((total, s) => total + s.price, 0).toFixed(2)}`;
    },
    
    // Envia o agendamento
    submitBooking() {
        // Verifica se o formulário é válido
        const form = document.getElementById('customer-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Coleta os dados do cliente
        const customerData = {
            name: document.getElementById('customer-name').value,
            phone: document.getElementById('customer-phone').value,
            email: document.getElementById('customer-email').value,
            notes: document.getElementById('customer-notes').value
        };
        
        // Cria o objeto de agendamento
        const bookingData = {
            professionalId: this.selectedProfessional.id,
            serviceIds: this.selectedServices.map(s => s.id),
            date: this.selectedDate,
            time: this.selectedTime,
            customer: customerData,
            companyId: this.companyData.id
        };
        
        console.log('Dados do agendamento:', bookingData);
        
        // Simulação de envio para o servidor
        this.processBooking(bookingData);
    },
    
    // Processa o agendamento (simulação)
    processBooking(bookingData) {
        // Simula uma chamada de API
        console.log('Enviando agendamento para o servidor...');
        
        // Simula um tempo de processamento
        setTimeout(() => {
            // Gera um código aleatório para o agendamento
            const bookingCode = this.generateBookingCode();
            
            // Exibe o código no modal
            document.getElementById('booking-code').textContent = bookingCode;
            
            // Exibe o modal de confirmação
            const confirmationModal = new bootstrap.Modal(document.getElementById('confirmation-modal'));
            confirmationModal.show();
            
            console.log('Agendamento confirmado com o código:', bookingCode);
        }, 1500);
    },
    
    // Gera um código alfanumérico aleatório para o agendamento
    generateBookingCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        
        // Parte alfabética (3 caracteres)
        for (let i = 0; i < 3; i++) {
            code += chars.charAt(Math.floor(Math.random() * 26));
        }
        
        // Parte numérica (6 dígitos)
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * 10) + 26);
        }
        
        return code;
    },
    
    // Formata uma data para o formato DD/MM/YYYY
    formatDate(date) {
        if (!date) return '';
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    }
};

// Função para formatar o número de telefone enquanto o usuário digita
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('customer-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            if (value.length > 2) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            }
            
            if (value.length > 10) {
                value = `${value.slice(0, 10)}-${value.slice(10)}`;
            }
            
            e.target.value = value;
        });
    }
}); 