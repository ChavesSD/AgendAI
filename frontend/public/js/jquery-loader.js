/**
 * Script para garantir que o jQuery esteja disponível
 * Este script verifica se o jQuery está carregado e, se não estiver, carrega-o dinamicamente
 */

(function() {
    console.log('🔍 Verificando disponibilidade do jQuery...');
    
    // Verificar se o jQuery já está disponível
    if (typeof jQuery !== 'undefined') {
        console.log('✅ jQuery já está disponível, versão: ' + jQuery.fn.jquery);
        return;
    }
    
    console.log('⚠️ jQuery não encontrado! Carregando dinamicamente...');
    
    // Função para carregar script dinamicamente
    function carregarScript(url, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.async = true;
        
        // Callback quando o script for carregado
        if (callback) {
            script.onload = function() {
                callback();
            };
        }
        
        // Adicionar o script ao head
        document.head.appendChild(script);
    }
    
    // Carregar jQuery
    carregarScript('https://code.jquery.com/jquery-3.6.0.min.js', function() {
        console.log('✅ jQuery carregado com sucesso, versão: ' + jQuery.fn.jquery);
        
        // Carregar Bootstrap JS se necessário
        if (typeof bootstrap === 'undefined') {
            console.log('⚠️ Bootstrap JS não encontrado! Carregando dinamicamente...');
            carregarScript('https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js', function() {
                console.log('✅ Bootstrap JS carregado com sucesso');
            });
        }
    });
    
    console.log('✅ Script de carregamento do jQuery inicializado com sucesso');
})(); 