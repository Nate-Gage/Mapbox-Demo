import { Router } from 'express' ;
import { getTemps, saveTemps }  from '../controllers/mapController';
import multer from 'multer';

const router = Router();
const multiPart = multer();

const FILENAME = "location_data";

// For this demo the routes use the built in error handling of express
// This is done by passing next to .catch()
router.get("/", (req, res, next) => {
  getTemps(req, res).catch(next);
});

router.post("/", multiPart.single(FILENAME), (req, res, next) => {
  saveTemps(req, res).catch(next);
});

export default router;
