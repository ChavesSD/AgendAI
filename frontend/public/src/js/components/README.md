# Componentes JavaScript

Este diretório contém componentes reutilizáveis JavaScript que são utilizados em diferentes partes da aplicação.

## Estrutura

- `sidebar.js` - Componente para o menu lateral da aplicação
- [outros componentes]

## Como utilizar

Estes componentes são carregados dinamicamente pela aplicação SPA quando necessários. Cada componente segue um padrão semelhante:

```javascript
const NomeComponente = {
    init() {
        // Inicialização do componente
    },
    
    // Outros métodos do componente
};

// Exportar o componente
window.NomeComponente = NomeComponente;
```

## Boas práticas

- Manter cada componente com responsabilidade única
- Documentar métodos e propriedades
- Usar nomeação consistente (camelCase para variáveis e métodos, PascalCase para componentes)
- Evitar dependências globais sempre que possível 