const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes.js");
const errorHandler = require("./middlewares/errorHandler.js");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/students", studentRoutes);

app.get("/", (req, res) => res.send("Api ativa"));

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Servidor ouvindo na porta ${port}`));
