# TaskFlow

Aplicativo de gerenciamento de tarefas com assistente de IA integrado, construído com React, TypeScript e Tailwind CSS.

## ✨ Funcionalidades

- **Criar tarefas** com título, descrição e prioridade (baixa, média, alta)
- **Marcar tarefas como concluídas** com um clique
- **Excluir tarefas** individualmente
- **Filtrar tarefas** por status: Todas, Pendentes e Concluídas
- **Salvar automaticamente** no navegador via localStorage
- **Assistente de IA (Flow)** powered by Google Gemini:
  - Cria tarefas automaticamente a partir de texto livre
  - Sugere o que fazer primeiro com base na lista atual
  - Responde perguntas sobre produtividade

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| [React 19](https://react.dev/) | Biblioteca de interface |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Vite](https://vite.dev/) | Build tool e servidor de desenvolvimento |
| [Tailwind CSS v4](https://tailwindcss.com/) | Estilização |
| [Google Gemini API](https://aistudio.google.com/) | Assistente de IA |
| [Lucide React](https://lucide.dev/) | Ícones |

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── AiAssistant.tsx   # Painel lateral do chat com a IA
│   ├── FilterBar.tsx     # Abas de filtro com contadores
│   ├── Header.tsx        # Cabeçalho com progresso e botão da IA
│   ├── TaskCard.tsx      # Cartão de tarefa individual
│   ├── TaskForm.tsx      # Formulário de criação de tarefas
│   └── TaskList.tsx      # Lista de tarefas com estado vazio
├── hooks/
│   ├── useAi.ts          # Lógica do chat com a IA
│   └── useTasks.ts       # Lógica de criação, conclusão e exclusão
├── services/
│   ├── gemini.ts         # Comunicação com a API do Google Gemini
│   └── storage.ts        # Leitura e escrita no localStorage
├── types/
│   └── task.ts           # Tipos TypeScript (Task, Priority, Status)
├── App.tsx               # Componente raiz
└── main.tsx              # Ponto de entrada
```

## 🚀 Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- Conta Google para obter a chave da API do Gemini

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/taskflow.git
cd taskflow

# 2. Instale as dependências
npm install

# 3. Configure a chave da API
# Crie um arquivo .env na raiz do projeto com o conteúdo abaixo:
# VITE_GEMINI_API_KEY=sua_chave_aqui

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no navegador.

### Obter a chave da API do Gemini

1. Acesse [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em **"Create API Key"**
4. Copie a chave e cole no arquivo `.env`

> O app funciona normalmente sem a chave — o assistente de IA ficará desativado até a chave ser configurada.

## 📦 Scripts disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Gera a build de produção na pasta dist/
npm run preview  # Visualiza a build de produção localmente
```

## 🔒 Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `VITE_GEMINI_API_KEY` | Chave da API do Google Gemini para o assistente de IA |

> ⚠️ Nunca compartilhe o arquivo `.env` nem faça commit dele. Ele já está no `.gitignore`.

## 📄 Licença

MIT © TaskFlow
