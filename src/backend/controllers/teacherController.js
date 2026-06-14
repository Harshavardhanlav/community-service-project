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
const deleteTeacher = async (req, res) => {

   console.log("DELETE REQUEST RECEIVED");
   console.log(req.params.id);

   try {
      const teacher = await Teacher.findByIdAndDelete(req.params.id);

      if (!teacher) {
         return res.status(404).json({
            message: "Teacher not found"
         });
      }

      res.json({
         message: "Teacher deleted successfully"
      });

   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: err.message
      });
   }
};
module.exports = {
   createTeacher,
   teacherLogin,
   getTeachers,
   deleteTeacher
};