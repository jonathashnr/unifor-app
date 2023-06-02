# Atividade Final N695

## Equipe

-   Jonathas Henrique Nascimento Rodrigues (2213854)
-   Francisco Irismar Firmiano de Souza Junior (2213845)
-   Vitória Maria Monteiro de Almeida (2213822)

---

## Guia de instalação/execução do projeto

### 1. Fazendo download do repositório

Clone o repositório com:

```
git clone https://github.com/jonathashnr/unifor-app.git
```
### 2. Configurando o servidor
O repositório tem dois projetos separados (client e server) que tem dependências que devem ser instaladas usando npm. Além disso o servidor precisa ter suas variáveis de ambiente carregadas, para começar vamos navegar para dentro do diretório  `/server` e instalar as dependências do servidor:
```
npm install
```
Depois disso transfira o arquivo `.env` para o diretório `/server` OU use openssl para decifrar o arquivo `env.encrypted`:
```
openssl enc -aes-256-cbc -d -salt -pbkdf2 -in env.encrypted -out .env
```
Depois é só colocar o servidor para funcionar executando o comando seguinte no diretório `/server`:
```
npm start
```
O servidor deve estar escutando em _http://localhost:3000/_

### 3. Executando o Cliente
Uma vez que o servidor esteja funcionando, abra um novo terminal e navegue até o diretório `/client` do repositório e instale as dependências do cliente com:
```
npm install
```
O cliente usa **Vite** para buildar o projeto, para usar o _liveserver_ do Vite para visualizar a aplicação use:
```
npm start
```
Isso deve inicializar o projeto, que pode ser acessado (por padrão) em _http://localhost:8080/_

---
## Modelagem da aplicação

O app consiste em um _client_ que funciona de front-end e um _server_ que é uma API Rest. Através da API é possível registrar e logar um **administrador** que tem permissão para fazer CRUD completo no registro dos **estudantes**. O fluxo de uso do app deve ser simples: Chega na landing page, clica no link para registrar um novo administrador, faz log on com a conta de administrador recem criada e com isso tem acesso a "Tela de Administração", onde é possível ver uma lista dos estudantes com gráficos baseados nessa lista, além de poder criar novos registros e deletar/editar os já existentes.

---

## Documentação da API

### Coleção admins

-   Schema:
    -   username (String, _required, unique_)
    -   email (String, _required, unique_)
    -   password (String, _required_)
-   Rotas:
    -   `/admin/register/` - (POST, _public_) - registra um novo administrador.
    -   `/admin/login/` - (POST, _public_) - loga com um administrador
    -   `/admin/current/` - (GET, _private_) - retorna info básica sobre o administrador logado.

### Coleção students

-   Schema:
    -   fullname (String, _required_)
    -   email (String, _required_, _unique_)
    -   dateOfBirth (Date, _required_)
    -   gender(String, _required_)
    -   degree (String, _required_)
    -   createdAt(Timestamp)
    -   updatedAt(Timestamp)
-   Rotas:
    -   `/student/` - (GET, _private_) - retorna todos os estudantes.
    -   `/student/:id` - (GET, _private_) - retorna um estudante por id.
    -   `/student/` - (POST, _private_) - cria um novo registro de estudante.
    -   `/student/:id` - (PUT, _private_) - edita um registro de estudante.
    -   `/student/:id` - (DELETE, _private_) - deleta um registro de estudante (retorna status 204 em sucesso).
