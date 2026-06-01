const Calendar = require("../models/calenderSchema");

const addCalendarDate = async (req, res) => {

   try {

      const { eventDate } = req.body;

      const existingDate = await Calendar.findOne({
         eventDate
      });

      if(existingDate){

         return res.status(400).json({
            message: "Date already exists"
         });

      }

      const newDate = await Calendar.create(req.body);

      res.status(201).json({
         message: "Calendar date added",
         newDate
      });

   } catch(err){

      res.status(500).json({
         message: err.message
      });

   }

};

const getCalendarDates = async (req, res) => {

   try {

      const dates = await Calendar.find();

      res.status(200).json(dates);

   } catch(err){

      res.status(500).json({
         message: err.message
      });

   }

};

const updateCalendarDate = async (req, res) => {

   try {

      const updatedDate = await Calendar.findByIdAndUpdate(

         req.params.id,

         req.body,

         { new: true }

      );

      res.status(200).json({
         message: "Calendar updated",
         updatedDate
      });

   } catch(err){

      res.status(500).json({
         message: err.message
      });

   }

};

module.exports = {

   addCalendarDate,
   getCalendarDates,
   updateCalendarDate

};