const express = require("express");
const router = express.Router();
const classes = require("./class");
const student = require("./student");
const auth = require("./auth");

router.use("/auth", auth);
router.use("/classes", classes);
router.use("/students", student);

module.exports = router;
