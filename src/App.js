import React, { useRef, useEffect, useState } from "react";
// import { Upload } from "upload-js";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

mapboxgl.accessToken = process.env.REACT_APP_ACCESS_TOKEN;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

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

  return (
    <Box className="App">
      <Grid container className="App-header">
        <Grid item xs={3} sx={{ marginLeft: "auto", marginRight: "auto" }}>
          <img src="../My project.png" alt="logo" />
          <Button variant="contained" size="large">
            Convert to Celsius
          </Button>
        </Grid>
        <Grid item xs={9}>
          <div ref={mapContainer} className="map-container" />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
