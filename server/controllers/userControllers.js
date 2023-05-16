const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
    res.json({ message: "Registra um novo estudante com status de admin" });
});

const loginUser = asyncHandler(async (req, res) => {
    res.json({ message: "Loga e autentica um estudante." });
});

module.exports = {
    registerUser,
    loginUser,
};
