# Chat App Backend

Este é o backend de uma aplicação de chat em tempo real, construído com Node.js, TypeScript, Express, Socket.IO e MongoDB.

## Sobre o Projeto

O projeto consiste em um servidor de chat que permite aos usuários se registrarem, autenticarem e trocarem mensagens em tempo real. A autenticação é baseada em JWT e as senhas são armazenadas de forma segura usando bcrypt.

## Tecnologias

As principais tecnologias utilizadas neste projeto são:

- **Node.js:** Ambiente de execução para o JavaScript no servidor.
- **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
- **Express:** Framework para construir a API REST.
- **Socket.IO:** Biblioteca para comunicação em tempo real e baseada em eventos.
- **MongoDB:** Banco de dados NoSQL para armazenar os dados da aplicação.
- **TypeORM:** ORM para TypeScript e JavaScript, utilizado para o mapeamento objeto-relacional.
- **Docker:** Plataforma para desenvolver, enviar e executar aplicações em contêineres.
- **Jest:** Framework de testes para JavaScript.

## Como Começar

Siga as instruções abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [Docker](https://www.docker.com/get-started)

### Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/chat-app-backend.git
   cd chat-app-backend
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto, baseado no `.env_example`:

   ```bash
   cp .env_example .env
   ```

   Edite o arquivo `.env` com as suas configurações, se necessário.

4. **Inicie o banco de dados:**

   ```bash
   docker-compose up -d
   ```

5. **Inicie a aplicação:**

   ```bash
   npm run dev
   ```

A aplicação estará disponível em `http://localhost:3000`.

## Funcionalidades

- **Registro de Usuário:** Novos usuários podem se registrar fornecendo um nome, nome de usuário e senha.
- **Autenticação de Usuário:** Usuários registrados podem se autenticar para obter um token JWT.
- **Chat em Tempo Real:** Usuários autenticados podem enviar e receber mensagens em tempo real.
- **Listagem de Conversas:** Os usuários podem ver uma lista de suas conversas com a última mensagem trocada.

## Estrutura do Projeto

O projeto segue os princípios de Arquitetura Limpa e Domain-Driven Design (DDD).

```
src/
├── application/
│   └── use-case/
│       ├── AuthenticateUser.ts
│       ├── ListConversations.ts
│       └── RegisterUser.ts
├── domain/
│   └── entity/
│       ├── Message.ts
│       └── User.ts
└── infra/
    ├── controller/
    │   ├── AuthController.ts
    │   └── MessageController.ts
    ├── database/
    │   └── typeorm/
    ├── http/
    │   ├── ChatGateway.ts
    │   ├── ExpressHTTPServer.ts
    │   └── ...
    ├── repository/
    └── services/
```

- **`application`**: Contém os casos de uso da aplicação (regras de negócio).
- **`domain`**: Contém as entidades de domínio.
- **`infra`**: Contém os detalhes de implementação, como controladores, repositórios, serviços externos e configuração do servidor HTTP.
