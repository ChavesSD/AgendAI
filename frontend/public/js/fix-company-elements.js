/**
 * Script para corrigir o erro "idLowerCase is not a function" na ocultação de elementos de empresas
 */

(function() {
    console.log('🛠️ Iniciando correção para o erro de ocultação de elementos de empresas...');
    
    // Verificar se estamos na página de planos
    function isPlanPage() {
        return window.location.href.includes('/plans') || 
               window.location.href.includes('/admin/plans') ||
               document.title.includes('Planos') ||
               document.querySelector('h2')?.textContent.includes('Planos');
    }
    
    // Função segura para ocultar elementos de empresas
    function fixOcultarElementosEmpresasSafe() {
        if (!isPlanPage()) return;
        
        console.log('🔍 Aplicando correção para ocultação de elementos de empresas...');
        
        try {
            // Seletor mais seguro para encontrar elementos de empresas
            const elementosEmpresas = Array.from(document.querySelectorAll('*')).filter(el => {
                // Verificar atributos e conteúdo de texto
                const id = el.id ? el.id.toLowerCase() : '';
                const className = el.className && typeof el.className === 'string' ? el.className.toLowerCase() : '';
                const text = el.textContent ? el.textContent.toLowerCase() : '';
                
                // Verificar se contém palavras relacionadas a empresas
                return (
                    id.includes('empresa') || id.includes('company') ||
                    className.includes('empresa') || className.includes('company') ||
                    (text.includes('empresa') && !text.includes('plano')) || 
                    text.includes('cnpj') || 
                    text.includes('razão social')
                );
            });
            
            console.log(`🔍 Encontrados ${elementosEmpresas.length} possíveis elementos de empresas`);
            
            // Ocultar os elementos relacionados a empresas
            elementosEmpresas.forEach(el => {
                // Preservar elementos que são cruciais para o funcionamento da página
                const isCrucial = 
                    el.tagName === 'BODY' || 
                    el.tagName === 'HTML' || 
                    el.tagName === 'MAIN' || 
                    el.tagName === 'SCRIPT' || 
                    el.tagName === 'LINK' ||
                    el.tagName === 'META' ||
                    el.tagName === 'STYLE';
                
                if (!isCrucial) {
                    const parentIsCrucial = 
                        el.parentElement && (
                            el.parentElement.tagName === 'BODY' || 
                            el.parentElement.tagName === 'HTML' || 
                            el.parentElement.tagName === 'MAIN'
                        );
                    
                    // Apenas ocultar, não remover, para evitar problemas
                    if (!parentIsCrucial) {
                        el.style.display = 'none';
                        console.log(`✅ Elemento ocultado: ${el.tagName}${el.id ? '#'+el.id : ''}`);
                    }
                }
            });
            
            // Segunda passada: elementos específicos que podem conter tabela de empresas
            const tabelasEmpresas = Array.from(document.querySelectorAll('table')).filter(table => {
                // Verificar cabeçalhos de tabela para identificar tabelas de empresas
                const headers = Array.from(table.querySelectorAll('th')).map(th => 
                    th.textContent ? th.textContent.toLowerCase() : '');
                
                return headers.some(h => 
                    h.includes('empresa') || 
                    h.includes('cnpj') || 
                    h.includes('razão')
                );
            });
            
            tabelasEmpresas.forEach(tabela => {
                tabela.style.display = 'none';
                console.log(`✅ Tabela de empresas ocultada`);
            });
            
            console.log('✅ Correção para ocultação de elementos de empresas aplicada com sucesso');
            return true;
        } catch (error) {
            console.error('❌ Erro ao ocultar elementos de empresas:', error);
            return false;
        }
    }
    
    // Verificar periodicamente para aplicar a correção
    function verificarEAplicarCorrecao() {
        if (isPlanPage()) {
            fixOcultarElementosEmpresasSafe();
        }
    }
    
    // Inicializar quando o DOM estiver pronto
    function init() {
        // Verificar imediatamente
        verificarEAplicarCorrecao();
        
        // Verificar novamente após algum tempo
        setTimeout(verificarEAplicarCorrecao, 1000);
        setTimeout(verificarEAplicarCorrecao, 2000);
        
        // Adicionar listener para mudanças de URL (SPA navigation)
        window.addEventListener('hashchange', function() {
            console.log('🔄 URL mudou, verificando novamente elementos de empresas...');
            setTimeout(verificarEAplicarCorrecao, 500);
        });
        
        // Monitorar mudanças no DOM
        const observer = new MutationObserver(function(mutations) {
            if (isPlanPage()) {
                fixOcultarElementosEmpresasSafe();
            }
        });
        
        // Observar mudanças no corpo do documento
        observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            attributes: false, 
            characterData: false 
        });
        
        console.log('✅ Monitoramento de elementos de empresas configurado com sucesso');
    }
    
    // Executar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('✅ Script de correção para ocultação de elementos de empresas inicializado');
})(); 