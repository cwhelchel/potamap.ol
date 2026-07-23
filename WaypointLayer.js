'use strict';

import KML from 'ol/format/KML.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import Overlay from 'ol/Overlay.js';
import { fromLonLat } from 'ol/proj';
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

const dynamicStyleFunction = function (feature) {
    const dynamicTitle = feature.get('title') || 'Untitled';
    return new Style({
        image: new Icon({
            anchor: [0.5, 0.5],
            src: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            scale: 0.5
        }),
        text: new Text({
            text: dynamicTitle,
            offsetY: -25, // Positions text above the marker icon
            font: 'bold 12px sans-serif',
            fill: new Fill({ color: '#000000' }),
            stroke: new Stroke({ color: '#FFFFFF', width: 2 }) // White outline for readability
        })
    })
}

/*
 * hook up the HTML elements needed for the waypoint layer.
 */

// get popup dom stuff
const container = document.getElementById('waypoint-popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');
const waypointInput = document.getElementById('waypoint-input');

// create the Overlay. This is exported below
const waypoint_overlay = new Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: { duration: 250 }
});

// hookup close popup button
closer.onclick = function () {
    waypoint_overlay.setPosition(undefined);
    closer.blur();
    return false;
};

/**
 * Waypoint Layer class. Handles loading, showing, adding, removing user defined
 * waypoints.
 */
export class WaypointLayer {

    #vectorLayer;
    #vectorSource;
    #projection;

    /**
     * 
     * @param {*} title: str - title used for layer. 
     */
    constructor({ title, saveBtn, mapProjection }) {
        this.#vectorSource = new VectorSource();
        this.#vectorLayer = new VectorLayer({
            title: title,
            source: this.#vectorSource,
            style: dynamicStyleFunction
        });
        this.#projection = mapProjection;

        console.log(saveBtn);
        saveBtn.addEventListener('click', this.saveBtnClick.bind(this), false);

        this.#initFromStorage();
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
     * Removes all features from source and clears localStorage.
     */
    clear() {
        this.#vectorSource.clear();
        localStorage.setItem('user_waypoints', '');
    }

    /**
     * Remove individual waypoint feature from source.
     * 
     * @param {FeatureLike} feature 
     */
    removeWaypoint(feature) {
        if (feature) {
            this.#vectorSource.removeFeature(feature);
            this.#saveLayerToLocalStorage();
        }
    }

    /**
     * Button click handler tied to the Save button on waypoint popup. Parses
     * coords of click and places waypoint marker.
     * 
     * @param {Event} event 
     */
    saveBtnClick(event) {
        event.preventDefault();

        const text = $("#hidden-coordinates").val();
        const ll = text;
        const llArray = JSON.parse(ll);
        const clickedCoordinate = fromLonLat(llArray);

        const textValue = waypointInput.value;

        // console.log('saveBtnClick', clickedCoordinate, textValue, text);

        if (textValue && clickedCoordinate) {
            // Create the waypoint feature
            const waypointFeature = new Feature({
                geometry: new Point(clickedCoordinate),
                name: textValue,
                title: textValue,
                type: "kml"
            });

            this.#vectorSource.addFeature(waypointFeature);

            // Hide popup after saving
            waypoint_overlay.setPosition(undefined);

            this.#saveLayerToLocalStorage();

            waypointInput.value = "";
            $("#hidden-coordinates").val("");
        }
    }

    /**
     * Loads features saved in localStorage key 'user_waypoints' into the layer.
     */
    #initFromStorage() {
        const kmlText = localStorage.getItem('user_waypoints') || '';

        // console.log('initFromStorage', kmlText, kmlText.length);

        if (kmlText === undefined || kmlText === null)
            return;

        if (kmlText.length == 0) {
            return;
        }

        try {
            const features = kmlFormat.readFeatures(kmlText, {
                dataProjection: 'EPSG:4326',
                featureProjection: this.#projection
            });

            this.#vectorSource.clear();

            if (features.length > 0) {
                features.forEach((feat) => {
                    feat.set('type', 'kml');
                });

                // Add the new parsed features to the map source
                this.#vectorSource.addFeatures(features);
            } else {
                // an featureless kml still gets generated on chrome when layer 
                // is cleared. bypassing the empty string checks above.
                console.log('No valid features found user_waypoints KML data.');
            }
        } catch (error) {
            console.error("Parsing from localStorage failed:", error);
            alert('Error parsing KML file. Please ensure it is a valid format.');
        }
    }

    /**
     * Saves the features in the waypoint layer's vectorSource as KML text in
     * the browser's localStorage. key 'user_waypoints'.
     */
    #saveLayerToLocalStorage() {
        const features = this.#vectorSource.getFeatures();
        const kmlFormat = new KML();
        const kmlText = kmlFormat.writeFeatures(features, {
            featureProjection: this.#projection, // map's proj
            dataProjection: 'EPSG:4326' // kml projection
        });

        localStorage.setItem('user_waypoints', kmlText);
    }
}

export { waypoint_overlay };