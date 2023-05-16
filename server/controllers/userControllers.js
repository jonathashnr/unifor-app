const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
    BadRequestError,
    UnauthorizedError,
} = require("../middlewares/httpErrors");
const Students = require("../models/studentsSchema.js");

const registerUser = asyncHandler(async (req, res) => {
    res.json({ message: "Registra um novo estudante com status de admin" });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError(
            `Campo de ${email ? "senha" : "email"} vazio.`
        );
    }
    const user = await Students.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );
        res.json({ accessToken });
    } else {
        throw new UnauthorizedError("Email ou senha inválidos.");
    }
});

const currentUser = asyncHandler(async (req, res) => {
    const user = req.user;
    res.json({ user });
});

module.exports = {
    registerUser,
    loginUser,
    currentUser,
};
