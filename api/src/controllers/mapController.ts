import { Request, Response } from 'express';
import { Location }  from '../models/Location'
const RESOURCE_CREATED = 201;

//Data would normally be managed by a back-end database
//In this case I just hold the data in memory
let temperatureData: Location[] = [];

const toCelsius = (temp: string) => {
  return (((parseInt(temp) - 32) * 5) / 9).toFixed(2);
};

export const getTemps = async (req: Request, res: Response) => {
  //default is Farenheit
  if (req.query.unit === "Celsius") {
    const converted = temperatureData.map((city) => {
      return { ...city, temp: toCelsius(city.temp) };
    });
    res.send(converted);
  } else {
    res.send(temperatureData)
  }
};

export const saveTemps = async (req: Request, res: Response) => {
  temperatureData = JSON.parse(req.file!.buffer.toString());
  res
    .status(RESOURCE_CREATED)
    .set({
      Location: "/fetch",
    })
    .send();
};