import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

mapboxgl.accessToken = process.env.REACT_APP_ACCESS_TOKEN;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [lng, setLng] = useState(-104.995);
  const [lat, setLat] = useState(39.765);
  const [zoom, setZoom] = useState(3);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // await axios.post("http://localhost:3300/");

  //     await axios.get("http://localhost:3300/").then((res) => {
  //       setLocations(res.data);
  //     });
  //   };
  //   fetchData();
  // }, []);

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

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "http://localhost:3300/";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    console.log(formData);

    // await axios.post(url, formData, config);

    // await axios.get("http://localhost:3300/").then((res) => {
    //   setLocations(res.data);
    // });
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
          <form onSubmit={handleSubmit}>
            <input type="file" id="input" onChange={handleChange} />
            <button type="submit">Upload</button>
          </form>
          {loading && (
            <LinearProgress
              style={{
                paddingBottom: "3px",
                width: "60%",
              }}
            />
          )}
          <FormControl sx={{ marginTop: "30px" }}>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="a"
                control={<Radio />}
                label="Farenheit"
              />
              <FormControlLabel value="b" control={<Radio />} label="Celsius" />
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
