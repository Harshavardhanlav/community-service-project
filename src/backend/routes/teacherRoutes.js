const express = require("express");

const router = express.Router();

const {
   createTeacher,
   teacherLogin,
   getTeachers,
   deleteTeacher
} = require("../controllers/teacherController");

router.post("/create-teacher", createTeacher);
router.post("/teacher-login", teacherLogin);
router.get("/", getTeachers);
router.delete("/:id", deleteTeacher);
module.exports = router;