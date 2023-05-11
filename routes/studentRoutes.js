const express = require("express");
const router = express.Router();
const { BadRequestError } = require("../middlewares/httpErrors");

router.get("/", (req, res) => {
    res.json({ message: "Aqui vão todos os estudantes" });
});

router.get("/:id", (req, res) => {
    res.json({ message: `Aqui vai o estudante de id: ${req.params.id}` });
});

router.post("/", (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        throw new BadRequestError("O campo de nome e email são necessários.");
    } else {
        res.json({
            message: `Aqui cria um novo cadastro com: ${JSON.stringify(
                req.body
            )}`,
        });
    }
});

router.put("/", (req, res) => {
    res.json({
        message: `Aqui atualiza um cadastro com: ${JSON.stringify(req.body)}`,
    });
});

router.delete("/:id", (req, res) => {
    res.json({ message: `Aqui deleta o estudante de id: ${req.params.id}` });
});

module.exports = router;
