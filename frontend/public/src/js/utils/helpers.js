/**
 * Funções de utilidade para o frontend
 */

// Formatar uma data para exibição
function formatDate(date, format = 'dd/MM/yyyy') {
    if (!date) return '';
    
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
        return '';
    }
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    if (format === 'dd/MM/yyyy') {
        return `${day}/${month}/${year}`;
    } else if (format === 'dd/MM/yyyy HH:mm') {
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } else if (format === 'yyyy-MM-dd') {
        return `${year}-${month}-${day}`;
    }
    
    return `${day}/${month}/${year}`;
}

// Salvar dados no localStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
        return false;
    }
}

// Obter dados do localStorage
function getFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erro ao ler do localStorage:', error);
        return null;
    }
}

// Remover dados do localStorage
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Erro ao remover do localStorage:', error);
        return false;
    }
}

// Exportar funções
window.Helpers = {
    formatDate,
    saveToStorage,
    getFromStorage,
    removeFromStorage
}; 