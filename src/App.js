import "./App.css";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken =
  "pk.eyJ1IjoibmF0ZWdhZ2UiLCJhIjoiY2w4eXRoeGVjMGlyMzNvbnpoY25pbjQ5MyJ9.REs9iG9rPkhfZ3ZdS-t8Kw";

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(-70.9);
  const [lat] = useState(42.35);
  const [zoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  return (
    <div className="App">
      <header className="App-header">
        <p>MAPBOX DEMO</p>
        <p>The Map:</p>
        <div ref={mapContainer} className="map-container" />
      </header>
    </div>
  );
}

export default App;
