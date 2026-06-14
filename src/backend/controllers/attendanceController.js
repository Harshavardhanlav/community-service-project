const Attendance = require("../models/attendanceSchema");

const Calendar = require("../models/calenderSchema");

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

      const attendance = await Attendance.find();

      res.status(200).json(attendance);

   } catch(err){

      res.status(500).json({
         message: err.message
      });

   }

};

const getTodaySummary = async (req, res) => {

   try {

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

      const { teacherId } = req.params;

const month = parseInt(req.query.month);

const year = parseInt(req.query.year);

const currentMonth = month;

const currentYear = year;

      const startDate = new Date(currentYear, currentMonth, 1);
      const endDate = new Date(
         currentYear,
         currentMonth + 1,
         0,
         23,
         59,
         59,
         999
);

      const presentDays = await Attendance.countDocuments({

         teacherId,

         attendanceDate: {
            $gte: startDate,
            $lte: endDate
         }

      });

      const holidays = await Calendar.countDocuments({

         dayType: "Holiday",

         eventDate: {
            $gte: startDate,
            $lte: endDate
         }

      });

      const totalDays = endDate.getDate();

      let sundays = 0;

      for(let i = 1; i <= totalDays; i++){

         const day = new Date(
            currentYear,
            currentMonth,
            i
         ).getDay();

         if(day === 0){
            sundays++;
         }

      }

      const totalWorkingDays =
         totalDays - sundays - holidays;

      const attendancePercentage =
         ((presentDays / totalWorkingDays) * 100).toFixed(2);

      res.status(200).json({

         teacherId,

         presentDays,

         totalWorkingDays,

         attendancePercentage

      });

   } catch(err){

      res.status(500).json({
         message: err.message
      });

   }

};

module.exports = {

   markAttendance,
   getAttendance,
   getTeacherAttendanceReport,
   getTodaySummary
};