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
const getTasks = async (req,res) => {

   const tasks = await Task.find();

   res.json(tasks);

};
module.exports = {createTask, getTasks};