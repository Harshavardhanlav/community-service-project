const Notice = require("../models/noticeSchema");
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
const deleteNotice = async (req, res) => {

   try {

      const notice = await Notice.findByIdAndDelete(req.params.id);

      if (!notice) {

         return res.status(404).json({
            message: "Notice not found"
         });

      }

      res.json({
         message: "Notice deleted successfully"
      });

   } catch (err) {

      res.status(500).json({
         message: err.message
      });

   }

};
const getNotices = async (req,res) => {

   const notices = await Notice.find();

   res.json(notices);

};
const updateNotice = async (req, res) => {

   try {

      const notice = await Notice.findByIdAndUpdate(
         req.params.id,
         req.body,
         { new: true }
      );

      if (!notice) {

         return res.status(404).json({
            message: "Notice not found"
         });

      }

      res.json({
         message: "Notice updated successfully",
         notice
      });

   } catch (err) {

      res.status(500).json({
         message: err.message
      });

   }

};
module.exports = {
   createNotice,
   getNotices,
   deleteNotice,
   updateNotice
};
