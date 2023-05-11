const express = require("express");
const router = express.Router();
const {
    getAllStudents,
    getStudentById,
    postStudent,
    putStudent,
    deleteStudent,
} = require("../controllers/studentControllers.js");

router.get("/", getAllStudents);

router.get("/:id", getStudentById).delete(deleteStudent);

router.post("/", postStudent);

router.put("/", putStudent);

module.exports = router;
