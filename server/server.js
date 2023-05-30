const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const errorHandler = require("./middlewares/errorHandler.js");
const connectDb = require("./config/dbConnection.js");

// Garante que as variaveis de ambiente foram carregadas.
require("dotenv").config();
if (
    !process.env.PORT ||
    !process.env.ATLAS_URI ||
    !process.env.ACCESS_TOKEN_SECRET
) {
    console.error(
        "ERRO: As variáveis de ambiente não foram devidamente carregadas. Garanta que o arquivo .env está no dentro do diretório /server"
    );
    process.exit(1);
}

const app = express();

connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/student", studentRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => res.send("Api ativa"));

app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => console.log(`Servidor ouvindo na porta ${port}`));
