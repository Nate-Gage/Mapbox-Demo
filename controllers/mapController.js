const RESOURCE_CREATED = 201;
const C = "Celsius";

//Data would normally be managed by a back-end database
//In this case I just hold the data in memory
let temperatureData;

const toCelsius = (temp) => {
  return (((temp - 32) * 5) / 9).toFixed(2);
};

// I made these functions asynchronous since these would normally
// be doing, for example, network calls to a database
const getTemps = async (req, res) => {
  if (req.query.unit === C) {
    const converted = temperatureData.map((city) => {
      return { ...city, temp: toCelsius(city.temp) };
    });
    res.send(converted);
  } else {
    res.send(temperatureData);
  }
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
