const express = require("express");

const router = express.Router();

const {

   markAttendance,
   getAttendance,
   getTeacherAttendanceReport

} = require("../controllers/attendanceController");

router.post("/mark-attendance", markAttendance);
router.get("/report/:teacherId", getTeacherAttendanceReport);
router.get("/", getAttendance);

module.exports = router;