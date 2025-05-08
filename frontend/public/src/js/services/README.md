# Serviços JavaScript

Este diretório contém serviços JavaScript que fornecem funcionalidades compartilhadas para toda a aplicação, como comunicação com API e gerenciamento de dados.

## Estrutura

- `api.js` - Serviço para comunicação com o backend via API REST

## Como utilizar

Os serviços são módulos JavaScript que fornecem funções e métodos para interagir com recursos externos ou implementar lógica de negócio compartilhada. Exemplo:

```javascript
// Usar o serviço de API para buscar dados
API.get('/users')
    .then(users => {
        // Fazer algo com os usuários
    })
    .catch(error => {
        console.error('Erro ao buscar usuários:', error);
    });
```

## Boas práticas

- Manter os serviços independentes entre si
- Fornecer tratamento de erros adequado
- Documentar métodos e parâmetros
- Implementar retry e timeout quando apropriado
- Seguir padrões de design como Singleton para serviços globais 