const express = require("express");
const router = express.Router();
const tempController = require("../controllers/mapController");

// For this demo the routes use the built in error handling of express
// This is done by passing next to .catch()

router.get("/",  (req, res, next) => {
  tempController.getTemps(req, res).catch(next)
});

router.post("/",  (req, res, next) => {
  tempController.saveTemps(req, res).catch(next);
});

module.exports = router;