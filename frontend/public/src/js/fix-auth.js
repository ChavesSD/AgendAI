/**
 * Script para corrigir problemas de autenticação no AgendAI
 * Este script verifica a autenticação, mas não adiciona token automaticamente
 */

(function() {
    // Verificar se existe token
    const authData = JSON.parse(localStorage.getItem('agendai_auth') || '{}');
    
    if (!authData.token) {
        console.log('Token não encontrado. Redirecionando para login...');
        
        // Limpar qualquer dado parcial de autenticação
        localStorage.removeItem('agendai_auth');
        
        // Redirecionar para a página de login
        window.location.hash = '#/login';
    } else {
        console.log('Token de autenticação já existe:', authData.token.substring(0, 20) + '...');
    }
})(); 