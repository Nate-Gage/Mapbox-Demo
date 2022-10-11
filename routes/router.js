const express = require("express");
const multer = require("multer");
const tempController = require("../controllers/mapController");
const upload = multer();
const router = express.Router();
const FILENAME = "location_data";

// For this demo the routes use the built in error handling of express
// This is done by passing next to .catch()
router.get("/", (req, res, next) => {
  tempController.getTemps(req, res).catch(next);
});

router.post("/", upload.single(FILENAME), (req, res, next) => {
  tempController.saveTemps(req, res).catch(next);
});

module.exports = router;
