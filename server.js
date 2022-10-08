require("dotenv").config();
const cors = require("cors");
const express = require("express");
const log = require("loglevel");
const router = require("./routes/router");
const PORT = 3300;
const app = express();

log.setLevel(process.env.LOG_LEVEL);

app.use(cors())
app.use(express.json());
app.use("/", router);

// A very simple error-handling middleware. In a production
// system this would be more robust
const jsonErrorHandler = (err, req, res, next) => {
  log.error(err.stack);
  res.status(500).send({ error: err.message });
};
app.use(jsonErrorHandler);

app.listen(PORT, (error) => {
  if (error) {
    log.error("Error at server start: ", error);
  } else {
    log.info("Server listening on port: " + PORT);
  }
});
