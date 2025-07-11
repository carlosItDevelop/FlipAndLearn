# Flip & Learn 📚

Um aplicativo interativo de aprendizado de inglês com flashcards inteligentes, desenvolvido em Angular 17 com backend em Node.js e banco PostgreSQL.

## 🚀 Funcionalidades

### 📱 Interface Interativa
- **Flashcards animados** com efeito de flip para alternar entre português e inglês
- **Design responsivo** com Tailwind CSS para desktop e mobile
- **Interface moderna** com componentes standalone do Angular

### 🎯 Sistema de Níveis
- **Filtros por dificuldade**: Iniciante, Intermediário, Avançado e Pessoal
- **Categorização automática** das lições por nível
- **Estatísticas visuais** mostrando quantidade de lições por nível

### 🔊 Síntese de Voz
- **Áudio inteligente** que reproduz no idioma correto do texto mostrado
- **Português (pt-BR)** quando exibindo texto em português
- **Inglês (en-US)** quando exibindo texto em inglês
- **Compatibilidade** com navegadores que suportam Web Speech API

### ✏️ Adição Manual de Lições
- **Inserção manual** de texto em português e inglês
- **Seleção de nível** de dificuldade personalizável
- **Lições personalizadas** criadas diretamente pelo usuário

### 💾 Persistência de Dados
- **Banco PostgreSQL** para armazenamento permanente
- **20 lições pré-carregadas** de diferentes níveis
- **Lições personalizadas** salvas permanentemente
- **API REST** para comunicação frontend-backend

### 🎮 Navegação e Controles
- **Botões de navegação** Anterior/Próximo entre lições
- **Barra de progresso** visual do aprendizado
- **Alternância** entre português e inglês
- **Modal para adicionar** novas lições

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Angular 17** com standalone components
- **TypeScript** para tipagem estática
- **RxJS** para programação reativa
- **Tailwind CSS** para estilização
- **Web Speech API** para síntese de voz

### Backend
- **Node.js** com Express.js
- **PostgreSQL** como banco de dados
- **Drizzle ORM** para operações type-safe
- **CORS** configurado para comunicação frontend-backend

### Serviços
- **API REST** para gerenciamento de lições
- **Web Speech API** nativa do navegador
- **Configuração local** sem dependências externas

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL database
- Navegador moderno com suporte à Web Speech API

### Configuração
1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```env
   DATABASE_URL=sua_url_do_postgresql
   ```

4. Execute as migrações do banco:
   ```bash
   npm run db:push
   ```

### Execução
1. Inicie o servidor da API:
   ```bash
   cd server && node api.js
   ```

2. Inicie o frontend Angular:
   ```bash
   npm install && ng serve --host 0.0.0.0 --port 5000
   ```

3. Acesse `http://localhost:5000`

## 📁 Estrutura do Projeto

```
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── flashcard/           # Componente do flashcard
│   │   │   └── add-lesson-modal/    # Modal para adicionar lições
│   │   ├── services/
│   │   │   ├── lesson.service.ts    # Gerenciamento de lições
│   │   │   └── audio.service.ts     # Síntese de voz
│   │   └── models/
│   │       └── lesson.model.ts      # Modelos de dados
├── server/
│   ├── api.js                       # API REST
│   ├── db.ts                        # Configuração do banco
│   └── storage.ts                   # Camada de persistência
├── shared/
│   └── schema.ts                    # Schema do banco Drizzle
└── proxy.conf.json                  # Configuração de proxy
```

## 🎯 Próximas Funcionalidades

- **Sistema de usuários** com autenticação
- **Progresso de aprendizado** com estatísticas avançadas
- **Spaced repetition** para otimizar memorização
- **Modo offline** com service workers
- **Exportação/importação** de lições
- **Temas personalizáveis** de interface

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.