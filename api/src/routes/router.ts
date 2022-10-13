import { Router } from "express";
import { getTemps, saveTemps } from "../controllers/mapController";
import multer from "multer";

const router = Router();
const multiPart = multer();

const FILENAME = "location_data";

router.get("/", (req, res, next) => {
  getTemps(req, res);
});

router.post("/", multiPart.single(FILENAME), (req, res, next) => {
  saveTemps(req, res);
});

export default router;
