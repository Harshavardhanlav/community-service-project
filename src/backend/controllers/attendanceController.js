const Attendance = require("../models/attendanceSchema");
const Teacher = require("../models/teacherSchema");

const Calendar = require("../models/calenderSchema");

const ATTENDANCE_CUTOFF_HOUR = 9;
const ATTENDANCE_CUTOFF_MINUTE = 0;

const getStartOfDay = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

const getEndOfDay = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

const hasCutoffPassed = () => {
  const now = new Date();
  if (now.getHours() > ATTENDANCE_CUTOFF_HOUR) return true;
  if (now.getHours() === ATTENDANCE_CUTOFF_HOUR) {
    return now.getMinutes() >= ATTENDANCE_CUTOFF_MINUTE;
  }
  return false;
};

const autoMarkAbsentForToday = async () => {
  if (!hasCutoffPassed()) return;

  const today = new Date();
  const startOfDay = getStartOfDay(today);
  const endOfDay = getEndOfDay(today);

  if (today.getDay() === 0) return;

  const existingCalendar = await Calendar.findOne({
    eventDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  if (existingCalendar && existingCalendar.dayType === "Holiday") return;

  const allTeachers = await Teacher.find();
  if (!allTeachers.length) return;

  const todayAttendance = await Attendance.find({
    attendanceDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  const presentTeacherIds = new Set(todayAttendance.map((record) => record.teacherId));
  const absentTeachers = allTeachers.filter(
    (teacher) => !presentTeacherIds.has(teacher.teacherID)
  );

  if (!absentTeachers.length) return;

  const absentRecords = absentTeachers.map((teacher) => ({
    teacherId: teacher.teacherID,
    teacherName: teacher.fullName,
    attendanceDate: new Date(),
    status: "Absent",
    latitude: null,
    longitude: null,
  }));

  await Attendance.insertMany(absentRecords);
};

const markAttendance = async (req, res) => {

   try {

      const today = new Date();

      const day = today.getDay();

      const existingCalendar = await Calendar.findOne({
         eventDate: {
            $gte: new Date(today.setHours(0,0,0,0)),
            $lte: new Date(today.setHours(23,59,59,999))
         }
      });

      if(existingCalendar){

         if(existingCalendar.dayType === "Holiday"){

            return res.status(400).json({
               message: "Today is holiday"
            });

         }

      } else {

         if(day === 0){

            return res.status(400).json({
               message: "Sunday holiday"
            });

         }

      }

      const existingAttendance = await Attendance.findOne({

         teacherId: req.body.teacherId,

         attendanceDate: {
            $gte: new Date(today.setHours(0,0,0,0)),
            $lte: new Date(today.setHours(23,59,59,999))
         }

      });

      if(existingAttendance){

         return res.status(400).json({
            message: "Attendance already marked"
         });

      }

      const totalWorkingDays = await Attendance.countDocuments();

      const attendance = await Attendance.create({

         ...req.body,

         attendanceDate: new Date(),

         totalWorkingDays: totalWorkingDays + 1

      });

      res.status(201).json({

         message: "Attendance Marked",

         attendance

      });

   } catch(err){

      res.status(500).json({
         message: err.message
      });

   }

};

const getAttendance = async (req, res) => {

   try {

      await autoMarkAbsentForToday();

      const { teacherId } = req.query;

      const filter = {};
      if (teacherId) filter.teacherId = teacherId;

      const attendance = await Attendance.find(filter).sort({ attendanceDate: -1 });

      res.status(200).json(attendance);

   } catch(err){

      res.status(500).json({
         message: err.message
      });

   }

};

const getTodaySummary = async (req, res) => {

   try {
      await autoMarkAbsentForToday();

      const today = new Date();

      const startOfDay = new Date(
         today.getFullYear(),
         today.getMonth(),
         today.getDate()
      );

      const endOfDay = new Date(
         today.getFullYear(),
         today.getMonth(),
         today.getDate() + 1
      );

      const todayAttendance = await Attendance.find({
         attendanceDate: {
            $gte: startOfDay,
            $lt: endOfDay
         }
      });

      const present = todayAttendance.filter(
         record => record.status === "Present"
      ).length;

      const absent = todayAttendance.filter(
         record => record.status === "Absent"
      ).length;

      const total = present + absent;

      const percentage =
         total === 0
            ? 0
            : Number(
                 ((present / total) * 100).toFixed(2)
              );

      res.status(200).json({
         present,
         absent,
         total,
         percentage
      });

   } catch (error) {

      res.status(500).json({
         message: error.message
      });

   }

};
const getTeacherAttendanceReport = async (req, res) => {

   try {
      await autoMarkAbsentForToday();

      const { teacherId } = req.params;

      const month = parseInt(req.query.month) || new Date().getMonth();

      const year = parseInt(req.query.year) || new Date().getFullYear();

      // Validate inputs
      if (!teacherId) {
         return res.status(400).json({ message: "Teacher ID is required" });
      }

      if (isNaN(month) || month < 0 || month > 11) {
         return res.status(400).json({ message: "Invalid month" });
      }

      if (isNaN(year) || year < 2020) {
         return res.status(400).json({ message: "Invalid year" });
      }

      const startDate = new Date(year, month, 1);
      const startDate_Normalized = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0);
      
      // Get last day of month
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const endDate_Normalized = new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth(), lastDayOfMonth.getDate(), 23, 59, 59, 999);

      // Count present days for this teacher
      const presentDays = await Attendance.countDocuments({
         teacherId: teacherId,
         attendanceDate: {
            $gte: startDate_Normalized,
            $lte: endDate_Normalized
         }
      });

      // Count holidays in this period
      const holidays = await Calendar.countDocuments({
         dayType: "Holiday",
         eventDate: {
            $gte: startDate_Normalized,
            $lte: endDate_Normalized
         }
      });

      const totalDays = lastDayOfMonth.getDate();

      let sundays = 0;

      for(let i = 1; i <= totalDays; i++){
         const day = new Date(year, month, i).getDay();
         if(day === 0){
            sundays++;
         }
      }

      const totalWorkingDays = totalDays - sundays - holidays;
      
      // Avoid division by zero
      const attendancePercentage = totalWorkingDays > 0 
         ? ((presentDays / totalWorkingDays) * 100).toFixed(2)
         : 0;

      res.status(200).json({
         teacherId,
         presentDays: presentDays || 0,
         totalWorkingDays: totalWorkingDays || 0,
         attendancePercentage: parseFloat(attendancePercentage)
      });

   } catch(err){

      res.status(500).json({
         message: err.message || "Error fetching attendance report"
      });

   }

};

module.exports = {

   markAttendance,
   getAttendance,
   getTeacherAttendanceReport,
   getTodaySummary,
   autoMarkAbsentForToday
};