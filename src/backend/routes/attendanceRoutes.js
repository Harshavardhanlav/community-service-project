const express = require("express");

const router = express.Router();

const {

   markAttendance,
   getAttendance,
   getTeacherAttendanceReport,
      getTodaySummary

} = require("../controllers/attendanceController");

router.post("/mark-attendance", markAttendance);
router.get("/report/:teacherId", getTeacherAttendanceReport);
router.get("/", getAttendance);
router.get(
   "/today-summary",
   getTodaySummary
);
module.exports = router;