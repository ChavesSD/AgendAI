/**
 * Script para corrigir problemas de autenticação no AgendAI
 * Durante o desenvolvimento, este script adiciona um token temporário para o usuário admin
 */

(function() {
    // Verificar se existe token
    const authData = JSON.parse(localStorage.getItem('agendai_auth') || '{}');
    
    // Verificar se estamos em uma página de login
    const isLoginPage = window.location.hash === '#/login' || window.location.pathname === '/login';
    
    // Se estivermos na página de login e já tivermos um token, redirecionar para o dashboard
    if (isLoginPage && authData.token) {
        console.log('Usuário já autenticado e na página de login. Redirecionando para dashboard...');
        window.location.hash = '#/admin/dashboard';
        return;
    }
    
    if (!authData.token) {
        console.log('Token não encontrado. Criando token temporário para desenvolvimento...');
        
        // Para desenvolvimento: criar token temporário para usuário admin
        const tempAuthData = {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJlbWFpbCI6ImFkbWluQGFnZW5kYWkuY29tIiwicm9sZSI6ImFkbWluIiwiY29tcGFueUlkIjpudWxsLCJpYXQiOjE3MTUzODM1ODYsImV4cCI6MTc0NjkyMzU4Nn0.OeTKinXsK2KHIyuaZef8xDWc19o3o2V3gHhwCkJQGSo',
            user: {
                id: 1,
                name: 'Administrador',
                email: 'admin@agendai.com',
                role: 'admin',
                status: 'active',
                companyId: null
            }
        };
        
        localStorage.setItem('agendai_auth', JSON.stringify(tempAuthData));
        console.log('Token temporário de administrador criado para desenvolvimento');
        
        // Redirecionar para o dashboard em vez de recarregar a página inteira
        if (window.location.hash !== '#/admin/dashboard') {
            window.location.hash = '#/admin/dashboard';
        }
    } else {
        console.log('Token de autenticação já existe:', authData.token.substring(0, 20) + '...');
        
        // Verificar se estamos na página inicial ou raiz e redirecionar para o dashboard
        if (window.location.hash === '' || window.location.hash === '#/' || window.location.hash === '#/login') {
            console.log('Redirecionando para o dashboard...');
            window.location.hash = '#/admin/dashboard';
        }
    }
})(); 