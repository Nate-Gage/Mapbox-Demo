import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors' ;
import router from './routes/router'
import log, { LogLevelDesc } from "loglevel";
import path from 'path';

require("dotenv").config();

const app = express();
const PORT = 3300;

log.setLevel(process.env.LOG_LEVEL as LogLevelDesc);

app.use(express.static(path.join(__dirname,  "../../client", "build")));

app.use("/map", router);

/**
 * Simple error-handling middleware. In a production system this would be more robust
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  log.error(err.stack);
  res.status(500).send({ message: err.message });
};
app.use(errorHandler);

app.listen(PORT, () => {
  log.info(`App is listening at http://localhost:${PORT}`);
});
