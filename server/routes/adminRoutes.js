const express = require("express");
const {
    registerAdmin,
    loginAdmin,
    current,
} = require("../controllers/adminControllers.js");
const authenticateToken = require("../middlewares/authenticationHandler.js");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/current", authenticateToken, current);

module.exports = router;