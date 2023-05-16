const asyncHandler = require("express-async-handler");
const Students = require("../models/studentsSchema");
const { isMongoId } = require("validator");
const {
    BadRequestError,
    InternalServerError,
    NotFoundError,
} = require("../middlewares/httpErrors");

const mongooseSaveErrorHander = (err) => {
    if (err.name === "ValidationError") {
        const nestedErrorsArray = Object.values(err.errors);
        const errorMessagesArray = nestedErrorsArray.map((e) => {
            if (e.name === "CastError") {
                return `Tipo inválido para o campo ${e.path}`;
            }
            return e.message;
        });
        throw new BadRequestError(errorMessagesArray.join("; ") + ".");
    } else {
        throw new InternalServerError("Erro interno do servidor.");
    }
};

const getAllStudents = asyncHandler(async (req, res) => {
    // Limitando a 300 estudantes
    const allStudents = await Students.find().limit(300);
    res.json(allStudents);
});

const getStudentById = asyncHandler(async (req, res) => {
    if (!isMongoId(req.params.id)) {
        throw new BadRequestError("MongoId inválido.");
    }
    const student = await Students.findById(req.params.id);
    if (!student) {
        throw new NotFoundError("Estudante não encontrado.");
    }
    res.json(student);
});

const postStudent = asyncHandler(async (req, res) => {
    const existingStudent = await Students.findOne({ email: req.body.email });
    if (existingStudent) {
        throw new BadRequestError("Email já está em uso.");
    }
    try {
        const newStudent = new Students(req.body);
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        // Trata os erros lançados pelo mongoose e passa para nosso middleware
        mongooseSaveErrorHander(err);
    }
});

// Vou deixar para implementar os controladores de editar
// e deletar depois de implementar autenticação e registro.
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
    mongooseSaveErrorHander,
};
