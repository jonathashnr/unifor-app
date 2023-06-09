const asyncHandler = require("express-async-handler");
const Students = require("../models/studentsSchema");
const { isMongoId } = require("validator");
const { BadRequestError, NotFoundError } = require("../middlewares/httpErrors");

//
// Helpers
//
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
        throw err;
    }
};

const verifiedStudent = async (id) => {
    if (!isMongoId(id)) {
        throw new BadRequestError("Id ausente ou inválido.");
    }
    const student = await Students.findById(id);
    if (!student) {
        throw new NotFoundError("Estudante não encontrado.");
    }
    return student;
};

//
// Controllers
//
const getAllStudents = asyncHandler(async (req, res) => {
    // Limitando a 300 estudantes
    const allStudents = await Students.find()
        .sort({ updatedAt: -1 })
        .limit(300);
    res.json(allStudents);
});

const getStudentById = asyncHandler(async (req, res) => {
    const student = await verifiedStudent(req.params.id);
    res.json(student);
});

const postStudent = asyncHandler(async (req, res) => {
    const { fullname, email, dateOfBirth, gender, degree } = req.body;
    const existingStudent = await Students.findOne({ email });
    if (existingStudent) {
        throw new BadRequestError("Email já está em uso.");
    }
    try {
        const newStudent = new Students({
            fullname,
            email,
            dateOfBirth,
            gender,
            degree,
        });
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        // Trata os erros lançados pelo mongoose e passa para nosso middleware
        mongooseSaveErrorHander(err);
    }
});

const putStudent = asyncHandler(async (req, res) => {
    const student = await verifiedStudent(req.params.id);
    const { fullname, email, dateOfBirth, gender, degree } = req.body;
    // Verifica se um outro estudante já tem esse email cadastrado
    const studentByEmail = await Students.findOne({ email });
    if (studentByEmail && studentByEmail.id !== student.id) {
        throw new BadRequestError("Email já está em uso por outro estudante.");
    }
    const validFields = { fullname, email, dateOfBirth, gender, degree };
    // Garante que só os campos não nulos são adicionados ao registro do estudante
    Object.keys(validFields).forEach((key) => {
        if (validFields[key]) {
            student[key] = validFields[key];
        }
    });
    try {
        await student.save();
        res.status(200).json(student);
    } catch (err) {
        mongooseSaveErrorHander(err);
    }
});

const deleteStudent = asyncHandler(async (req, res) => {
    const student = await verifiedStudent(req.params.id);
    await student.deleteOne();
    res.status(204).end();
});

module.exports = {
    getAllStudents,
    getStudentById,
    postStudent,
    putStudent,
    deleteStudent,
    mongooseSaveErrorHander,
};
