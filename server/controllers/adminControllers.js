const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admins = require("../models/adminsSchema.js");
const { mongooseSaveErrorHander } = require("./studentControllers.js");
const {
    BadRequestError,
    UnauthorizedError,
} = require("../middlewares/httpErrors.js");

const registerAdmin = asyncHandler(async (req, res) => {
    const existingAdmin = await Admins.findOne({
        email: req.body.email,
    });
    if (existingAdmin) {
        throw new BadRequestError("Email já está em uso.");
    }
    try {
        const newAdmin = new Admins(req.body);
        const savedAdmin = await newAdmin.save();
        res.status(201).json(savedAdmin);
    } catch (err) {
        // Trata os erros lançados pelo mongoose e passa para nosso middleware
        mongooseSaveErrorHander(err);
    }
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError(
            `Campo ${email ? "senha" : "email"} está vazio.`
        );
    }
    const admin = await Admins.findOne({ email });
    if (admin && (await bcrypt.compare(password, admin.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    email: admin.email,
                    id: admin.id,
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

const current = asyncHandler(async (req, res) => {
    const user = req.user;
    res.json({ user });
});

module.exports = {
    registerAdmin,
    loginAdmin,
    current,
};
