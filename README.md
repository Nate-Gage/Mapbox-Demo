# Mapbox Demo - Nate Gage

## Overview

This application was built in React Typescript, Node.js, and published on Dockerhub.

This application uses the Mapbox API to display temperatures for a group of cities from a simple JSON file. The user has the ability to switch between Fahrenheit and Celsius which sends a flag in the request to convert the temperature on the backend. JSON data is stored in memory, and the file to upload is in the root of the project, named location_data.json.

To run the project locally:

- Clone the project
- From the root, Run 'npm run build' and then to start the application, run 'npm run start'. 
- View the app at localhost:3300

Dockerized version will be provided shortly.

You can expect to see the below UI
<img src="./client/public/screen shot.png" />

## Notes
Express is serving both the REST endpoints and the React static files. For simplicity, I checked in the .env files. Normally you wouldn't do this in a production instance. 

Thank you!