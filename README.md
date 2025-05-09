# AgendAI - Sistema de Agendamento Inteligente

O AgendAI é um sistema de agendamento inteligente para empresas que oferece uma solução completa para gerenciamento de agendamentos, clientes, profissionais e serviços.

## Estrutura do Projeto

O projeto está organizado nas seguintes pastas:

- **frontend**: Contém a interface do usuário (SPA - Single Page Application)
- **backend**: Contém a API e lógica de negócio

## Funcionalidades

- Sistema de autenticação com dois tipos de acesso: Administrador e Empresa
- Gestão de empresas e planos (Admin)
- Gestão de profissionais e serviços
- Gestão de clientes
- Agendamento de serviços
- Calendário interativo
- Relatórios e estatísticas

## Tecnologias Utilizadas

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5
- Chart.js para gráficos
- SPA (Single Page Application)

### Backend
- Node.js com Express
- MySQL para banco de dados
- JWT para autenticação

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos
- Node.js (v14 ou superior)
- MySQL (v5.7 ou superior)

### Instalação e Configuração

1. Clone o repositório:
   ```
   git clone [URL-DO-REPOSITÓRIO]
   cd AgendAI
   ```

2. Configuração do Backend:
   ```
   cd backend
   npm install
   ```

3. Configurar o banco de dados:
   - Crie um banco de dados MySQL
   - Configure as credenciais no arquivo `backend/config/config.js`
   - Execute o script SQL para criar as tabelas:
   ```
   npm run setup-db
   ```

4. Iniciar o servidor de desenvolvimento:
   ```
   npm run dev
   ```
   
   **IMPORTANTE**: O sistema sempre será executado na porta 3001. Acesse através do endereço:
   http://localhost:3001

## Acessos de Teste

### Acesso Admin
- Email: admin@agendai.com
- Senha: admin

### Acesso Empresa
- Email: empresa@agendai.com
- Senha: empresa

## Licença

Este projeto é para fins educacionais e de demonstração. 