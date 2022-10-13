import React, { useRef, useEffect, useState, useCallback } from "react";
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
  const url = "http://localhost:3300/map";
  const F = "Fahrenheit";
  const [locations, setLocations] = useState<Location[]>([]);
  const [lng, setLng] = useState<number>(-95.995);
  const [lat, setLat] = useState<number>(39.765);
  const [zoom, setZoom] = useState<number>(3.5);
  const [unit, setUnit] = useState<string>("Fahrenheit");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    let file = e.target.files[0];
    const formData = new FormData();
    formData.append(FILENAME, file);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    await axios.post(url, formData, config).catch((err) => {
      window.alert(err.response.data.message);
      console.log(err);
    });

    getTemperatures();
  };

  const handleSetMarkers = useCallback(
    (data: Location[]) => {
      if (data.length > 0) {
        for (const city of data) {
          // create a HTML element for each feature
          const el = document.createElement("div");
          el.className = "marker";

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
    },
    [unit]
  );

  const handleChangeUnit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnit(event.target.value);
  };

  // It is possible to convert the temperature unit from the client, however from
  // my understanding, the instructions asked that the unit be sent as a flag 
  // in a request when the user wants to convert the temperature. 
  const getTemperatures = useCallback(() => {
    axios
      .get(`${url}?unit=${unit}`)
      .then((res) => {
        setLocations(res.data);
      })
      .catch((err) => {
        window.alert(err.response.data.message);
      });
  }, [unit]);

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

  // map movement
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
    handleSetMarkers(locations);
  }, [locations, handleSetMarkers]);

  // update unit
  useEffect(() => {
    if (locations.length > 0) {
      getTemperatures();
    }
  }, [unit, locations.length, getTemperatures]);

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
            style={{ border: "2px solid #6384DB" }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default App;
