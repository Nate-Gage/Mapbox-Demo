import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors' ;
import router from './routes/router'
import log, { LogLevelDesc } from "loglevel";

require("dotenv").config();

const app = express();
const PORT = 3300;

log.setLevel(process.env.LOG_LEVEL as LogLevelDesc);

app.use(cors())
app.use(express.json());  

app.use("/map", router);

// A very simple error-handling middleware. In a production
// system this would be more robust
const jsonErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  log.error(err.stack);
  res.status(500).send({ message: err.message });
};
app.use(jsonErrorHandler);

app.listen(PORT, () => {
  log.info(`App is listening at http://localhost:${PORT}`);
});
