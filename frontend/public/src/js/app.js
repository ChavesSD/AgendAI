/**
 * AgendAI - App SPA
 * Sistema de Agendamento Inteligente
 */

console.log('Inicializando aplicação AgendAI SPA...');

// Configuração da aplicação SPA
const App = {
    // Elemento onde o conteúdo será renderizado
    contentEl: null,
    
    // Estado global da aplicação
    state: {
        isAuthenticated: false,
        userType: null, // 'admin' ou 'company'
        userData: null,
        currentView: null,
        // Rastrear scripts carregados para evitar carregamentos duplicados
        loadedScripts: new Set()
    },
    
    // Inicialização da aplicação
    init() {
        console.log('App.init() - Iniciando aplicação');
        this.contentEl = document.getElementById('app-content');
        if (!this.contentEl) {
            console.error('Elemento #app-content não encontrado');
            return;
        }
        console.log('Elemento app-content encontrado');
        
        // Recuperar estado salvo
        this.loadFromLocalStorage();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Se não estiver autenticado, forçar redirecionamento para login
        if (!this.state.isAuthenticated) {
            console.log('Usuário não autenticado, definindo rota inicial para login');
            window.location.hash = '#/login';
        }
        
        // Iniciar roteamento
        this.router();
        
        // Expor métodos públicos para serem usados em scripts inline
        window.App = {
            navigate: this.navigate.bind(this),
            logout: this.logout.bind(this)
        };
        
        console.log('Inicialização concluída');
    },
    
    // Configurar ouvintes de eventos
    setupEventListeners() {
        // Lidar com navegação sem recarregar a página
        document.addEventListener('click', (e) => {
            // Verificar se o clique foi em um link de navegação com data-link
            const link = e.target.closest('[data-link]');
            if (link) {
                e.preventDefault();
                const url = link.getAttribute('href') || link.getAttribute('data-href');
                console.log(`Clique em link de navegação: ${url}`);
                if (url && url.startsWith('#')) {
                    history.pushState(null, null, url);
                    this.router();
                } else if (url) {
                    this.navigate(url);
                }
            }
            
            // Verificar se o clique foi no botão de logout
            const logoutButton = e.target.closest('#logout-button');
            if (logoutButton) {
                e.preventDefault();
                console.log('Botão de logout clicado');
                this.logout();
            }
        });
        
        // Lidar com navegação pelo histórico (botões voltar/avançar)
        window.addEventListener('popstate', () => {
            console.log('Evento popstate detectado');
            this.router();
        });
    },
    
    // Carregar dados salvos do localStorage
    loadFromLocalStorage() {
        console.log('Carregando dados do localStorage...');
        try {
            const authData = localStorage.getItem('agendai_auth');
            console.log('Dados encontrados:', authData);
            
            if (authData) {
                const auth = JSON.parse(authData);
                console.log('Dados parseados:', auth);
                
                if (auth && auth.userType && auth.userData) {
                    this.state.isAuthenticated = true;
                    this.state.userType = auth.userType;
                    this.state.userData = auth.userData;
                    console.log('Autenticação restaurada com sucesso:', this.state.userType);
                } else {
                    console.error('Formato de dados inválido no localStorage');
                    localStorage.removeItem('agendai_auth');
                }
            } else {
                console.log('Nenhum dado de autenticação encontrado');
            }
        } catch (error) {
            console.error('Erro ao carregar dados de autenticação:', error);
            localStorage.removeItem('agendai_auth');
        }
    },
    
    // Salvar dados no localStorage
    saveToLocalStorage() {
        try {
            const authData = {
                userType: this.state.userType,
                userData: this.state.userData
            };
            
            const jsonData = JSON.stringify(authData);
            console.log('Dados a serem salvos no localStorage:', jsonData);
            
            localStorage.setItem('agendai_auth', jsonData);
            console.log('Dados salvos com sucesso');
        } catch (error) {
            console.error('Erro ao salvar dados no localStorage:', error);
        }
    },
    
    // Roteador simplificado
    router() {
        const path = window.location.hash.slice(1) || '/';
        console.log(`Router - Caminho atual: ${path}`);
        console.log(`Router - Estado de autenticação: ${this.state.isAuthenticated}`);
        console.log(`Router - Tipo de usuário: ${this.state.userType}`);
        
        // Debug para ajudar o usuário
        console.log(`DEBUG - window.location.hash: ${window.location.hash}`);
        console.log(`DEBUG - window.location.pathname: ${window.location.pathname}`);
        
        // Evitar recarregar a mesma view se já estiver nela
        if (path === this.state.currentPath) {
            console.log('Já estamos nesta rota, evitando recarga');
            return;
        }
        
        // Adicionar uma mensagem de carregamento para o usuário
        this.contentEl.innerHTML = `
            <div class="d-flex justify-content-center align-items-center min-vh-100">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                    <p class="mt-3">Navegando para ${path}...</p>
                </div>
            </div>
        `;
        
        // Atualizar caminho atual
        this.state.currentPath = path;
        
        // Verificar se o usuário está autenticado para acessar rotas protegidas
        if (!this.state.isAuthenticated && !['/', '/login', '/terms', '/privacy'].includes(path)) {
            console.log('Usuário não autenticado, redirecionando para login');
            // Redirecionar para login se não estiver autenticado e tentar acessar página protegida
            history.replaceState(null, null, '#/login');
            this.renderLogin();
            return;
        }
        
        // Rotas públicas sempre acessíveis
        if (path === '/' || path === '/login') {
            // Se já estiver autenticado, redirecionar para o dashboard apropriado
            if (this.state.isAuthenticated) {
                console.log('Usuário já autenticado, redirecionando para dashboard');
                const dashboardPath = this.state.userType === 'admin' ? '#/admin/dashboard' : '#/company/dashboard';
                history.replaceState(null, null, dashboardPath);
                
                if (this.state.userType === 'admin') {
                    this.loadView('admin-dashboard');
                } else {
                    this.loadView('company-dashboard');
                }
            } else {
                // Para a rota raiz '/', redirecionar para login
                if (path === '/') {
                    console.log('Rota raiz acessada sem autenticação, redirecionando para login');
                    history.replaceState(null, null, '#/login');
                }
                this.renderLogin();
            }
            return;
        }
        
        if (path === '/terms') {
            this.loadView('terms');
            return;
        }
        
        if (path === '/privacy') {
            this.loadView('privacy');
            return;
        }
        
        // Dashboard do admin
        if (path === '/admin' || path === '/admin/dashboard') {
            if (this.checkAccess('admin')) {
                this.loadView('admin-dashboard');
            }
            return;
        }
        
        // Dashboard da empresa
        if (path === '/company' || path === '/company/dashboard') {
            if (this.checkAccess('company')) {
                this.loadView('company-dashboard');
            }
            return;
        }
        
        // Outras rotas da empresa
        if (path.startsWith('/company/')) {
            if (this.checkAccess('company')) {
                const viewName = path.substring(1); // Remove o / inicial
                console.log(`Carregando view da empresa: ${viewName}`);
                
                // Ajuste para lidar com rotas específicas
                const specificRoutes = {
                    'company/scheduling': 'company-scheduling',
                    'company/reports': 'company-reports',
                    'company/plan': 'company-plan',
                    'company/settings': 'company-settings',
                    'company/appointments': 'company-appointments',
                    'company/calendar': 'company-calendar',
                    'company/services': 'company-services',
                    'company/professionals': 'company-professionals',
                    'company/clients': 'company-clients'
                };
                
                if (specificRoutes[viewName]) {
                    console.log(`Rota específica encontrada: ${specificRoutes[viewName]}`);
                    this.loadView(specificRoutes[viewName]);
                } else {
                    this.loadView(viewName);
                }
            }
            return;
        }
        
        // Outras rotas do admin
        if (path.startsWith('/admin/')) {
            if (this.checkAccess('admin')) {
                const viewName = path.substring(1); // Remove o / inicial
                console.log(`Carregando view do admin: ${viewName}`);
                
                // Ajuste para lidar com rotas específicas de admin
                const specificAdminRoutes = {
                    'admin/plans': 'admin-plans',
                    'admin/appointments': 'admin-appointments',
                    'admin/services': 'admin-services',
                    'admin/users': 'admin-users',
                    'admin/professionals': 'admin-professionals',
                    'admin/reports': 'admin-reports',
                    'admin/clients': 'admin-clients',
                    'admin/companies': 'admin-companies',
                    'admin/settings': 'admin-settings'
                };
                
                if (specificAdminRoutes[viewName]) {
                    console.log(`Rota específica de admin encontrada: ${specificAdminRoutes[viewName]}`);
                    this.loadView(specificAdminRoutes[viewName]);
                } else {
                    this.loadView(viewName);
                }
            }
            return;
        }
        
        // Rota não encontrada
        console.error(`Rota não encontrada: ${path}`);
        this.loadView('404');
    },
    
    // Verificar se o usuário tem acesso a determinada área
    checkAccess(requiredType) {
        console.log(`Verificando acesso: requer=${requiredType}, atual=${this.state.userType}`);
        
        if (!this.state.isAuthenticated) {
            console.log('Usuário não autenticado, redirecionando para login');
            history.replaceState(null, null, '#/login');
            this.renderLogin();
            return false;
        }
        
        if (this.state.userType !== requiredType) {
            console.log(`Tipo de usuário incorreto, redirecionando para dashboard de ${this.state.userType}`);
            // Redirecionar para o dashboard correto se tentar acessar área não permitida
            const redirectPath = this.state.userType === 'admin' ? '#/admin/dashboard' : '#/company/dashboard';
            history.replaceState(null, null, redirectPath);
            
            // Carregar a view apropriada diretamente
            if (this.state.userType === 'admin') {
                this.loadView('admin-dashboard');
            } else {
                this.loadView('company-dashboard');
            }
            return false;
        }
        
        console.log('Acesso permitido');
        return true;
    },
    
    // Renderizar a página de login
    renderLogin() {
        this.state.currentView = 'login';
        this.loadView('login', () => {
            // Configurar o formulário de login após carregar a view
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleLogin();
                });
            }
            
            // Configurar o formulário de registro
            const registerForm = document.getElementById('register-form');
            if (registerForm) {
                registerForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleRegister();
                });
            }
        });
    },
    
    // Carregar uma view
    loadView(viewName, callback) {
        this.state.currentView = viewName;
        console.log(`LoadView - Carregando view: ${viewName}`);
        
        // Determinar o caminho correto para a view baseado no nome
        let viewPath;
        
        if (viewName.startsWith('admin-')) {
            // Para views de admin, buscar na pasta admin
            const adminViewName = viewName.replace('admin-', '');
            viewPath = `/public/views/admin/admin-${adminViewName}.html`;
        } else if (viewName.startsWith('company-')) {
            // Para views de empresa, buscar na pasta company
            const companyViewName = viewName.replace('company-', '');
            viewPath = `/public/views/company/company-${companyViewName}.html`;
        } else {
            // Para outras views (login, terms, privacy, etc.)
            viewPath = `/public/views/${viewName}.html`;
        }
        
        console.log(`Buscando view em: ${viewPath}`);
        
        // Adicionar uma mensagem de carregamento para o usuário
        this.contentEl.innerHTML = `
            <div class="d-flex justify-content-center align-items-center min-vh-100">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                    <p class="mt-3">Carregando ${this.formatViewName(viewName)}...</p>
                </div>
            </div>
        `;

        fetch(viewPath)
            .then(response => {
                if (!response.ok) {
                    console.error(`Erro HTTP ao carregar view: ${response.status}`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log('View recebida com sucesso');
                return response.text();
            })
            .then(html => {
                try {
                    console.log('Conteúdo da view recebido, tamanho:', html.length);
                    
                    // Extrair apenas o conteúdo da div principal (sem scripts)
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    
                    // Pegar o primeiro elemento div (assumindo que é o container principal)
                    const viewContent = tempDiv.querySelector('div');
                    
                    if (viewContent) {
                        console.log('Conteúdo da view encontrado, renderizando...');
                        // Atualizar o título da página
                        document.title = `AgendAI - ${this.formatViewName(viewName)}`;
                        
                        // Renderizar o conteúdo
                        this.contentEl.innerHTML = '';
                        this.contentEl.appendChild(viewContent);
                        
                        // Extrair scripts da view
                        const scripts = tempDiv.querySelectorAll('script');
                        console.log(`Encontrados ${scripts.length} scripts na view`);
                        
                        // Função para executar scripts em sequência
                        const executeScripts = (index) => {
                            if (index >= scripts.length) {
                                console.log('Todos os scripts executados');
                                
                                // Inicializar dropdowns do Bootstrap depois que todos os scripts foram carregados
                                if (typeof bootstrap !== 'undefined') {
                                    try {
                                        // Inicializar todos os dropdowns
                                        const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
                                        dropdownElementList.map(function (dropdownToggleEl) {
                                            return new bootstrap.Dropdown(dropdownToggleEl);
                                        });
                                        console.log('Dropdowns do Bootstrap inicializados');
                                    } catch (err) {
                                        console.error('Erro ao inicializar dropdowns:', err);
                                    }
                                }
                                
                                // Verificar se é a view do dashboard da empresa e inicializar os gráficos
                                if (viewName === 'company-dashboard') {
                                    this.initCompanyDashboardCharts();
                                }
                                
                                // Verificar se é a view do dashboard do admin e inicializar os gráficos
                                if (viewName === 'admin-dashboard') {
                                    console.log('Inicializando gráficos do dashboard administrativo');
                                    // Inicializar gráficos do dashboard administrativo (similar ao company-dashboard)
                                    this.initAdminDashboardCharts();
                                }
                                
                                // Executar callback se existir
                                if (callback && typeof callback === 'function') {
                                    console.log('Executando callback da view');
                                    setTimeout(callback, 100); // Pequeno atraso para garantir que tudo esteja pronto
                                }
                                
                                console.log('View renderizada com sucesso');
                                return;
                            }
                            
                            const script = scripts[index];
                            console.log(`Executando script ${index + 1}/${scripts.length}`);
                            
                            // Se for um script externo com src
                            if (script.src) {
                                // Verificar se já foi carregado
                                if (this.state.loadedScripts.has(script.src)) {
                                    console.log(`Script já carregado: ${script.src}`);
                                    executeScripts(index + 1);
                                    return;
                                }
                                
                                const newScript = document.createElement('script');
                                Array.from(script.attributes).forEach(attr => {
                                    newScript.setAttribute(attr.name, attr.value);
                                });
                                
                                newScript.onload = () => {
                                    console.log(`Script carregado: ${script.src}`);
                                    this.state.loadedScripts.add(script.src);
                                    executeScripts(index + 1);
                                };
                                
                                newScript.onerror = (err) => {
                                    console.error(`Erro ao carregar script: ${script.src}`, err);
                                    executeScripts(index + 1); // Continuar mesmo com erro
                                };
                                
                                document.body.appendChild(newScript);
                            }
                            // Se for um script inline
                            else {
                                try {
                                    const newScript = document.createElement('script');
                                    Array.from(script.attributes).forEach(attr => {
                                        newScript.setAttribute(attr.name, attr.value);
                                    });
                                    
                                    newScript.textContent = script.textContent;
                                    document.body.appendChild(newScript);
                                    console.log('Script inline executado com sucesso');
                                } catch (err) {
                                    console.error('Erro ao executar script inline:', err);
                                }
                                
                                // Avançar para o próximo script imediatamente para scripts inline
                                executeScripts(index + 1);
                            }
                        };
                        
                        // Iniciar a execução dos scripts
                        executeScripts(0);
                    } else {
                        console.error('Erro: conteúdo da view não encontrado na resposta HTML');
                        this.displayErrorMessage('Erro ao carregar a página: conteúdo não encontrado');
                    }
                } catch (error) {
                    console.error('Erro ao processar a view:', error);
                    this.displayErrorMessage(`Erro ao processar a página: ${error.message}`);
                }
            })
            .catch(error => {
                console.error('Erro ao carregar a view:', error);
                this.displayErrorMessage(`Erro ao carregar a página: ${error.message}`);
                
                // Carregar a página 404 em caso de erro
                if (viewName !== '404') {
                    this.loadView('404');
                }
            });
    },
    
    // Método para exibir mensagem de erro para o usuário
    displayErrorMessage(message) {
        this.contentEl.innerHTML = `
            <div class="d-flex justify-content-center align-items-center min-vh-100">
                <div class="text-center">
                    <div class="text-danger mb-3">
                        <i class="fas fa-exclamation-triangle fa-3x"></i>
                    </div>
                    <h4 class="text-danger">Erro</h4>
                    <p>${message}</p>
                    <button class="btn btn-primary mt-3" onclick="location.reload()">
                        <i class="fas fa-sync-alt me-2"></i> Tentar novamente
                    </button>
                </div>
            </div>
        `;
    },
    
    // Inicializa os gráficos no dashboard administrativo
    initAdminDashboardCharts() {
        console.log('Inicializando gráficos do dashboard administrativo');
        try {
            // Verificar se Chart.js está disponível
            if (typeof Chart === 'undefined') {
                console.error('Chart.js não está disponível');
                return;
            }
            
            // Gráfico de empresas por planos
            const companiesByPlanChart = document.getElementById('companiesByPlanChart');
            if (companiesByPlanChart) {
                try {
                    console.log('Gráfico de empresas por planos inicializado');
                    
                    // Destruir o gráfico existente se houver
                    if (window.companiesByPlanChartInstance) {
                        window.companiesByPlanChartInstance.destroy();
                    }
                    
                    window.companiesByPlanChartInstance = new Chart(companiesByPlanChart, {
                        type: 'doughnut',
                        data: {
                            labels: [],
                            datasets: [{
                                data: [],
                                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                                hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
                                hoverBorderColor: "rgba(234, 236, 244, 1)",
                            }],
                        },
                        options: {
                            maintainAspectRatio: false,
                            cutout: '70%',
                            plugins: {
                                legend: {
                                    display: false
                                }
                            }
                        }
                    });
                } catch (err) {
                    console.error('Erro ao inicializar gráfico de empresas por planos:', err);
                }
            }
            
            // Gráfico de empresas cadastradas por mês
            const companiesByMonthChart = document.getElementById('companiesMonthlyChart');
            if (companiesByMonthChart) {
                try {
                    console.log('Gráfico de empresas por mês inicializado');
                    
                    // Destruir o gráfico existente se houver
                    if (window.companiesByMonthChartInstance) {
                        window.companiesByMonthChartInstance.destroy();
                    }
                    
                    window.companiesByMonthChartInstance = new Chart(companiesByMonthChart, {
                        type: 'line',
                        data: {
                            labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
                            datasets: [{
                                label: "Empresas",
                                lineTension: 0.3,
                                backgroundColor: "rgba(78, 115, 223, 0.05)",
                                borderColor: "rgba(78, 115, 223, 1)",
                                pointRadius: 3,
                                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                                pointBorderColor: "rgba(78, 115, 223, 1)",
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                                pointHitRadius: 10,
                                pointBorderWidth: 2,
                                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            }],
                        },
                        options: {
                            maintainAspectRatio: false,
                            layout: {
                                padding: {
                                    left: 10,
                                    right: 25,
                                    top: 25,
                                    bottom: 0
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                } catch (err) {
                    console.error('Erro ao inicializar gráfico de empresas por mês:', err);
                }
            }
        } catch (error) {
            console.error('Erro geral ao inicializar gráficos do dashboard administrativo:', error);
        }
    },
    
    // Inicializa os gráficos no dashboard da empresa
    initCompanyDashboardCharts() {
        console.log('Inicializando gráficos do dashboard da empresa');
        try {
            // Verificar se Chart.js está disponível
            if (typeof Chart === 'undefined') {
                console.error('Chart.js não está disponível');
                return;
            }
            
            // Esperar um momento para garantir que o DOM esteja completamente atualizado
            setTimeout(() => {
                // Gráfico de serviços
                const servicesCtx = document.getElementById('servicesChart');
                if (servicesCtx) {
                    try {
                        // Destruir o gráfico existente se houver
                        if (window.servicesChartInstance) {
                            window.servicesChartInstance.destroy();
                        }
                        
                        window.servicesChartInstance = new Chart(servicesCtx, {
                            type: 'doughnut',
                            data: {
                                labels: [],
                                datasets: [{
                                    data: [],
                                    backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
                                    hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a', '#be2617'],
                                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                                }],
                            },
                            options: {
                                maintainAspectRatio: false,
                                cutout: '70%',
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            }
                        });
                        console.log('Gráfico de serviços inicializado');
                    } catch (err) {
                        console.error('Erro ao inicializar gráfico de serviços:', err);
                    }
                }
                
                // Gráfico de agendamentos por dia da semana
                const weeklyAppointmentsCtx = document.getElementById('weeklyAppointmentsChart');
                if (weeklyAppointmentsCtx) {
                    try {
                        // Destruir o gráfico existente se houver
                        if (window.weeklyAppointmentsChartInstance) {
                            window.weeklyAppointmentsChartInstance.destroy();
                        }
                        
                        window.weeklyAppointmentsChartInstance = new Chart(weeklyAppointmentsCtx, {
                            type: 'line',
                            data: {
                                labels: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
                                datasets: [{
                                    label: "Agendamentos",
                                    lineTension: 0.3,
                                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                                    borderColor: "rgba(78, 115, 223, 1)",
                                    pointRadius: 3,
                                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                                    pointBorderColor: "rgba(78, 115, 223, 1)",
                                    pointHoverRadius: 5,
                                    pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                                    pointHitRadius: 10,
                                    pointBorderWidth: 2,
                                    data: [0, 0, 0, 0, 0, 0, 0],
                                }],
                            },
                            options: {
                                maintainAspectRatio: false,
                                layout: {
                                    padding: {
                                        left: 10,
                                        right: 25,
                                        top: 25,
                                        bottom: 0
                                    }
                                },
                                scales: {
                                    x: {
                                        grid: {
                                            display: false,
                                            drawBorder: false
                                        },
                                        ticks: {
                                            maxTicksLimit: 7
                                        }
                                    },
                                    y: {
                                        ticks: {
                                            maxTicksLimit: 5,
                                            padding: 10,
                                        },
                                        grid: {
                                            color: "rgb(234, 236, 244)",
                                            zeroLineColor: "rgb(234, 236, 244)",
                                            drawBorder: false,
                                            borderDash: [2],
                                            zeroLineBorderDash: [2]
                                        }
                                    },
                                },
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            }
                        });
                        console.log('Gráfico de agendamentos semanais inicializado');
                    } catch (err) {
                        console.error('Erro ao inicializar gráfico de agendamentos semanais:', err);
                    }
                }
            }, 200);
        } catch (err) {
            console.error('Erro durante inicialização dos gráficos:', err);
        }
    },
    
    // Formatar o nome da view para exibir no título
    formatViewName(viewName) {
        return viewName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },
    
    // Processar o login
    handleLogin() {
        console.log('Iniciando processo de login...');
        const emailEl = document.getElementById('email');
        const passwordEl = document.getElementById('password');
        const errorEl = document.getElementById('login-error');
        
        if (!emailEl || !passwordEl) {
            console.error('Elementos de formulário não encontrados');
            return;
        }
        
        const email = emailEl.value.trim();
        const password = passwordEl.value;
        
        // Limpar mensagem de erro
        if (errorEl) errorEl.classList.add('d-none');
        
        // Validação simples
        if (!email || !password) {
            console.error('Dados de formulário incompletos');
            if (errorEl) {
                errorEl.textContent = 'Preencha todos os campos';
                errorEl.classList.remove('d-none');
            }
            return;
        }
        
        console.log('Verificando credenciais...', email);
        
        try {
            // Simulação de login simplificada
            if (email === 'admin@agendai.com' && password === 'admin') {
                console.log('Login de admin aceito');
                
                // Atualizar o estado da aplicação
                this.state.isAuthenticated = true;
                this.state.userType = 'admin';
                this.state.userData = {
                    id: 1,
                    name: 'Administrador',
                    email: 'admin@agendai.com',
                    role: 'admin'
                };
                
                // Salvar no localStorage
                this.saveToLocalStorage();
                
                // Redirecionar para dashboard
                console.log('Redirecionando para dashboard admin');
                history.replaceState(null, null, '#/admin/dashboard');
                this.loadView('admin-dashboard');
                
            } else if (email === 'empresa@agendai.com' && password === 'empresa') {
                console.log('Login de empresa aceito');
                
                // Atualizar o estado da aplicação
                this.state.isAuthenticated = true;
                this.state.userType = 'company';
                this.state.userData = {
                    id: 2,
                    name: 'Empresa Demo',
                    email: 'empresa@agendai.com',
                    role: 'company',
                    companyId: 1,
                    companyName: 'Empresa Demonstração'
                };
                
                // Salvar no localStorage
                this.saveToLocalStorage();
                
                // Redirecionar para dashboard
                console.log('Redirecionando para dashboard empresa');
                history.replaceState(null, null, '#/company/dashboard');
                this.loadView('company-dashboard');
                
            } else {
                // Login falhou
                console.error('Credenciais inválidas');
                if (errorEl) {
                    errorEl.textContent = 'Email ou senha inválidos';
                    errorEl.classList.remove('d-none');
                }
            }
        } catch (error) {
            console.error('Erro durante o processo de login:', error);
            if (errorEl) {
                errorEl.textContent = 'Erro ao processar login. Tente novamente.';
                errorEl.classList.remove('d-none');
            }
        }
    },
    
    // Processar o registro
    handleRegister() {
        // Implementar o registro (futuramente com API)
        alert('Funcionalidade de registro será implementada em breve!');
    },
    
    // Realizar logout
    logout() {
        console.log('Realizando logout...');
        // Limpar dados do localStorage
        localStorage.removeItem('agendai_auth');
        
        // Limpar estado da aplicação
        this.state.isAuthenticated = false;
        this.state.userType = null;
        this.state.userData = null;
        
        // Navegar para a página inicial
        window.location.href = '/';
        
        // Forçar reload da página para limpar qualquer estado remanescente
        setTimeout(() => {
            window.location.reload();
        }, 100);
        
        console.log('Logout concluído');
    },
    
    // Método de navegação que pode ser chamado externamente
    navigate(path) {
        console.log(`Navegando para: ${path}`);
        // Garantir que o caminho comece com /
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        
        // Atualizar a URL com hash
        history.pushState(null, null, '#' + path);
        
        // Acionar o roteador
        this.router();
    }
};

// Inicializar a aplicação quando o DOM estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM carregado, inicializando App...');
        try {
            App.init();
        } catch (error) {
            console.error('Erro ao inicializar a aplicação:', error);
        }
    });
} else {
    // DOM já está carregado
    console.log('DOM já carregado, inicializando App...');
    try {
        App.init();
    } catch (error) {
        console.error('Erro ao inicializar a aplicação:', error);
    }
} 