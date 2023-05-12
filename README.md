## Atividade Final N695

### Equipe

-   Jonathas Henrique Nascimento Rodrigues (2213854)
-   Francisco Irismar Firmiano de Souza Junior (2213845)

---

### Projeto de Schema

Pode ser mudado, mas já que o professor quer que façamos data visualisation, removi dados que não são significativos (que não temos como comparar com nada, tipo matricula e telefone) e adicionei alguns significativos, como genero e data de nascimento, assim podemos dividir os alunos por genero, idade e curso e fazer graficos comparativos no dashboard.

-   fullname (String, required): Nome completo, podemos dividir em dois campos.
-   email (String, required, unique): Vai nos servir de username, tem que ser único.
-   dateOfBirth (Date, required): Podemos usar para derivar a idade e dividir os estudantes em grupos etários.
-   gender(String, required): Gênero pode ser um dos dados que podemos utilizar para fazer os graficos, junto com o curso.
-   degree (String, required): Vamos fornecer uma lista pre-definida de cursos possíveis, inicialmente teremos ADS, Marketing e Direito.
-   isAdmin (Boolean, internal): Não precisa ser recolhido no registro, mas todos os registros feitos através do cadastro serão administradores e todos criados por um usuário já cadastrado não serão. A ideia é que admins só podem editar/deletar estudantes não admins.
-   createdAt(Timestamp, internal): mongoose cuida de criar as timestamps.
-   updatedAt(Timestamp, internal)
