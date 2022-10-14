# Mapbox Demo - Nate Gage

## Overview

This application was built in React Typescript, Node.js, and published on Dockerhub.

This application uses the Mapbox API to display temperatures for a group of cities from a simple JSON file. The user has the ability to switch between Fahrenheit and Celsius which sends a flag in the request to convert the temperature on the backend. JSON data is stored in memory, and the file to upload is in the root of the project, named location_data.json.

To run the project locally:

- Clone the project
- Run 'npm install'
- 'npm run build'
- 'npm run start' from /api to start the Express server.
- 'npm run start' from /client, to run the web server.
- View the app at localhost:3000

To use the Dockerized version of the app:

- From the root of the project, run 'docker-compose up'
- View the app at localhost:3000

You can expect to see the below UI:
<img src="./client/public/screen shot.png" />

## Notes
I checked in .env files. Normally in a production instance these would instead be managed
through a DevOps system. For simplicity, I used the default web server that comes with Create-React-App. This is running in development mode, but wouldn't be used in a production system.  

Thank you!