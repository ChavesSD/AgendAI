/**
 * Lógica para a página de login
 */

const LoginView = {
    // Inicializar a página de login
    init() {
        console.log('Inicializando página de login');
        this.setupEventListeners();
    },
    
    // Configurar ouvintes de eventos
    setupEventListeners() {
        // Formulário de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin);
        }
        
        // Formulário de registro
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister);
        }
        
        // Botão de toggle da senha
        const passwordToggle = document.getElementById('eye-icon');
        if (passwordToggle) {
            passwordToggle.parentElement.addEventListener('click', this.togglePassword);
        }
        
        // Checkbox lembrar-me
        const rememberMe = document.getElementById('remember-me');
        if (rememberMe) {
            rememberMe.addEventListener('change', this.saveRememberMe);
        }
    },
    
    // Processar o login
    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('login-error');
        
        // Ocultar mensagem de erro
        if (errorEl) errorEl.classList.add('d-none');
        
        // Validação simples
        if (!email || !password) {
            if (errorEl) {
                errorEl.textContent = 'Preencha todos os campos';
                errorEl.classList.remove('d-none');
            }
            return;
        }
        
        console.log('Processando login para:', email);
        
        // Simulação de login (será substituído pela chamada à API)
        if (email === 'admin@agendai.com' && password === 'admin') {
            // Login de admin
            const authData = {
                userType: 'admin',
                userData: {
                    id: 1,
                    name: 'Administrador',
                    email: 'admin@agendai.com',
                    role: 'admin'
                }
            };
            
            localStorage.setItem('agendai_auth', JSON.stringify(authData));
            window.location.hash = '#/admin/dashboard';
            
        } else if (email === 'empresa@agendai.com' && password === 'empresa') {
            // Login de empresa
            const authData = {
                userType: 'company',
                userData: {
                    id: 2,
                    name: 'Empresa Demo',
                    email: 'empresa@agendai.com',
                    role: 'company',
                    companyId: 1,
                    companyName: 'Empresa Demonstração'
                }
            };
            
            localStorage.setItem('agendai_auth', JSON.stringify(authData));
            window.location.hash = '#/company/dashboard';
            
        } else {
            // Login falhou
            if (errorEl) {
                errorEl.textContent = 'Email ou senha inválidos';
                errorEl.classList.remove('d-none');
            }
        }
    },
    
    // Processar o registro
    handleRegister(e) {
        e.preventDefault();
        alert('Funcionalidade de registro será implementada em breve!');
    },
    
    // Alternar visibilidade da senha
    togglePassword() {
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.getElementById('eye-icon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
    },
    
    // Salvar configuração de lembrar-me
    saveRememberMe() {
        const rememberMe = document.getElementById('remember-me').checked;
        localStorage.setItem('remember-me', rememberMe);
    },
    
    // Carregar configuração de lembrar-me
    loadRememberMe() {
        const rememberMe = localStorage.getItem('remember-me') === 'true';
        const checkbox = document.getElementById('remember-me');
        
        if (checkbox) {
            checkbox.checked = rememberMe;
        }
    }
};

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    LoginView.init();
    LoginView.loadRememberMe();
}); 