const asyncHandler = require("express-async-handler");
const { BadRequestError } = require("../middlewares/httpErrors");

const getAllStudents = asyncHandler(async (req, res) => {
    res.json({ message: `Aqui vai todos os estudantes` });
});

const getStudentById = asyncHandler(async (req, res) => {
    res.json({ message: `Aqui vai o estudante de id: ${req.params.id}` });
});

const postStudent = asyncHandler(async (req, res) => {
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

const putStudent = asyncHandler(async (req, res) => {
    res.json({
        message: `Aqui atualiza um cadastro com: ${JSON.stringify(req.body)}`,
    });
});

const deleteStudent = asyncHandler(async (req, res) => {
    res.json({ message: `Aqui deleta o estudante de id: ${req.params.id}` });
});

module.exports = {
    getAllStudents,
    getStudentById,
    postStudent,
    putStudent,
    deleteStudent,
};
