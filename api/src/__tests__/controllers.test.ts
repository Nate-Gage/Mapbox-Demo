import httpMocks from "node-mocks-http";
import { toCelsius, getTemps } from "../controllers/mapController";

const sum = (a: number, b: number) => a + b;

describe("controller functions inside mapController.ts", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
  });

  test("convert temp to celsius", () => {
    let converted = toCelsius("70");
    expect(converted).toEqual(21.11);
  });

/**
 * We expect this to return empty array, since
 * we store temperatureData in memory and it gets 
 * initialized as an empty array in mapController.ts.
 */
  test("get temperature data", () => {
    const request = httpMocks.createRequest({
      method: "GET",
      url: "/",
      query: {
        unit: "Celsius",
      },
    });

    const response = httpMocks.createResponse();

    getTemps(request, response);

    let data = response._getData();

    expect(data).toEqual([]);
  });
});
