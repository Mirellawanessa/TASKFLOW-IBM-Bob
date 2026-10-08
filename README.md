# TaskFlow

> Aplicativo fullstack de gerenciamento de tarefas com assistente de IA integrado — desenvolvido como projeto prático para a [DIO.me](https://dio.me) com auxílio do **IBM Bob** como agente de IA durante todo o processo de desenvolvimento.

![TaskFlow Dashboard](./docs/screenshot.png)

---

## 📌 Sobre o Projeto

O **TaskFlow** é uma aplicação fullstack moderna de gerenciamento de tarefas, construída do zero com o auxílio do **IBM Bob** como par de desenvolvimento inteligente.

O projeto foi concebido, planejado e implementado com o suporte do IBM Bob — da escolha do stack tecnológico até a escrita de cada componente, hook, rota de API e decisão de arquitetura. O resultado é uma aplicação completa, com interface de dashboard moderna, backend com autenticação segura, múltiplas páginas funcionais e um assistente de IA conversacional integrado que **todos podem usar sem precisar de chave de API própria**.

### Contexto

Este projeto foi submetido à plataforma **DIO.me** como entrega prática de bootcamp, demonstrando como um desenvolvedor pode criar um produto de qualidade profissional utilizando agentes de IA como acelerador de aprendizado e produtividade.

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Autenticação completa** | Cadastro e login com senha criptografada (bcrypt) e sessão JWT de 7 dias |
| **Tarefas por usuário** | Cada conta possui lista isolada, sincronizada com o banco de dados |
| **Criar tarefas** | Título, descrição e prioridade (baixa, média, alta) |
| **Marcar como concluída** | Alternância de status com atualização otimista na UI |
| **Excluir tarefas** | Remoção com sincronização imediata no banco |
| **Filtrar + Buscar** | Filtros por status e busca por título/descrição |
| **Dashboard de estatísticas** | Progresso geral, contadores, gráfico semanal e distribuição por prioridade |
| **Página de Tarefas** | Visão dedicada com form, filtros e busca avançada |
| **Perfil com foto** | Upload de avatar, nome e bio salvos no servidor |
| **Histórico de mensagens** | Chat com a IA persistente por usuário no banco de dados |
| **Configurações** | Notificações, tema e idioma salvos por conta |
| **Assistente de IA (Flow)** | Powered by Google Gemini via proxy do servidor — sem chave própria necessária |
| **Persistência local** | Fallback automático para localStorage quando offline |

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
| [multer](https://github.com/expressjs/multer) | — | Upload de avatares |
| [tsx](https://github.com/privatenumber/tsx) | — | Execução TypeScript no Node |

### IA & Plataformas
| Serviço | Uso |
|---|---|
| [Google Gemini API](https://aistudio.google.com/) | Assistente conversacional (Flow) — via proxy no servidor |
| [IBM Bob](https://www.ibm.com/bob) | Agente de IA parceiro de desenvolvimento |
| [Vercel](https://vercel.com) | Hospedagem do frontend |
| [Render](https://render.com) | Hospedagem do backend |

---

## 🏗️ Arquitetura

```
TaskFlow/
├── src/                         # Frontend React + TypeScript
│   ├── components/
│   │   ├── AuthPage.tsx         # Tela de login e cadastro
│   │   ├── Sidebar.tsx          # Navegação lateral com roteamento
│   │   ├── TopBar.tsx           # Barra superior com busca e perfil
│   │   ├── TaskForm.tsx         # Formulário de criação
│   │   ├── TaskCard.tsx         # Cartão individual de tarefa
│   │   ├── TaskList.tsx         # Lista com estado vazio
│   │   ├── FilterBar.tsx        # Abas de filtro com contadores
│   │   ├── StatsPanel.tsx       # Painel de estatísticas
│   │   ├── AiAssistant.tsx      # Painel de chat rápido com a IA
│   │   ├── TasksPage.tsx        # Página dedicada de tarefas
│   │   ├── ProfilePage.tsx      # Perfil com upload de avatar
│   │   ├── MessagesPage.tsx     # Chat completo com histórico
│   │   └── SettingsPage.tsx     # Configurações da conta
│   ├── hooks/
│   │   ├── useAuth.ts           # Sessão do usuário
│   │   ├── useTasks.ts          # CRUD + sincronização com API
│   │   └── useAi.ts             # Lógica do chat com IA
│   ├── services/
│   │   ├── api.ts               # Cliente HTTP centralizado
│   │   ├── gemini.ts            # Integração com proxy de IA
│   │   └── storage.ts           # localStorage
│   └── types/task.ts            # Tipos TypeScript
│
└── server/                      # Backend Node.js + Express
    └── src/
        ├── db.ts                # SQLite + migrações automáticas
        ├── index.ts             # Entrada do servidor
        ├── middleware/auth.ts   # Middleware JWT
        └── routes/
            ├── auth.ts          # POST /auth/register|login
            ├── tasks.ts         # CRUD /tasks
            ├── profile.ts       # GET|PATCH /profile + avatar
            ├── messages.ts      # GET|POST|DELETE /messages
            ├── settings.ts      # GET|PATCH /settings
            └── ai.ts            # POST /ai/chat (proxy Gemini)
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18 ou superior

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/taskflow.git
cd taskflow
```

### 2. Instale as dependências
```bash
npm install
cd server && npm install && cd ..
```

### 3. Configure as variáveis de ambiente

**Raiz do projeto** — crie `.env`:
```env
VITE_API_URL=http://localhost:3001
```

**Pasta `server/`** — crie `server/.env`:
```env
GEMINI_API_KEY=sua_chave_do_gemini_aqui
JWT_SECRET=qualquer_string_secreta_aqui
```

> Obtenha a chave Gemini em [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).

### 4. Inicie os servidores

```bash
# Terminal 1 — Backend (porta 3001)
cd server && npm run dev

# Terminal 2 — Frontend (porta 5173)
npm run dev
```

Acesse **http://localhost:5173**, crie sua conta e comece a usar.

---

## 🌐 Deploy em Produção

### Backend → Render

1. Acesse [render.com](https://render.com) e crie uma conta
2. Clique em **"New Web Service"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Root directory:** `server`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
5. Adicione as variáveis de ambiente:
   - `GEMINI_API_KEY` = sua chave do Gemini
   - `JWT_SECRET` = string secreta (qualquer valor longo e aleatório)
6. Copie a URL do serviço (ex: `https://taskflow-api.onrender.com`)

### Frontend → Vercel

1. Acesse [vercel.com](https://vercel.com) e crie uma conta
2. Clique em **"Add New Project"** e conecte seu repositório
3. Adicione a variável de ambiente:
   - `VITE_API_URL` = URL do seu backend no Render (sem barra final)
4. Clique em **Deploy**

> O arquivo `vercel.json` já está configurado para o React Router funcionar corretamente.

---

## 🔌 Endpoints da API

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Criar nova conta |
| `POST` | `/auth/login` | Autenticar usuário |

### Tarefas *(JWT obrigatório)*
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/tasks` | Listar tarefas do usuário |
| `POST` | `/tasks` | Criar tarefa |
| `PATCH` | `/tasks/:id` | Atualizar status |
| `DELETE` | `/tasks/:id` | Excluir tarefa |

### Perfil
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/profile` | Obter perfil completo |
| `PATCH` | `/profile` | Atualizar nome e bio |
| `POST` | `/profile/avatar` | Upload de foto (multipart) |

### Mensagens
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/messages` | Histórico do chat |
| `POST` | `/messages` | Salvar mensagem |
| `DELETE` | `/messages` | Limpar histórico |

### Configurações
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/settings` | Obter configurações |
| `PATCH` | `/settings` | Atualizar configurações |

### IA
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/ai/chat` | Proxy para o Google Gemini |

---

## 🤖 IBM Bob — Parceiro de Desenvolvimento

Este projeto foi construído em parceria com o **IBM Bob**, agente de IA assistente de desenvolvimento da IBM, que participou ativamente de todas as etapas:

- **Planejamento** — definição de stack, arquitetura e roadmap de desenvolvimento
- **Implementação** — todos os componentes React, hooks, serviços e rotas de API
- **Decisões técnicas** — padrões como atualização otimista, proxy de IA, migrações automáticas de banco
- **Debug em tempo real** — diagnóstico e correção de erros durante o desenvolvimento
- **Documentação** — geração e manutenção deste README

> _"Utilizei o IBM Bob como um par de programação sênior — ele me guiou em cada decisão, explicou o porquê de cada escolha e me ajudou a entender os conceitos enquanto construíamos juntos. O resultado foi uma aplicação muito além do que eu conseguiria sozinha."_
> — **Mirella Morais**

---

## 📄 Licença

MIT © 2025 Mirella Morais
