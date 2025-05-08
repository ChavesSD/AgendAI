/**
 * Componente de menu lateral (sidebar)
 */

const SidebarComponent = {
    // Inicializar o componente
    init() {
        this.setupEventListeners();
        this.highlightActiveMenuItem();
    },
    
    // Configurar ouvintes de eventos
    setupEventListeners() {
        // Botão para recolher/expandir o menu
        const toggleButton = document.getElementById('sidebarToggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', this.toggleSidebar);
        }
        
        // Botão de logout
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', this.handleLogout);
        }
        
        // Itens do menu
        const menuItems = document.querySelectorAll('.sidebar-menu a[data-link]');
        menuItems.forEach(item => {
            item.addEventListener('click', this.handleMenuItemClick);
        });
    },
    
    // Recolher/expandir o menu lateral
    toggleSidebar() {
        const body = document.querySelector('body');
        if (body.classList.contains('sidebar-collapsed')) {
            body.classList.remove('sidebar-collapsed');
            localStorage.setItem('sidebar-collapsed', 'false');
        } else {
            body.classList.add('sidebar-collapsed');
            localStorage.setItem('sidebar-collapsed', 'true');
        }
    },
    
    // Processar clique em item do menu
    handleMenuItemClick(e) {
        // Remover a classe 'active' de todos os itens do menu
        document.querySelectorAll('.sidebar-menu .nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Adicionar a classe 'active' ao item clicado
        const menuItem = e.target.closest('.nav-item');
        if (menuItem) {
            menuItem.classList.add('active');
        }
        
        // Em dispositivos móveis, fechar o menu após o clique
        if (window.innerWidth < 768) {
            document.querySelector('body').classList.add('sidebar-collapsed');
        }
    },
    
    // Destacar o item do menu ativo com base na URL atual
    highlightActiveMenuItem() {
        const currentPath = window.location.hash.slice(1) || '/';
        
        // Remover a classe 'active' de todos os itens do menu
        document.querySelectorAll('.sidebar-menu .nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Encontrar o item do menu correspondente à rota atual
        const menuItems = document.querySelectorAll('.sidebar-menu a[data-link]');
        menuItems.forEach(item => {
            const itemPath = item.getAttribute('href');
            if (itemPath && (itemPath === `#${currentPath}` || (currentPath === '/' && itemPath === '#/'))) {
                item.closest('.nav-item').classList.add('active');
            }
        });
    },
    
    // Processar logout
    handleLogout(e) {
        e.preventDefault();
        
        // Limpar dados de autenticação
        localStorage.removeItem('agendai_auth');
        
        // Redirecionar para a página de login
        window.location.href = '/';
        
        // Forçar reload para limpar qualquer estado
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }
};

// Carregar o estado da sidebar do localStorage
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('sidebar-collapsed') === 'true') {
        document.querySelector('body').classList.add('sidebar-collapsed');
    }
    
    // Inicializar o componente
    SidebarComponent.init();
}); 