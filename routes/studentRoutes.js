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

router.get("/:id", getStudentById);

router.post("/", postStudent);

router.put("/", putStudent);

router.delete("/:id", deleteStudent);
module.exports = router;
