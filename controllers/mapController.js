const RESOURCE_CREATED = 201;

//Data would normally be managed by a back-end database
//In this case I simply hold the data in memory
let temperatureData;

// I made these functions asynchronous since these would normally
// be doing, for example, network calls to a database

const getTemps = (req, res) => {
  res.send(temperatureData);
};

const saveTemps = (req, res) => {
  temperatureData = req.body;
  console.log("TEMP DATA: " + temperatureData);
  res.status(RESOURCE_CREATED).send();
};

module.exports = {
  getTemps,
  saveTemps,
};
