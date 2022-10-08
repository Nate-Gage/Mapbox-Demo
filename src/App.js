import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.REACT_APP_ACCESS_TOKEN;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  const mystuff = {
    some: "stuff",
    to: "add",
  };

  useEffect(() => {
    const fetchData = async () => {
      await axios.post("http://localhost:3300/", mystuff);

      await axios.get("http://localhost:3300/").then((res) => {
        setData(JSON.stringify(res.data));
      });
    };
    fetchData();
  }, []);

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

  const handleChangeFile = (e) => {
    console.log("file changed: " + e.target.value);
  };

  return (
    <Box className="App">
      <Grid container className="App-header" sx={{ width: "90%" }}>
        <Grid item xs={3} sx={{ marginLeft: "auto", marginRight: "auto" }}>
          <img
            src="../mapbox_logo.png"
            style={{ height: "40%", marginBottom: "30px" }}
          />
          <h4 style={{ marginBottom: "0px" }}>UPLOAD A FILE</h4>
          <input type="file" onChange={(e) => handleChangeFile(e)} />
          {loading && (
            <LinearProgress
              style={{
                paddingBottom: "3px",
                width: "60%",
              }}
            />
          )}
          <Button
            variant="contained"
            size="large"
            sx={{ width: "80%", marginTop: "50px" }}
            disabled={data}
          >
            Convert to Celsius
          </Button>
        </Grid>
        <Grid item xs={9}>
          <div
            ref={mapContainer}
            className="map-container"
            style={{ border: "2px solid #1976d2" }}
          />
        </Grid>
        <p>{data}</p>
      </Grid>
    </Box>
  );
}

export default App;
