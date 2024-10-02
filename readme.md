# POTAMAP Online

_Or POTAMAP openlayers_

Displays POTA park pins along with map boundaries from US government supplied GIS data. Namely the source is the [Protected Areas Database of the United States](https://www.sciencebase.gov/catalog/item/62226321d34ee0c6b38b6be3) (PAD-US)

## Building

Uses Node.js, openlayers, and Vite. With node.js installed, use this to get started:

    $ npm install

To run the app use:

    $ npm run start

## Notes

Some geojson boundary files need be tweaked with a GIS tool called mapshaper

Install with `npm install -g mapshaper`


Then the maps can simplified (thus reducing the file size) using mapshaper: 

    mapshaper .\PADUS3_0Designation_StateNV.geojson -simplify dp 30% keep-shapes -o format=geojson .\simple.geojson

### Merging park shapes

To merge some geomoerty in geojson files, first output the properties into a csv file:

    mapshaper .\simple.geojson -o simple.csv

Edit the csv file. Copy and paste the name column (header+data) into a new column and rename it MERGED

Then run the following command to join the shapes by their name and dissolve the inner
geometry (it also keeps the original properties)

    mapshaper .\simple.geojson -join .\simple.csv keys="NAME,NAME" -dissolve MERGED copy-fields='NAME,OWNTYPE,OWNNAME,MANTYPE,MANNAME' -o simple2.geojson

### Add a property to all features in a geojson

    mapshaper .\counties.geojson -each 'this.properties.type = \"county\"' -o test.geojson  

## Trails

Check here:

https://nps.maps.arcgis.com/apps/webappviewer/index.html?id=24fc463363f54929833580280cc1a751

Dissolving trails created from potamap_tool:

mapshaper .\safe.geojson -dissolve "NAME,NAME_EXT" -o format=geojson .\safe2.geojson

This should keep the NAME property and NAME_EXT property in tact.

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
