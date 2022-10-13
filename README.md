# VAISALA - MAPBOX DEMO - NATE GAGE

## Overview

This application was built in React Typescript, Node.js, and published on Dockerhub.

This application uses the Mapbox API to display temperatures for a group of cities from a simple JSON file. The user has the ability to switch between Fahrenheit and Celsius which sends a flag in the request to convert the temperature on the backend. JSON data is stored in memory, and the file to upload is in the root of the project, named location_data.json.

To run the project locally:

- Clone the project
- Run 'npm start' from /api to start the Express server.
- Run 'npm start' from /client, to run the web server.
- View the app at localhost:3000

To use the Dockerized version of the app:

- From the CLI, run 'docker pull nategage/mapbox-demo'
- Run 'docker-compose up'
- View the app at localhost:3000

<img src="./client/public/screen shot.png" />
