"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTemps = exports.getTemps = void 0;
const RESOURCE_CREATED = 201;
//Data would normally be managed by a back-end database
//In this case I just hold the data in memory
let temperatureData = [];
const toCelsius = (temp) => {
    return (((parseInt(temp) - 32) * 5) / 9).toFixed(2);
};
const getTemps = async (req, res) => {
    //default is Farenheit
    if (req.query.unit === "Celsius") {
        const converted = temperatureData.map((city) => {
            return { ...city, temp: toCelsius(city.temp) };
        });
        res.send(converted);
    }
    else {
        res.send(temperatureData);
    }
};
exports.getTemps = getTemps;
const saveTemps = async (req, res) => {
    temperatureData = JSON.parse(req.file.buffer.toString());
    res
        .status(RESOURCE_CREATED)
        .set({
        Location: "/fetch",
    })
        .send();
};
exports.saveTemps = saveTemps;
