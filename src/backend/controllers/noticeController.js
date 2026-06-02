const Notice = require("../models/noticeSchmea");
const createNotice = async (req, res)=> {
    try{
        const notice = await Notice.create(req.body);
        res.status(201).json({
            message:"notice created successfully",
            notice
        });
    }catch(err) {
        res.status(500).json({
            message:"notice creation falied",
            err
        })
    }

}
const getNotices = async (req,res) => {

   const notices = await Notice.find();

   res.json(notices);

};
module.exports = {createNotice, getNotices};