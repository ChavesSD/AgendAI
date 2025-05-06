# AgendAI - Sistema de Agendamento Inteligente

O AgendAI é um sistema completo de agendamento online que permite aos clientes agendar serviços e aos administradores gerenciar agendamentos de forma eficiente.

## Tecnologias Utilizadas

### Backend
- Python 3.8+
- Flask (Framework Web)
- SQLAlchemy (ORM)
- PostgreSQL (Banco de Dados)
- Flask-Login (Autenticação)
- Flask-Migrate (Migrações de Banco de Dados)
- JWT (JSON Web Tokens)

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Chart.js (Gráficos)
- Flatpickr (Seleção de data)

## Estrutura do Projeto

O projeto está organizado em duas partes principais:

```
AgendAI/
├── backend/           # Backend Python com Flask
│   ├── app/           # Código da aplicação
│   ├── config.py      # Configurações
│   ├── run.py         # Script para iniciar a aplicação
│   └── requirements.txt # Dependências Python
└── frontend/          # Frontend HTML/CSS/JS
    ├── public/        # Arquivos HTML
    └── src/           # Código fonte
        ├── css/       # Estilos CSS
        ├── js/        # Scripts JavaScript
        └── assets/    # Imagens e outros recursos
```

## Funcionalidades

### Página de Marketing
- Apresentação do sistema
- Formulário de contato
- Informações sobre serviços

### Sistema de Autenticação
- Login
- Registro
- Recuperação de senha

### Área do Administrador
- Dashboard com estatísticas
- Gerenciamento de agendamentos
- Gerenciamento de clientes
- Gerenciamento de serviços

### Área do Cliente
- Dashboard personalizado
- Agendamento de serviços
- Visualização de histórico de agendamentos
- Gerenciamento de perfil

## Como Instalar

### Requisitos
- Python 3.8+
- PostgreSQL
- Node.js (opcional, para desenvolvimento de frontend)

### Backend
1. Clone o repositório
   ```
   git clone https://github.com/seu-usuario/agendai.git
   cd agendai/backend
   ```

2. Crie um ambiente virtual
   ```
   python -m venv venv
   source venv/bin/activate  # No Windows: venv\Scripts\activate
   ```

3. Instale as dependências
   ```
   pip install -r requirements.txt
   ```

4. Configure as variáveis de ambiente
   ```
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

5. Inicialize o banco de dados
   ```
   flask db init
   flask db migrate
   flask db upgrade
   ```

6. Inicie o servidor
   ```
   python run.py
   ```

### Frontend
1. Navegue até a pasta frontend
   ```
   cd ../frontend
   ```

2. Abra o arquivo `public/index.html` em seu navegador ou utilize um servidor HTTP simples
   ```
   # Com Python (recomendado - use sempre a porta 8081)
   python3 -m http.server 8081
   
   # Ou com Python 2 (se aplicável - use sempre a porta 8081)
   python -m SimpleHTTPServer 8081
   
   # Ou com Node.js
   npx serve -l 8081 public
   ```

   > **Observação:** Utilize sempre a porta 8081 para o servidor local, pois esta porta já foi testada e confirmada como disponível no ambiente de desenvolvimento.

3. Acesse a aplicação no navegador
   ```
   http://localhost:8081
   ```

4. Credenciais de teste para login:
   - **Administrador**:
     - Email: admin@agendai.com
     - Senha: admin
   - **Empresa**:
     - Email: empresa@agendai.com
     - Senha: empresa

## Roadmap de Desenvolvimento

- [x] Estrutura básica do projeto
- [x] Backend com API RESTful
- [x] Frontend com interface responsiva
- [ ] Implementação de notificações por email
- [ ] Integração com calendários externos (Google Calendar, etc.)
- [ ] Aplicativo móvel
- [ ] Sistema de pagamento online

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes. 