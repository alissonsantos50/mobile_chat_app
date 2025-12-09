# Authenticated Chat App - React Native

Este é um aplicativo de chat em tempo real desenvolvido com React Native, TypeScript e WebSockets. A aplicação permite que usuários se cadastrem, façam login e conversem em tempo real com outros usuários cadastrados.

## Funcionalidades

- **Autenticação de Usuários**: Tela de login para acesso à aplicação.
- **Chat em Tempo Real**: Troca de mensagens instantâneas entre usuários utilizando WebSockets.
- **Lista de Contatos**: Visualização de outros usuários cadastrados.
- **Status Online/Offline**: Indicação em tempo real do status dos usuários na lista de contatos.
- **Navegação Completa**: Estrutura de navegação que separa o fluxo de autenticação do fluxo principal da aplicação.

## Tecnologias Utilizadas

- **React Native**: Estrutura principal para o desenvolvimento mobile.
- **TypeScript**: Para um código mais robusto e com tipagem estática.
- **React Navigation**: Para o gerenciamento de telas e navegação.
- **Socket.IO Client**: Para a comunicação em tempo real via WebSockets.
- **Axios**: Para chamadas HTTP ao backend (autenticação).

## Pré-requisitos

- **Node.js**: Versão 24.
- **NPM**: Gerenciador de pacotes.
- **Ambiente React Native**: Siga o guia oficial de configuração do React Native para seu sistema operacional (Android/iOS). [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment).

## Instalação

1.  Clone o repositório para a sua máquina local.
2.  Navegue até o diretório do projeto: `cd MobileChat`
3.  Instale as dependências do projeto:
    ```sh
    npm install
    ```

## Configuração do Backend

Este aplicativo foi projetado para se conectar a um serviço de backend específico para autenticação e comunicação via WebSocket.

As URLs do backend estão configuradas nos seguintes arquivos:

- `src/services/api.ts`: Para as requisições HTTP (login).
- `src/services/WebSocketService.ts`: Para a conexão com o WebSocket.

Por padrão, o endereço utilizado é `http://10.0.2.2:3333`, que é o endereço padrão para acessar o `localhost` da sua máquina a partir de um emulador Android. Se o seu backend estiver rodando em um endereço diferente, **lembre-se de atualizar esses arquivos**.

## Executando a Aplicação

Com o ambiente configurado e as dependências instaladas, você pode executar a aplicação.

1.  **Inicie o Metro Bundler**:
    Abra um terminal na raiz do projeto e execute:

    ```sh
    npm start
    ```

2.  **Execute no seu dispositivo/emulador**:
    Abra **outro** terminal na raiz do projeto e execute um dos seguintes comandos:

    - **Para Android**:

      ```sh
      npm run android
      ```

    - **Para iOS**:

      ```sh
      # Primeiro, instale os Pods
      cd ios && pod install && cd ..

      # Em seguida, execute
      npm run ios
      ```

A aplicação deverá ser compilada e executada no seu emulador ou dispositivo físico conectado.
