const express = require("express");
const router = express.Router();

const { postFormulaire } = require("../controllers/form");

router.route("/").post(postFormulaire);

module.exports = router;
