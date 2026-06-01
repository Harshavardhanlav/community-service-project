const express = require("express");

const router = express.Router();

const {
   addCalendarDate,
   getCalendarDates,
   updateCalendarDate
} = require("../controllers/calenderController");

router.post("/add-date", addCalendarDate);

router.get("/", getCalendarDates);

router.put("/update/:id", updateCalendarDate);

module.exports = router;