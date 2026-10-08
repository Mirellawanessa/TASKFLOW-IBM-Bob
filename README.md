# TaskFlow

> Aplicativo fullstack de gerenciamento de tarefas com assistente de IA integrado — desenvolvido como projeto prático para a [DIO.me](https://dio.me) com auxílio do **IBM Bob** como agente de IA durante todo o processo de desenvolvimento.

![TaskFlow Dashboard](./docs/screenshot.png)

---

## 📌 Sobre o Projeto

O **TaskFlow** nasceu de um desafio simples: construir, do zero, um produto de software real utilizando um agente de IA como par de desenvolvimento.

O projeto foi concebido, planejado e implementado integralmente com o suporte do **IBM Bob** — da escolha do stack tecnológico até a escrita de cada componente, hook, rota de API e decisão de arquitetura. O resultado é uma aplicação fullstack funcional, com interface de dashboard moderna, backend com autenticação segura e um assistente de IA conversacional integrado.

### Contexto

Este projeto foi submetido à plataforma **DIO.me** como entrega prática de um bootcamp, demonstrando na prática como um desenvolvedor iniciante pode criar um produto de qualidade profissional utilizando agentes de IA como ferramenta de apoio — não como substituto, mas como acelerador de aprendizado e produtividade.

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Autenticação** | Cadastro e login com senha criptografada (bcrypt) e sessão via JWT |
| **Tarefas por usuário** | Cada conta possui sua própria lista isolada de tarefas |
| **Criar tarefas** | Título, descrição opcional e prioridade (baixa, média, alta) |
| **Marcar como concluída** | Alternância de status com atualização otimista na UI |
| **Excluir tarefas** | Remoção permanente com sincronização no banco |
| **Filtrar por status** | Abas Todas / Pendentes / Concluídas com contadores em tempo real |
| **Busca** | Filtragem por título e descrição sem sair da tela |
| **Dashboard de estatísticas** | Progresso geral, contadores, gráfico semanal e distribuição por prioridade |
| **Assistente de IA (Flow)** | Chat com Google Gemini que cria tarefas, sugere próximas ações e responde perguntas de produtividade |
| **Persistência local** | Fallback automático para localStorage quando o backend está offline |

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| [React](https://react.dev/) | 19 | Biblioteca de interface |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Tipagem estática |
| [Vite](https://vite.dev/) | 8.x | Build tool e dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Estilização utilitária |
| [Lucide React](https://lucide.dev/) | — | Ícones |

### Backend
| Tecnologia | Versão | Uso |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18+ | Runtime |
| [Express](https://expressjs.com/) | 4.x | Framework HTTP |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | — | Banco de dados SQLite |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | — | Hash de senhas |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | — | Autenticação JWT |
| [tsx](https://github.com/privatenumber/tsx) | — | Execução de TypeScript no Node |

### IA
| Serviço | Uso |
|---|---|
| [Google Gemini API](https://aistudio.google.com/) | Assistente conversacional (Flow) |
| [IBM Bob](https://www.ibm.com/bob) | Agente de IA utilizado durante o desenvolvimento do projeto |

---

## 🏗️ Arquitetura

```
TaskFlow/
├── src/                        # Frontend React + TypeScript
│   ├── components/
│   │   ├── AuthPage.tsx        # Tela de login e cadastro
│   │   ├── Sidebar.tsx         # Navegação lateral (dashboard)
│   │   ├── TopBar.tsx          # Barra superior com busca e perfil
│   │   ├── TaskForm.tsx        # Formulário de criação de tarefas
│   │   ├── TaskCard.tsx        # Cartão de tarefa individual
│   │   ├── TaskList.tsx        # Lista com estado vazio
│   │   ├── FilterBar.tsx       # Abas de filtro com contadores
│   │   ├── StatsPanel.tsx      # Painel de estatísticas (coluna direita)
│   │   └── AiAssistant.tsx     # Chat lateral com o assistente Flow
│   ├── hooks/
│   │   ├── useAuth.ts          # Gerenciamento de sessão do usuário
│   │   ├── useTasks.ts         # CRUD de tarefas + sincronização API
│   │   └── useAi.ts            # Lógica do chat com a IA
│   ├── services/
│   │   ├── api.ts              # Cliente HTTP para o backend
│   │   ├── gemini.ts           # Integração com a API do Gemini
│   │   └── storage.ts          # Leitura e escrita no localStorage
│   ├── types/
│   │   └── task.ts             # Tipos TypeScript (Task, Priority, Status)
│   └── App.tsx                 # Componente raiz
│
└── server/                     # Backend Node.js + Express
    └── src/
        ├── db.ts               # Conexão SQLite e criação das tabelas
        ├── index.ts            # Entrada do servidor Express
        ├── middleware/
        │   └── auth.ts         # Middleware JWT
        └── routes/
            ├── auth.ts         # POST /auth/register, POST /auth/login
            └── tasks.ts        # GET/POST/PATCH/DELETE /tasks
```

### Fluxo de dados

```
Usuário → AuthPage → useAuth → POST /auth/login → JWT salvo no localStorage
         ↓
       Dashboard → useTasks → GET /tasks (Bearer JWT) → SQLite → Lista de tarefas
         ↓
       AiAssistant → useAi → Gemini API → resposta em texto ou JSON de tarefas
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- Conta Google (para obter chave do Gemini — opcional)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/taskflow.git
cd taskflow
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_GEMINI_API_KEY=sua_chave_do_gemini_aqui
```

> Obtenha sua chave gratuita em [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).  
> O app funciona sem a chave — apenas o assistente de IA ficará desativado.

### 3. Instale as dependências

```bash
# Frontend
npm install

# Backend
cd server && npm install && cd ..
```

### 4. Inicie os servidores

Abra **dois terminais**:

```bash
# Terminal 1 — Backend (porta 3001)
cd server
npm run dev

# Terminal 2 — Frontend (porta 5173)
npm run dev
```

Acesse **http://localhost:5173**, crie sua conta e comece a usar.

---

## 🔌 Endpoints da API

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Criar nova conta |
| `POST` | `/auth/login` | Autenticar usuário existente |

### Tarefas *(requer `Authorization: Bearer <token>`)*

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/tasks` | Listar tarefas do usuário |
| `POST` | `/tasks` | Criar nova tarefa |
| `PATCH` | `/tasks/:id` | Atualizar status da tarefa |
| `DELETE` | `/tasks/:id` | Excluir tarefa |

---

## 🤖 IBM Bob — Parceiro de Desenvolvimento

Este projeto foi construído em parceria com o **IBM Bob**, um agente de IA assistente de desenvolvimento da IBM. O Bob participou ativamente de todas as etapas:

- **Planejamento** — definição de stack, estrutura de pastas e etapas de desenvolvimento
- **Implementação** — escrita de todos os componentes React, hooks, serviços e rotas de API
- **Decisões de arquitetura** — escolha de padrões como atualização otimista de UI, fallback para localStorage e separação de responsabilidades entre camadas
- **Resolução de problemas** — diagnóstico e correção de erros em tempo real durante o desenvolvimento
- **Documentação** — geração deste README

> _"Utilizei o IBM Bob como um par de programação sênior — ele não escreveu o código por mim, mas me guiou em cada decisão, explicou o porquê de cada escolha e me ajudou a entender os conceitos enquanto construíamos juntos."_
> — **Mirella Morais**

---

## 📄 Licença

MIT © 2025 Mirella Morais
