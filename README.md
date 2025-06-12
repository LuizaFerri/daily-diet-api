# Daily Diet API

API para controle de dieta diária desenvolvida com Fastify, TypeScript e Knex.

## Estrutura do Projeto

```
daily-diet-api/
├── src/
│   ├── database/
│   │   ├── migrations/          # Migrations do banco de dados
│   │   └── index.ts            # Configuração do Knex
│   ├── middlewares/
│   │   └── check-session-id-exists.ts  # Middleware de autenticação
│   ├── routes/
│   │   ├── users.ts            # Rotas de usuários
│   │   └── meals.ts            # Rotas de refeições
│   ├── types/
│   │   └── knex.d.ts           # Tipagem das tabelas
│   ├── utils/
│   │   └── get-user-metrics.ts # Cálculo de métricas
│   ├── env/
│   │   └── index.ts            # Validação de variáveis de ambiente
│   ├── app.ts                  # Configuração da aplicação
│   └── server.ts               # Servidor principal
├── tmp/                        # Banco SQLite (desenvolvimento)
├── .gitignore
├── knexfile.ts                 # Configuração do Knex
├── package.json
├── tsconfig.json
└── README.md
```

## Funcionalidades

- ✅ Criar usuário
- ✅ Identificar usuário entre requisições (cookies)
- ✅ Registrar refeição (nome, descrição, data/hora, dentro da dieta)
- ✅ Editar refeição
- ✅ Apagar refeição
- ✅ Listar refeições do usuário
- ✅ Visualizar refeição específica
- ✅ Métricas do usuário (total, dentro/fora da dieta, melhor sequência)
- ✅ Isolamento de dados por usuário

## Tecnologias

- **Fastify** - Framework web
- **TypeScript** - Linguagem
- **Knex** - Query builder
- **PostgreSQL/SQLite** - Banco de dados
- **Zod** - Validação de dados
- **Vitest** - Testes 