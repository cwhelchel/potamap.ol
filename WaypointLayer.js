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


/**
 * Waypoint Layer class. Handles loading, showing, adding, removing user defined
 * waypoints.
 */
export class WaypointLayer {

    #vectorLayer;
    #vectorSource;
    #projection;
    #editMode;
    #featureToEdit;

    /*
    * hook up the HTML elements needed for the waypoint layer.
    */
    #addContainer = document.getElementById('waypoint-popup');
    #addCloser = document.getElementById('popup-closer');
    #addWaypointInput = document.getElementById('waypoint-input');
    #addSaveBtn = document.getElementById('save-waypoint-btn');
    #addOverlay = new Overlay({
        element: this.#addContainer,
        autoPan: true,
        autoPanAnimation: { duration: 250 }
    });
    #editSaveBtn = document.getElementById('edit-waypoint-btn');
    #editCloser = document.getElementById('edit-popup-closer');
    #editContainer = document.getElementById('edit-waypoint-popup');
    #editWaypointInput = document.getElementById('edit-waypoint-input');
    #editOverlay = new Overlay({
        element: this.#editContainer,
        autoPan: true,
        autoPanAnimation: { duration: 250 }
    });

    /**
     * 
     * @param {*} title: str - title used for layer. 
     */
    constructor({ title, mapProjection }) {
        this.#editMode = false;
        this.#projection = mapProjection;

        this.#vectorSource = new VectorSource();
        this.#vectorLayer = new VectorLayer({
            title: title,
            source: this.#vectorSource,
            style: dynamicStyleFunction
        });

        this.#initFromStorage();

        // hook events for add/edit popups
        this.#addCloser.addEventListener('click', this.#closePopup.bind(this), false);
        this.#editCloser.addEventListener('click', this.#closeEditPopup.bind(this), false);

        this.#addSaveBtn.addEventListener('click', this.#saveBtnClick.bind(this), false);
        this.#editSaveBtn.addEventListener('click', this.#editSaveBtnClick.bind(this), false);
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

    get isEditMode() {
        return this.#editMode;
    }
    set isEditMode(val) {
        return this.#editMode = val;
    }

    get editOverlay() {
        return this.#editOverlay;
    }

    get addOverlay() {
        return this.#addOverlay;
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

    showAddWaypoint(event) {
        //waypoint_overlay.setPosition(evt.coordinate);
        this.#addOverlay.setPosition(event.coordinate);
        this.#addWaypointInput.focus();
    }

    /**
     * Button click handler tied to the Save button on waypoint popup. Parses
     * coords of click and places waypoint marker.
     * 
     * @param {Event} event 
     */
    #saveBtnClick(event) {
        event.preventDefault();

        if (this.isEditMode) {
            const textValue = this.#addWaypointInput.value;
        }

        const text = $("#hidden-coordinates").val();
        const ll = text;
        console.log(ll);
        const llArray = JSON.parse(ll);
        const clickedCoordinate = fromLonLat(llArray);

        const textValue = this.#addWaypointInput.value;

        console.log('saveBtnClick', clickedCoordinate, textValue, text);

        if (textValue && clickedCoordinate) {
            // Create the waypoint feature
            const waypointFeature = new Feature({
                geometry: new Point(clickedCoordinate),
                name: textValue,
                title: textValue,
                type: "kml_wp"
            });

            this.#vectorSource.addFeature(waypointFeature);

            // Hide popup after saving
           this.#addOverlay.setPosition(undefined);

            this.#saveLayerToLocalStorage();

            this.#addWaypointInput.value = "";
            $("#hidden-coordinates").val("");
        }
    }

    #closePopup(event) {
        this.#addOverlay.setPosition(undefined);
        this.#addCloser.blur();
        return false;
    };

    #closeEditPopup(event) {
        this.#editOverlay.setPosition(undefined);
        this.#editCloser.blur();
        return false;
    };

    editFeature(evt, feature) {
        console.log("in editFeature", evt.coordinate, feature, this.#editOverlay);
        this.#editWaypointInput.value = feature.get('title');
        this.#editOverlay.setPosition(evt.coordinate);
        this.#editWaypointInput.focus();
        this.#editWaypointInput.select();
        this.#featureToEdit = feature;
    }

    #editSaveBtnClick(event) {
        event.preventDefault();

        console.log('edit save', event, this.#featureToEdit);
        if (this.#featureToEdit) {
            const newName = this.#editWaypointInput.value;
            this.#featureToEdit.setProperties({ "name": newName, "title": newName });
            this.#saveLayerToLocalStorage();

            // Hide popup and clear inputs after saving
            this.#editWaypointInput.value = "";
            this.#editOverlay.setPosition(undefined);
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
                    feat.set('type', 'kml_wp');
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
