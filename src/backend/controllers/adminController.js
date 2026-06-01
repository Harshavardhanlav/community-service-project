const Admin = require("../models/adminSchema");

const createAdmin = async (req, res) => {

   try {

      const existingAdmin = await Admin.findOne();

      if(existingAdmin){

         return res.status(400).json({
            message:"Admin already exists"
         });

      }

      const admin = await Admin.create(req.body);

      res.status(201).json({
         message:"Admin created successfully",
         admin
      });

   } catch(err){

      res.status(500).json({
         message: err.message
      });

   }

};

module.exports = createAdmin ;