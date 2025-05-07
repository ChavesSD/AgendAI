/**
 * AgendAI - Aplicação de Agendamento
 * app.js - Arquivo principal da aplicação - Versão Simplificada
 */

// Aplicação principal
const App = {
    // Estado da aplicação
    container: null,
    currentPage: null,
    currentRoute: null,
    adminViews: ['admin-dashboard.html', 'admin-plans.html', 'admin-companies.html', 
                'admin-users.html', 'admin-professionals.html', 'admin-services.html', 
                'admin-clients.html', 'admin-appointments.html', 'admin-reports.html', 
                'admin-settings.html'],
    routes: {
        '/': 'login.html',
        '/login': 'login.html',
        'login': 'login.html',
        '/terms': 'terms.html',
        'terms': 'terms.html',
        '/privacy': 'privacy.html',
        'privacy': 'privacy.html',
        '/admin': 'admin-dashboard.html',
        'admin': 'admin-dashboard.html',
        '/admin-dashboard': 'admin-dashboard.html',
        '/admin/plans': 'admin-plans.html',
        '/admin/companies': 'admin-companies.html',
        '/admin/users': 'admin-users.html',
        '/admin/professionals': 'admin-professionals.html',
        '/admin/services': 'admin-services.html', 
        '/admin/clients': 'admin-clients.html',
        '/admin/appointments': 'admin-appointments.html',
        '/admin/reports': 'admin-reports.html',
        '/admin/settings': 'admin-settings.html',
        '/company': 'company-dashboard.html',
        'company': 'company-dashboard.html',
        '/company/calendar': 'company-calendar.html',
        '/company-calendar': 'company-calendar.html',
        '/company/appointments': 'company-appointments.html',
        '/company-appointments': 'company-appointments.html',
        '/company/professionals': 'company-professionals.html',
        '/company-professionals': 'company-professionals.html',
        '/company/services': 'company-services.html',
        '/company-services': 'company-services.html',
        '/company/clients': 'company-clients.html',
        '/company-clients': 'company-clients.html'
    },
    
    // Inicialização da aplicação
    init() {
        console.log('Iniciando AgendAI App versão simplificada...');
        
        // Define o container principal
        this.container = document.getElementById('app-container');
        if (!this.container) {
            console.error('Container da aplicação não encontrado!');
            return;
        }

        // Configurar os listeners de eventos
        this.setupEventListeners();
        
        // Inicializar o roteador
        this.router();
        
        // Injetar CSS auxiliar para fixes de navegação
        this.injectNavigationHelperCSS();
        
        console.log('AgendAI App inicializado com sucesso!');
    },
    
    // Injetar CSS auxiliar
    injectNavigationHelperCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .settings-link {
                cursor: pointer !important;
                position: relative;
                z-index: 1000;
            }
            .settings-link:after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1001;
            }
        `;
        document.head.appendChild(style);
    },
    
    // Configurar event listeners
    setupEventListeners() {
        // Listener para mudanças no hash da URL (navegação)
        window.addEventListener('hashchange', (e) => {
            console.log('Hash mudou:', window.location.hash, 'Old URL:', e.oldURL);
            this.router();
        });
        
        // Listeners para o botão de voltar do navegador
        window.addEventListener('popstate', (e) => {
            console.log('Popstate event:', e);
            this.router();
        });

        // Interceptar todos os cliques na página para detectar links de configurações
        document.addEventListener('click', (e) => {
            // Verifica links com href="#/admin/settings" 
            const settingsLink = e.target.closest('a[href="#/admin/settings"]');
            if (settingsLink) {
                console.log('Link de configurações detectado:', settingsLink);
                e.preventDefault();
                e.stopPropagation();
                
                // Adiciona uma classe para identificar que este link foi processado
                settingsLink.classList.add('settings-link-processed');
                
                // Forçar navegação para configurações
                this.forceNavigateToSettings();
                return false;
            }
            
            // Verificar se o clique foi em qualquer elemento dentro de um link do menu lateral com ícone de configurações
            const configIcon = e.target.closest('.list-group-item .fa-cog, .list-group-item .fas.fa-cog');
            if (configIcon) {
                const parentLink = configIcon.closest('a');
                if (parentLink && (parentLink.getAttribute('href') === '#/admin/settings' || 
                                parentLink.textContent.includes('Configurações'))) {
                    console.log('Clique em ícone de configurações detectado');
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Forçar navegação para configurações
                    this.forceNavigateToSettings();
                    return false;
                }
            }
            
            // Verificar se o texto do link inclui "Configurações"
            if (e.target.textContent && e.target.textContent.includes('Configurações')) {
                const linkElement = e.target.closest('a');
                if (linkElement) {
                    console.log('Link com texto "Configurações" detectado');
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Forçar navegação para configurações
                    this.forceNavigateToSettings();
                    return false;
                }
            }
        }, true); // Usar capturing para pegar antes de outros handlers
        
        // Listener para cliques em links com atributo data-link
        document.addEventListener('click', (e) => {
            const link = e.target.matches('[data-link]') ? 
                        e.target : 
                        e.target.closest('[data-link]');
            
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                // Tratamento especial para links de configurações
                if (href && (href.includes('/admin/settings') || href.includes('settings'))) {
                    console.log('Link de configurações com data-link detectado:', href);
                    this.forceNavigateToSettings();
                    return;
                }
                
                // Redireciona para a nova URL
                window.location.hash = href;
            }
        });
    },
    
    // Força a navegação para a página de configurações
    forceNavigateToSettings() {
        console.log('Forçando navegação para configurações');
        
        // Atualiza o hash sem usar o router padrão
        window.location.hash = '#/admin/settings';
        
        // Carrega diretamente a view de configurações
        setTimeout(() => {
            this.loadView('admin-settings.html');
            // Atualiza o menu lateral
            setTimeout(() => {
                this.updateSidebarActiveItem();
            }, 100);
        }, 50);
    },
    
    // Atualiza o estado do menu lateral com base na rota atual
    updateSidebarActiveItem() {
        const sidebarLinks = document.querySelectorAll('#sidebar-wrapper .list-group-item');
        if (!sidebarLinks || sidebarLinks.length === 0) return;
        
        // Remove a classe ativa de todos os links
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Normaliza a rota atual para comparação
        let currentHash = window.location.hash.substring(1);
        if (!currentHash.startsWith('/')) {
            currentHash = '/' + currentHash;
        }
        
        console.log('Atualizando menu lateral para rota:', currentHash);
        
        // Caso especial para configurações
        if (currentHash.includes('settings')) {
            const settingsLink = document.querySelector('#sidebar-wrapper a[href="#/admin/settings"]');
            if (settingsLink) {
                // Remove a classe ativa de todos os links
                sidebarLinks.forEach(link => link.classList.remove('active'));
                // Adiciona a classe ativa ao link de configurações
                settingsLink.classList.add('active');
                return;
            }
        }
        
        // Para outras rotas, encontra o link correspondente e adiciona a classe ativa
        let matchFound = false;
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href === window.location.hash || href.substring(1) === currentHash)) {
                link.classList.add('active');
                matchFound = true;
            }
        });
        
        // Se for a rota principal do admin e nenhum outro item foi marcado
        if (!matchFound && (currentHash === '/admin' || currentHash === 'admin')) {
            // Seleciona o primeiro item (Dashboard)
            const dashboardLink = document.querySelector('#sidebar-wrapper .list-group-item[href="#/admin"]');
            if (dashboardLink) {
                dashboardLink.classList.add('active');
            }
        }
    },
    
    // Roteador da aplicação
    router() {
        console.log('Router iniciado...');
        
        // Obtém a rota a partir do hash da URL
        let hash = window.location.hash;
        console.log('Hash atual:', hash);
        
        // Se não houver hash, redireciona para a página inicial
        if (!hash) {
            console.log('Sem hash, redirecionando para a página inicial');
            window.location.hash = '#/login';
            return;
        }
        
        // Remove o # inicial
        let route = hash.substring(1);
        
        // Corrige rotas malformadas
        if (!route.startsWith('/')) {
            route = '/' + route;
        }
        
        console.log('Rota processada:', route);
        
        // Verifica se a rota existe
        if (!this.routes[route]) {
            console.log('Rota não encontrada, verificando alternativas...');
            
            // Tenta encontrar variações da rota
            const variationsToTry = [
                route,
                route.toLowerCase(),
                route.replace(/^\/+/, '/'),
                route.replace(/\/+$/, ''),
                route.replace(/^\/+/, '/').replace(/\/+$/, '')
            ];
            
            // Se a rota termina com uma barra, tenta também sem a barra
            if (route.endsWith('/')) {
                variationsToTry.push(route.slice(0, -1));
            }
            
            // Tentar cada variação
            for (const variation of variationsToTry) {
                console.log('Tentando variação:', variation);
                if (this.routes[variation]) {
                    console.log('Rota alternativa encontrada:', variation);
                    route = variation;
                    break;
                }
            }
        }
        
        // Carrega a view correspondente
        let viewPath = this.routes[route];
        if (!viewPath) {
            console.error(`Rota não encontrada: ${route}`);
            viewPath = 'login.html';
        }
        
        // Verificar se a rota é para uma página de admin
        const isAdminPage = this.adminViews.includes(viewPath);
        const isSettingsPage = viewPath === 'admin-settings.html';
        
        this.currentRoute = route;
        this.loadView(viewPath);
    },
    
    // Carrega uma view
    async loadView(viewPath) {
        try {
            console.log('Carregando página:', viewPath);
            
            // Se alguém tentar carregar marketing.html, redireciona para login
            if (viewPath === 'marketing.html') {
                console.log('Redirecionando de marketing.html para login.html');
                window.location.hash = '#/login';
                return;
            }
            
            // Caso especial para a página de configurações
            const isSettingsPage = viewPath === 'admin-settings.html';
            if (isSettingsPage) {
                console.log('Carregando página de configurações...');
            }
            
            // Flag para verificar se estamos em uma página de administração
            const isAdminPage = this.adminViews.includes(viewPath);
            
            // Adicionar parâmetro para evitar cache
            const timestamp = new Date().getTime();
            const noCacheViewPath = `views/${viewPath}?nocache=${timestamp}`;
            
            const response = await fetch(noCacheViewPath);
            
            if (!response.ok) {
                throw new Error(`Erro ao carregar a página: ${response.status} ${response.statusText}`);
            }
            
            const viewContent = await response.text();
            this.container.innerHTML = viewContent;
            
            console.log('Página carregada com sucesso:', viewPath);
            
            // Define o título da página com base na view carregada
            if (viewPath.includes('login')) {
                document.title = 'Login - AgendAI';
            } else if (viewPath.includes('terms')) {
                document.title = 'Termos de Serviço - AgendAI';
            } else if (viewPath.includes('privacy')) {
                document.title = 'Política de Privacidade - AgendAI';
            } else if (viewPath.includes('admin-')) {
                // Define um título específico para páginas de administração
                const pageName = viewPath.replace('admin-', '').replace('.html', '');
                const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
                document.title = `${formattedPageName} - Admin AgendAI`;
            } else {
                document.title = 'AgendAI - Sistema Inteligente de Agendamento';
            }
            
            // Se for uma página de admin, atualiza o menu lateral
            if (isAdminPage) {
                setTimeout(() => {
                    this.updateSidebarActiveItem();
                }, 100);
                
                // Add special handlers for all admin settings links
                setTimeout(() => {
                    this.setupAdminSettingsLinks();
                }, 300);
                
                // Configurações especiais para a página de configurações
                if (isSettingsPage) {
                    console.log('Inicializando componentes da página de configurações');
                    this.setupSettingsPage();
                }
            }
            
            // Se for a página de login, configurar o formulário
            if (viewPath.includes('login')) {
                this.setupLoginForm();
            }
            
        } catch (error) {
            console.error('Erro ao carregar a página:', error);
            this.container.innerHTML = `<div class="alert alert-danger">Não foi possível carregar a página: ${error.message}</div>`;
        }
    },
    
    // Configurar links de configurações em todas as páginas admin
    setupAdminSettingsLinks() {
        // Procurar por links de configurações em todas as páginas administrativas
        const settingsLinks = document.querySelectorAll('a[href="#/admin/settings"]');
        
        settingsLinks.forEach(link => {
            // Evita processar o mesmo link mais de uma vez
            if (link.getAttribute('data-settings-processed') === 'true') {
                return;
            }
            
            console.log('Configurando link de configurações:', link);
            
            // Remove o atributo data-link para evitar conflitos
            link.removeAttribute('data-link');
            
            // Adicionar classe visual
            link.classList.add('settings-link');
            
            // Adicionar handler direto
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Link de configurações clicado');
                
                // Forçar navegação
                this.forceNavigateToSettings();
                return false;
            });
            
            // Marcar como processado
            link.setAttribute('data-settings-processed', 'true');
        });
    },
    
    // Configura a página de configurações
    setupSettingsPage() {
        // Inicializa os tabs de Bootstrap
        const tabsElement = document.getElementById('settingsTabs');
        if (tabsElement) {
            console.log('Inicializando tabs de configurações');
            
            // Adiciona event listeners para os botões do tab
            const tabButtons = document.querySelectorAll('#settingsTabs button[data-bs-toggle="tab"]');
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const targetTab = document.querySelector(this.getAttribute('data-bs-target'));
                    
                    // Remove classes ativas de todas as tabs
                    document.querySelectorAll('#settingsTabs .tab-pane').forEach(tab => {
                        tab.classList.remove('show', 'active');
                    });
                    
                    document.querySelectorAll('#settingsTabs .nav-link').forEach(link => {
                        link.classList.remove('active');
                        link.setAttribute('aria-selected', 'false');
                    });
                    
                    // Ativa a tab clicada
                    if (targetTab) {
                        targetTab.classList.add('show', 'active');
                        this.classList.add('active');
                        this.setAttribute('aria-selected', 'true');
                    }
                });
            });
            
            // Ativa a primeira tab
            if (tabButtons.length > 0) {
                tabButtons[0].click();
            }
        }
        
        // Configura o botão de salvar configurações
        const saveButton = document.getElementById('save-settings');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                alert('Configurações salvas com sucesso!');
            });
        }
    },
    
    // Configura o formulário de login
    setupLoginForm() {
        console.log('Configurando formulário de login...');
        
        const loginForm = document.getElementById('login-form');
        if (!loginForm) {
            console.error('Formulário de login não encontrado!');
            return;
        }
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Formulário de login enviado');
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            console.log('Dados de login:', { email, password });
            
            // Verifica credenciais
            if ((email === 'admin@agendai.com' && password === 'admin') || 
                (email === 'empresa@agendai.com' && password === 'empresa')) {
                
                // Simula o login bem-sucedido
                const userRole = email.includes('admin') ? 'admin' : 'empresa';
                
                // Salva informações do usuário na sessão
                sessionStorage.setItem('usuario_logado', JSON.stringify({
                    email: email,
                    role: userRole,
                    nome: userRole === 'admin' ? 'Administrador' : 'Empresa Teste'
                }));
                
                // Redireciona com base no tipo de usuário
                if (userRole === 'admin') {
                    alert('Login realizado com sucesso como administrador!');
                    // Redirecionar para o dashboard de administrador
                    window.location.hash = '#/admin';
                } else {
                    alert('Login realizado com sucesso como empresa!');
                    // Redirecionar para o dashboard da empresa
                    window.location.hash = '#/company';
                }
                
            } else {
                // Exibe erro de login
                alert('Email ou senha incorretos. Tente as credenciais de teste mostradas abaixo do formulário.');
            }
        });
    }
};

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Exporta a aplicação para uso global
window.App = App; 