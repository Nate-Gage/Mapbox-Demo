import { Router } from "express";
import { getTemps, saveTemps } from "../controllers/mapController";
import multer from "multer";

const router = Router();
const multiPart = multer();

const FILENAME = "location_data";

/**
 * Route for getting temperature data
 */
router.get("/", (req, res) => {
  getTemps(req, res);
});

/**
 * Route for saving temperature data
 */
router.post("/", multiPart.single(FILENAME), (req, res) => {
  saveTemps(req, res);
});

export default router;
