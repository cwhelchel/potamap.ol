# OpenLayers + Vite

Uses Node.js, openlayers, and Vite use this to get started

    npm install ol

## Notes
some maps are simplified using mapshaper: 

    mapshaper .\PADUS3_0Designation_StateNV.geojson -simplify dp 30% keep-shapes -o format=geojson .\simple.geojson

To merge some geomoerty in geojson files. 1st output the properties into a csv file
    mapshaper .\simple.geojson -o simple.csv

Copy and paste the name column (header+data) into a new column and rename it MERGED

Then run the following command to join the shapes by their name and dissolve the inner
geometry (it also keeps the original properties)

    mapshaper .\simple.geojson -join .\simple.csv keys="NAME,NAME" -dissolve MERGED copy-fields='NAME,OWNTYPE,OWNNAME,MANTYPE,MANNAME' -o simple2.geojson


## Original setup instructions

This example demonstrates how the `ol` package can be used with [Vite](https://vitejs.dev/).

To get started, run the following (requires Node 14+):

    npx create-ol-app my-app --template vite

Then change into your new `my-app` directory and start a development server (available at http://localhost:5173):

    cd my-app
    npm start

To generate a build ready for production:

    npm run build

Then deploy the contents of the `dist` directory to your server.  You can also run `npm run serve` to serve the results of the `dist` directory for preview.
