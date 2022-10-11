import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

mapboxgl.accessToken = process.env.REACT_APP_ACCESS_TOKEN;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const FILENAME = "location_data";
  const [locations, setLocations] = useState([]);
  const [lng, setLng] = useState(-104.995);
  const [lat, setLat] = useState(39.765);
  const [zoom, setZoom] = useState(4);

  //Initialize map
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
    for (const city of locations) {
      // create a HTML element for each feature
      const el = document.createElement("div");
      el.className = "marker";

      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el).setLngLat(city.coordinates).addTo(map.current);
    }
  }, [locations]);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    const url = "http://localhost:3300/save";
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

    await axios.get("http://localhost:3300/fetch").then((res) => {
      setLocations(res.data);
    });
  };

  return (
    <Box className="App">
      <Grid container className="App-header" sx={{ width: "90%" }}>
        <Grid item xs={3} sx={{ marginLeft: "auto", marginRight: "auto" }}>
          <img
            src="../mapbox_logo.png"
            style={{ height: "40%", marginBottom: "30px" }}
            alt="logo"
          />
          <h6 style={{ marginBottom: "0px" }}>Upload a File</h6>
          <input type="file" onChange={handleChange} />
          <br />
          <FormControl sx={{ marginTop: "30px" }}>
            <RadioGroup
              row
              aria-labelledby="mapbox-demo-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue="Fahrenheit"
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
