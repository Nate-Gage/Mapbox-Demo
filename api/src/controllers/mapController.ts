import { Request, Response } from "express";
import { Location } from "../models/Location";
const RESOURCE_CREATED = 201;
const C = "Celsius";

//Data would normally be managed by a back-end database
//In this case I just hold the data in memory
let temperatureData: Location[] = [];

/**
 * Converted temperature to Celsius
 * @param temp The temperature to be converted.
 * @returns The converted temperature.
 */
export const toCelsius = (temp: string) => {
  return parseFloat((((parseInt(temp) - 32) * 5) / 9).toFixed(2));
};

/**
 * Gets temperatures from memory and converts unit based on req.query.unit
 * @param req
 * @param res
 */
export const getTemps = (req: Request, res: Response) => {
  //default is Farenheit
  if (req.query.unit === C) {
    const converted = temperatureData.map((city) => {
      return { ...city, temp: toCelsius(city.temp) };
    });

    res.send(converted);
  } else {
    res.send(temperatureData);
  }
};

/**
 * Saves uploaded temperature data
 * @param req
 * @param res
 */
export const saveTemps = (req: Request, res: Response) => {
  temperatureData = JSON.parse(req.file!.buffer.toString());
  res
    .status(RESOURCE_CREATED)
    .set({
      Location: "/map",
    })
    .send();
};

module.exports = {
  toCelsius,
  saveTemps,
  getTemps,
};
