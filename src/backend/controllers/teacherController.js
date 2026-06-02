const Teacher = require("../models/teacherSchema");

const createTeacher = async (req,res) => {
    try{
        const teacher = await Teacher.create(req.body);
        res.status(201).json({
            message:"teacher created successfully",
            teacher
        });
    }catch(err) {
            res.status(500).json({
                message:err.message
            })
    }
}
const teacherLogin = async (req,res) => {

   const teacher = await Teacher.findOne({
      teacherID: req.body.teacherID
   });

   if(!teacher){

      return res.json({
         message: "Teacher not found"
      });

   }

   if(teacher.password !== req.body.password){

      return res.json({
         message: "Password not matched"
      });

   }

   res.json({
      message: "Login Successful"
   });

};
const getTeachers = async (req,res) => {

   const teachers = await Teacher.find();

   res.json(teachers);

};
module.exports = { createTeacher, teacherLogin, getTeachers };