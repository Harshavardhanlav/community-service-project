const express = require("express");
const router = express.Router();
const {createNotice, getNotices} = require("../controllers/noticeController");
router.post("/create-notice",createNotice);
router.get("/", getNotices);
module.exports = router;

