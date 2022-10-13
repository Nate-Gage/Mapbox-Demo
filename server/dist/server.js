"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./routes/router"));
const loglevel_1 = __importDefault(require("loglevel"));
const path_1 = __importDefault(require("path"));
require("dotenv").config();
const app = (0, express_1.default)();
const PORT = 80;
loglevel_1.default.setLevel(process.env.LOG_LEVEL);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//express will serve the react pages
let buildPath = path_1.default.join(__dirname, '../../app/', 'build');
app.use(express_1.default.static(buildPath));
app.get('/', function (res) {
    res.sendFile(path_1.default + "/index.html");
});
app.use("/map", router_1.default);
// A very simple error-handling middleware. In a production
// system this would be more robust
const jsonErrorHandler = (err, req, res, next) => {
    loglevel_1.default.error(err.stack);
    res.status(500).send({ error: err.message });
};
app.use(jsonErrorHandler);
app.listen(PORT, () => {
    loglevel_1.default.info(`App is listening at http://localhost:${PORT}`);
});
