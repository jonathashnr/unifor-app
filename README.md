## Atividade Final N695

### Equipe

-   Jonathas Henrique Nascimento Rodrigues (2213854)
-   Francisco Irismar Firmiano de Souza Junior (2213845)

---

### Modelagem da aplicação

O app consiste em um _client_ que funciona de front-end e um _server_ que é uma API Rest. Através da API é possível registrar e logar um **administrador** que tem permissão para fazer CRUD completo no registro dos **estudantes**. O fluxo de uso do app deve ser simples: Chega na landing page, clica no link para registrar um novo administrador, faz log on com a conta de administrador recem criada e com isso tem acesso a "Tela de Administração", onde é possível ver uma lista dos estudantes com gráficos baseados nessa lista, além de poder criar novos registros e deletar/editar os já existentes.

---

### Documentação da API

#### Coleção admins

-   Schema:
    -   username (String, _required, unique_)
    -   email (String, _required, unique_)
    -   password (String, _required_)
-   Rotas:
    -   /admin/register/ - (POST, _public_) - registra um novo administrador.
    -   /admin/login/ - (POST, _public_) - loga com um administrador
    -   /admin/current/ - (GET, _private_) - retorna info básica sobre o administrador logado.

#### Coleção students

-   Schema:
    -   fullname (String, required)
    -   email (String, required, unique)
    -   dateOfBirth (Date, required)
    -   gender(String, required)
    -   degree (String, required)
    -   createdAt(Timestamp)
    -   updatedAt(Timestamp)
-   Rotas:
    -   /students/ - (GET, _private_) - retorna todos os estudantes.
    -   /students/:id - (GET, _private_) - retorna um estudante por id.
    -   /students/ - (POST, _private_) - cria um novo registro de estudante.
    -   /students/:id - (PUT, _private_) - edita um registro de estudante.
    -   /students/:id - (DELETE, _private_) - edita um registro de estudante.
