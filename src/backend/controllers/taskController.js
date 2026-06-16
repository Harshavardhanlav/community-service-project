const Task = require("../models/taskSchema");
const createTask = async (req, res)=> {
    try{
        const task = await Task.create(req.body);
        res.status(201).json({
            message:"event created successfully",
            task
        });
    }catch(err) {
        res.status(500).json({
            message:"event creation falied",
            err
        })
    }

}
const deleteTask = async (req, res) => {

   try {

      const task = await Task.findByIdAndDelete(req.params.id);

      if (!task) {

         return res.status(404).json({
            message: "Task not found"
         });

      }

      res.json({
         message: "Task deleted successfully"
      });

   } catch (err) {

      res.status(500).json({
         message: err.message
      });

   }

};
const getTasks = async (req,res) => {

   const tasks = await Task.find();

   res.json(tasks);

};
module.exports = {
   createTask,
   getTasks,
   deleteTask
};