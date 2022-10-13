"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mapController_1 = require("../controllers/mapController");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const multiPart = (0, multer_1.default)();
const FILENAME = "location_data";
// For this demo the routes use the built in error handling of express
// This is done by passing next to .catch()
router.get("/", (req, res, next) => {
    (0, mapController_1.getTemps)(req, res).catch(next);
});
router.post("/", multiPart.single(FILENAME), (req, res, next) => {
    (0, mapController_1.saveTemps)(req, res).catch(next);
});
exports.default = router;
