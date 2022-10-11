import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";

mapboxgl.accessToken = process.env.REACT_APP_ACCESS_TOKEN;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const FILENAME = "location_data";
  const [locations, setLocations] = useState(null);
  const [lng, setLng] = useState(-95.995);
  const [lat, setLat] = useState(39.765);
  const [zoom, setZoom] = useState(3.5);
  const [unit, setUnit] = useState("Fahrenheit");

  // Initialize map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  // add markers to map
  useEffect(() => {
    if (locations !== null) {
      for (const city of locations) {
        // create a HTML element for each feature
        const el = document.createElement("div");
        el.className = "marker";

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
          .setLngLat(city.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(
                `<h3>${city.city}</h3><p>Temperature: ${city.temp} ${unit}</p>`
              )
          )
          .addTo(map.current);
      }
    }
  }, [locations, unit]);

  // convert temp on the client after markers are set
  useEffect(() => {
    if (locations !== null) {
      const convertTemp = (temp) => {
        if (unit === "Celsius") {
          return (((temp - 32) * 5) / 9).toFixed(2);
        } else if (unit === "Fahrenheit") {
          return ((temp * 9) / 5 + 32).toFixed(2);
        }
      };

      let converted;
      converted = locations.map((city) => {
        return { ...city, temp: convertTemp(city.temp) };
      });

      setLocations(converted);
    }
  }, [unit]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const url = "http://localhost:3300/map";
    const formData = new FormData();

    formData.append(FILENAME, file);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    await axios
      .post(url, formData, config)
      .then((res) => {
        console.log("res.data: " + res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    await axios.get(`${url}?unit=${unit}`).then((res) => {
      setLocations(res.data);
    });
  };

  const handleChangeUnit = (e) => {
    setUnit(e.target.value);
  };

  return (
    <Box className="App">
      <Grid container className="App-header" sx={{ width: "90%" }}>
        <Grid item xs={3}>
          <img
            src="../mapbox_logo.png"
            style={{ height: "40%", marginBottom: "30px" }}
            alt="logo"
          />
          <Typography>
            Upload a file and click on the markers to show the temperature in
            that city.
          </Typography>
          <input type="file" onChange={handleFileUpload} />
          <br />
          <Typography sx={{ marginTop: "60px" }}>
            <strong>Select a Unit</strong>
          </Typography>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="mapbox-demo-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue="Fahrenheit"
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
}

export default App;
