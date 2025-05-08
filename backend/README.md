# Backend - AgendAI

Este diretório contém o servidor e API do AgendAI, implementado com Node.js, Express e MySQL.

## Estrutura de Arquivos

- `src/` - Código fonte do servidor
  - `server.js` - Arquivo principal do servidor
- `config/` - Configurações do sistema
  - `config.js` - Configurações gerais do servidor
  - `database.sql` - Script SQL para criação e inicialização do banco de dados

## Configuração do Banco de Dados

O sistema utiliza MySQL como banco de dados. O arquivo `config/database.sql` contém o script para:

1. Criar o banco de dados `agendai`
2. Criar as tabelas necessárias
3. Inserir dados iniciais para testes

## Endpoints da API

A API segue uma estrutura RESTful com os seguintes endpoints principais:

- `/api/auth/login` - Autenticação de usuários
- `/api/users` - Gerenciamento de usuários
- `/api/companies` - Gerenciamento de empresas
- `/api/clients` - Gerenciamento de clientes
- `/api/professionals` - Gerenciamento de profissionais
- `/api/services` - Gerenciamento de serviços
- `/api/appointments` - Gerenciamento de agendamentos

## Autenticação e Segurança

- JWT (JSON Web Token) para autenticação
- Bcrypt para criptografia de senhas
- Middleware de verificação de permissões baseado em roles

## Execução do Servidor

Para executar o servidor:

1. Instale as dependências:
   ```
   npm install
   ```

2. Configure o banco de dados:
   ```
   npm run setup-db
   ```

3. Inicie o servidor:
   ```
   npm start
   ```
   
   Para desenvolvimento com reinicialização automática:
   ```
   npm run dev
   ```

## Variáveis de Ambiente

As configurações do servidor podem ser ajustadas através de variáveis de ambiente ou no arquivo `config/config.js`:

- `PORT` - Porta do servidor (padrão: 3001)
- `DB_HOST` - Host do banco de dados MySQL
- `DB_USER` - Usuário do banco de dados
- `DB_PASSWORD` - Senha do banco de dados
- `DB_NAME` - Nome do banco de dados (padrão: agendai)
- `JWT_SECRET` - Chave secreta para geração de tokens JWT 