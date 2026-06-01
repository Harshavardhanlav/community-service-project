const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

   teacherId: {
      type: String,
      required: true
   },

   attendanceDate: {
      type: Date,
      required: true
   },

   status: {
      type: String,
      default: "Present"
   },

   totalWorkingDays: {
      type: Number,
      default: 0
   },

   latitude: {
      type: Number,
      required: true
   },

   longitude: {
      type: Number,
      required: true
   }

}, {
   timestamps: true
});

module.exports = mongoose.model("Attendance", attendanceSchema);