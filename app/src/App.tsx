import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import mapboxgl from "mapbox-gl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";
import { Location } from "./components/Location";

mapboxgl.accessToken =
  process.env.REACT_APP_ACCESS_TOKEN !== undefined
    ? process.env.REACT_APP_ACCESS_TOKEN
    : "";

const App: React.FC = () => {
  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const FILENAME = "location_data";
  const C = "Celsius";
  const F = "Fahrenheit";
  const [locations, setLocations] = useState<Location[]>([]);
  const [lng, setLng] = useState<number>(-95.995);
  const [lat, setLat] = useState<number>(39.765);
  const [zoom, setZoom] = useState<number>(3.5);
  const [unit, setUnit] = useState<string>("Fahrenheit");

  // Initialize map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map?.current?.getCenter().lng.toFixed(4));
      setLat(map?.current?.getCenter().lat.toFixed(4));
      setZoom(map?.current?.getZoom().toFixed(2));
    });
  });

  // add markers to map
  useEffect(() => {
    if (locations !== null) {
      for (const city of locations) {
        // create a HTML element for each feature
        const el = document.createElement("div");
        el.className = "marker";

        console.log("the markers useEffect");

        let popup = new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(
            `<h3>${city.city}</h3><p>Temperature: ${city.temp} ${unit}</p>`
          );

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
          .setLngLat(city.coordinates)
          .setPopup(popup)
          .addTo(map.current!);
      }
    }
  }, [locations]);

  // convert temp on the client after markers are set
  useEffect(() => {
    if (locations !== null) {
      const convertTemp = (temp: string) => {
        if (unit === C) {
          return (((parseInt(temp) - 32) * 5) / 9).toFixed(2);
        } else {
          //assume Fahrenheit
          return ((parseInt(temp) * 9) / 5 + 32).toFixed(2);
        }
      };

      console.log("the unit useeffect");

      let converted: Location[];
      converted = locations.map((city) => {
        return { ...city, temp: convertTemp(city.temp) };
      });
      setLocations(converted);
    }
  }, [unit]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    console.log("THERE ARE FILES");

    let file = e.target.files[0];
    const url = "http://localhost/map";
    const formData = new FormData();

    formData.append(FILENAME, file);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    await axios.post(url, formData, config).catch((err) => {
      console.log(err);
    });

    axios
      .get(`${url}?unit=${unit}`)
      .then((res) => {
        setLocations(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeUnit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnit(event.target.value);
  };

  return (
    <Box className="App">
      <Grid container className="App-header" sx={{ width: "90%" }}>
        <Grid item xs={3}>
          <img
            src="../mapbox-logo.png"
            style={{ width: "80%", marginBottom: "30px" }}
            alt="logo"
          />
          <Typography>
            Upload a file and click on the markers to display the temperature.
          </Typography>
          <br></br>
          <input type="file" name="file-upload" onChange={handleFileUpload} />
          <br />
          <Typography sx={{ marginTop: "60px" }}>Select a Unit</Typography>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="mapbox-demo-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue={F}
              onChange={handleChangeUnit}
            >
              <FormControlLabel
                value="Fahrenheit"
                control={<Radio />}
                label="Fahrenheit"
              />
              <FormControlLabel
                value="Celsius"
                control={<Radio />}
                label="Celsius"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={9}>
          <div
            ref={mapContainer}
            className="map-container"
            style={{ border: "2px solid #1976d2" }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default App;
