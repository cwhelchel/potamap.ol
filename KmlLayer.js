'use strict';

import KML from 'ol/format/KML.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import { Style, Stroke, Fill, Icon, Text } from 'ol/style.js';

const kmlRouteStyle = [
    new Style({
        stroke: new Stroke({
            color: '#0026ff',
            width: 4.00,
        }),
        fill: new Fill({ color: '#0026ff' })
    }),
];

const kmlFormat = new KML({
    extractStyles: false
});


export class KmlLayer {

    #vectorLayer;
    #vectorSource;

    /**
     * 
     * @param {*} title: str - title used for layer. 
     */
    constructor({ title, data, projection }) {
        // Create an empty Vector Source and Layer to hold the uploaded KML
        this.#vectorSource = new VectorSource();
        this.#vectorLayer = new VectorLayer({
            title: title,
            source: this.#vectorSource,
            style: function (feature) {
                const geometryType = feature.getGeometry().getType();
                const waypointName = feature.get('name') || '';

                // Only apply the custom icon marker if the KML feature is a Point (Waypoint)
                if (geometryType === 'Point') {
                    return KmlLayer.getWaypointStyle(waypointName);
                }
                if (geometryType === "LineString") {
                    return kmlRouteStyle;
                }
                // Return undefined to let lines/polygons use default OpenLayers styles
                return undefined;
            }
        });

        if (data !== undefined && data !== null) {
            // initialize from data obj
            const kmlText = data;

            try {
                const features = kmlFormat.readFeatures(kmlText, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: projection
                });

                this.#vectorSource.clear();

                if (features.length > 0) {
                    features.forEach((feat) => {
                        feat.set('type', 'kml');
                    });

                    // Add the new parsed features to the map source
                    this.#vectorSource.addFeatures(features);
                } else {
                    alert('No valid features found in this KML file.');
                }
            } catch (error) {
                console.error("Parsing from localStorage failed:", error);
                alert('Error parsing KML file. Please ensure it is a valid format.');
            }
        }
    }

    get vectorSource() {
        return this.#vectorSource;
    }
    set vectorSource(val) {
        return this.#vectorSource = val;
    }

    get vectorLayer() {
        return this.#vectorLayer;
    }
    set vectorLayer(val) {
        return this.#vectorLayer = val;
    }

    /**
     * 
     * @param {string} waypoint name
     * @returns ol.Style obj
     */
    static getWaypointStyle(name) {
        return new Style({
            image: new Icon({
                anchor: [0.5, 0.5],
                src: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                scale: 0.5
            }),
            text: new Text({
                text: name,
                offsetY: -25, // Positions text above the marker icon
                font: 'bold 12px sans-serif',
                fill: new Fill({ color: '#000000' }),
                stroke: new Stroke({ color: '#FFFFFF', width: 2 }) // White outline for readability
            })
        })
    }

    static handleKmlUpload(file, map, vectorSource) {
        const reader = new FileReader();

        // Triggered when file has been fully read into memory
        reader.onload = function (e) {
            const kmlText = e.target.result;
            const name = file.name.replace(' ', '_').replace('.', '_');

            console.log('handleKmlUpload', e);

            localStorage.setItem(`kml_${name}`, kmlText);

            try {
                // Parse KML text strings into OpenLayers Feature objects
                const features = kmlFormat.readFeatures(kmlText, {
                    // Standard lat/lon projection used by KML files
                    dataProjection: 'EPSG:4326',
                    // Automatically convert coordinates to map view (usually EPSG:3857)
                    featureProjection: map.getView().getProjection()
                });

                // Clear any previously uploaded KML features
                vectorSource.clear();

                if (features.length > 0) {
                    features.forEach((feat) => {
                        feat.set('type', 'kml');
                    });
                    // Add the new parsed features to the map source
                    vectorSource.addFeatures(features);

                    // Dynamically center and zoom the map to fit the boundaries of the uploaded KML
                    const extent = vectorSource.getExtent();
                    map.getView().fit(extent, {
                        padding: [50, 50, 50, 50], // Add padding around features so they don't touch map borders
                        maxZoom: 16                // Prevent extreme zooming for tiny point features
                    });
                } else {
                    alert('No valid features found in this KML file.');
                }

            } catch (error) {
                console.error("Parsing failed:", error);
                alert('Error parsing KML file. Please ensure it is a valid format.');
            }
        };

        // Read file text content explicitly
        reader.readAsText(file);
    }
}