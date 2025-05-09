# AgendAI - Frontend

Este é o frontend do sistema AgendAI, um sistema de agendamento inteligente implementado como uma aplicação SPA (Single Page Application).

## Estrutura de Diretórios

- `index.html` - Arquivo principal da aplicação SPA
- `public/` - Arquivos públicos e componentes
  - `src/` - Código-fonte da aplicação
    - `js/` - Scripts JavaScript
      - `app.js` - Aplicação principal SPA 
    - `css/` - Folhas de estilo
    - `img/` - Imagens e recursos gráficos
  - `views/` - Views HTML para carregamento dinâmico
    - `login.html` - Página de login
    - `company-dashboard.html` - Dashboard da empresa
    - `admin-dashboard.html` - Dashboard do administrador
    - *(e outras views)*

## Funcionamento do SPA

O sistema é uma aplicação SPA (Single Page Application) que usa roteamento baseado em hash para navegar entre as diferentes páginas sem recarregar o navegador. 

A arquitetura funciona da seguinte forma:

1. O `index.html` carrega o `app.js` que controla todo o fluxo da aplicação
2. As diferentes views são carregadas dinamicamente no elemento `#app-content`
3. A navegação é feita através de links com o atributo `data-link`
4. O estado da aplicação (autenticação, usuário atual) é mantido no localStorage

## Autenticação

O sistema suporta dois tipos de usuários:
- Admin: Administrador do sistema
- Company: Empresas que utilizam o sistema para gerenciar agendamentos

As credenciais de teste são:
- Admin: admin@agendai.com / admin
- Empresa: empresa@agendai.com / empresa

## Executando o Projeto

Este frontend deve ser servido pelo backend. Consulte as instruções no README principal para executar o projeto completo.

**IMPORTANTE**: O sistema deve ser acessado sempre através da porta 3001:
```
http://localhost:3001
```

Algumas funcionalidades dependem desta porta específica e podem não funcionar corretamente se acessadas por outra porta. 