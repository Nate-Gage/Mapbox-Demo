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
import DarkModeIcon from "@mui/icons-material/DarkMode";

export const ThemeContext = React.createContext(true);

mapboxgl.accessToken =
  process.env.REACT_APP_ACCESS_TOKEN !== undefined
    ? process.env.REACT_APP_ACCESS_TOKEN
    : "";

const App: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const FILENAME = "location_data";
  const url = "/map";
  const F = "Fahrenheit";
  const C = "Celsius";
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [lng, setLng] = useState<number>(-95.995);
  const [lat, setLat] = useState<number>(39.765);
  const [zoom, setZoom] = useState<number>(3.5);
  const [unit, setUnit] = useState<string>(F);

  const toggleMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const Inputs = () => {
    return (
      <>
        <img
          src="../mapbox-logo.png"
          style={{ width: "80%", marginBottom: "30px" }}
          alt="logo"
        />
        <Typography>
          Upload a file and click on the markers to display the temperature.
        </Typography>
        <br />
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
            <FormControlLabel value={F} control={<Radio />} label={F} />
            <FormControlLabel value={C} control={<Radio />} label={C} />
          </RadioGroup>
        </FormControl>
        <br />
        <DarkModeIcon
          style={{ marginTop: "60px", float: "left", cursor: "pointer" }}
          onClick={toggleMode}
        />
      </>
    );
  };

  /**
   * Takes uploaded file and saves temperature data.
   */
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
    });

    getTemperatures();
  };

  /**
   * Creates markers on Mapbox
   */
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

          // make a marker for each location object and add to the map
          new mapboxgl.Marker(el)
            .setLngLat(city.coordinates)
            .setPopup(popup)
            .addTo(map.current!);
        }
      }
    },
    [unit]
  );

  /**
   * Sets state of temperature unit
   * @param event React.ChangeEvent
   */
  const handleChangeUnit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnit(event.target.value);
  };

  /**
   * It is possible to convert the temperature unit from the client, however from
   * my understanding, the instructions asked that the unit be sent as a flag
   * in a request when the user wants to convert the temperature.
   */
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

  /**
   * Initialize map
   */
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  /**
   * Map movement
   */
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(parseInt(map?.current?.getCenter().lng.toFixed(4)!));
      setLat(parseInt(map?.current?.getCenter().lat.toFixed(4)!));
      setZoom(parseInt(map?.current?.getZoom().toFixed(2)!));
    });
  });

  /**
   * Calls function to set markers
   */
  useEffect(() => {
    handleSetMarkers(locations);
  }, [locations, handleSetMarkers]);

  /**
   * Calls function to get temperatures with updated unit
   */
  useEffect(() => {
    if (locations.length > 0) {
      getTemperatures();
    }
  }, [unit, locations.length, getTemperatures]);

  return (
    <ThemeContext.Provider value={darkMode}>
      <Box className="App">
        <Grid container className="App-header" sx={{ width: "90%" }}>
          <Grid item xs={3}>
            <Inputs />
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
    </ThemeContext.Provider>
  );
};

export default App;
