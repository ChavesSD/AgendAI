/**
 * Script para corrigir problemas de autenticação no AgendAI
 * Durante o desenvolvimento, este script adiciona um token temporário para o usuário admin
 */

(function() {
    // Verificar se existe token
    const authData = JSON.parse(localStorage.getItem('agendai_auth') || '{}');
    
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
        
        // Atualizar página para aplicar o token
        window.location.reload();
    } else {
        console.log('Token de autenticação já existe:', authData.token.substring(0, 20) + '...');
    }
})(); 