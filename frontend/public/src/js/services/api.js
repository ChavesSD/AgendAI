/**
 * Serviço de API para comunicação com o backend
 */

const API = {
    // URL base da API
    baseURL: 'http://localhost:3001/api',
    
    // Método para obter o token de autenticação
    getToken() {
        const authData = localStorage.getItem('agendai_auth');
        if (!authData) return null;
        
        try {
            const auth = JSON.parse(authData);
            return auth.token || null;
        } catch (error) {
            console.error('Erro ao obter token:', error);
            return null;
        }
    },
    
    // Configuração padrão para requisições
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    },
    
    // Método para requisições GET
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Erro na requisição GET para ${endpoint}:`, error);
            throw error;
        }
    },
    
    // Método para requisições POST
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Erro na requisição POST para ${endpoint}:`, error);
            throw error;
        }
    },
    
    // Método para requisições PUT
    async put(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Erro na requisição PUT para ${endpoint}:`, error);
            throw error;
        }
    },
    
    // Método para requisições DELETE
    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Erro na requisição DELETE para ${endpoint}:`, error);
            throw error;
        }
    }
};

// Exportar o serviço de API
window.API = API; 