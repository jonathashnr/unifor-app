const express = require("express");
const {
    registerUser,
    loginUser,
    currentUser,
} = require("../controllers/userControllers.js");
const authenticateToken = require("../middlewares/authenticationHandler.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", authenticateToken, currentUser);

module.exports = router;
