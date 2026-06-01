const teacher = require("../models/teacherSchema");

const createTeacher = async (req,res) => {
    try{
        const Teacher = await teacher.create(req.body);
        res.status(201).json({
            message:"teacher created successfully",
            Teacher
        });
    }catch(err) {
            res.status(500).json({
                message:err.message
            })
    }
}
module.exports = { createTeacher };