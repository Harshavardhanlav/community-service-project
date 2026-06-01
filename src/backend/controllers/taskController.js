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
module.exports = createTask;