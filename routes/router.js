const express = require("express");
const multer = require("multer");
const router = express.Router();
const tempController = require("../controllers/mapController");
const upload = multer();
const FILENAME = "location_data";

// For this demo the routes use the built in error handling of express
// This is done by passing next to .catch()
router.get("/fetch", (req, res, next) => {
  tempController.getTemps(req, res).catch(next);
});

router.post("/save", upload.single(FILENAME), (req, res, next) => {
  tempController.saveTemps(req, res).catch(next);
});

module.exports = router;
