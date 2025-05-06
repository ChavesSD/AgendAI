/**
 * AgendAI - Aplicação de Agendamento
 * app.js - Arquivo principal da aplicação - Versão Simplificada
 */

// Aplicação principal
const App = {
    // Estado da aplicação
    container: null,
    currentPage: null,
    routes: {
        '/': 'marketing.html',
        '/login': 'login.html',
        'login': 'login.html',
        '/terms': 'terms.html',
        'terms': 'terms.html',
        '/privacy': 'privacy.html',
        'privacy': 'privacy.html',
        '/admin': 'admin-dashboard.html',
        'admin': 'admin-dashboard.html',
        '/admin-dashboard': 'admin-dashboard.html',
        '/company': 'company-dashboard.html',
        'company': 'company-dashboard.html'
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
        
        console.log('AgendAI App inicializado com sucesso!');
    },
    
    // Configurar event listeners
    setupEventListeners() {
        // Listener para mudanças no hash da URL (navegação)
        window.addEventListener('hashchange', () => {
            this.router();
        });
        
        // Listener para cliques em links com atributo data-link
        document.addEventListener('click', (e) => {
            const link = e.target.matches('[data-link]') ? 
                        e.target : 
                        e.target.closest('[data-link]');
            
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                // Redireciona para a nova URL
                window.location.hash = href;
            }
        });
    },
    
    // Roteador da aplicação
    router() {
        // Obtém o hash da URL atual
        let hash = window.location.hash;
        console.log('Hash atual:', hash);
        
        // Se o hash estiver vazio, use a página inicial
        if (!hash || hash === '#') {
            hash = '#/';
        }
        
        // Remove o # do início
        let route = hash.substring(1);
        
        // Verifica se a rota existe
        if (!this.routes[route]) {
            console.log('Rota não encontrada:', route);
            // Tenta outras variações da rota
            if (route.startsWith('/') && route.length > 1) {
                const alternativeRoute = route.substring(1);
                if (this.routes[alternativeRoute]) {
                    route = alternativeRoute;
                }
            } else if (!route.startsWith('/')) {
                const alternativeRoute = '/' + route;
                if (this.routes[alternativeRoute]) {
                    route = alternativeRoute;
                }
            }
        }
        
        // Carrega a view correspondente
        const viewPath = this.routes[route] || 'marketing.html';
        this.loadView(viewPath);
    },
    
    // Carrega uma view
    async loadView(viewPath) {
        try {
            console.log('Carregando página:', viewPath);
            
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
            } else {
                document.title = 'AgendAI - Sistema Inteligente de Agendamento';
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
    },
    
    // Carrega a página de marketing
    loadMarketingPage() {
        this.loadView('marketing.html');
    }
};

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Exporta a aplicação para uso global
window.App = App; 