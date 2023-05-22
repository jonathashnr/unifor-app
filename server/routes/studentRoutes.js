const express = require("express");
const router = express.Router();
const {
    getAllStudents,
    getStudentById,
    postStudent,
    putStudent,
    deleteStudent,
} = require("../controllers/studentControllers.js");
const authenticateToken = require("../middlewares/authenticationHandler.js");

router.get("/", authenticateToken, getAllStudents);
router.get("/:id", authenticateToken, getStudentById);
router.post("/", authenticateToken, postStudent);
router.put("/:id", authenticateToken, putStudent);
router.delete("/:id", authenticateToken, deleteStudent);

module.exports = router;
