const RESOURCE_CREATED = 201;

//Data would normally be managed by a back-end database
//In this case I just hold the data in memory
let temperatureData;

// I made these functions asynchronous since these would normally
// be doing, for example, network calls to a database
const getTemps = async (req, res) => {
  res.send(temperatureData);
};

const saveTemps = async (req, res) => {
  temperatureData = JSON.parse(req.file.buffer.toString());
  res
    .status(RESOURCE_CREATED)
    .set({
      Location: "/fetch",
    })
    .send();
};

module.exports = {
  getTemps,
  saveTemps,
};
