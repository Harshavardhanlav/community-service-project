const express = require("express");

const router = express.Router();

const { createTeacher, teacherLogin, getTeachers } = require("../controllers/teacherController");

router.post("/create-teacher", createTeacher);
router.post("/teacher-login", teacherLogin);
router.get("/", getTeachers);

module.exports = router;