'use strict';
import { Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Geolocation from 'ol/Geolocation.js';

export var currentPosition;

/*
  Gets a layer to be added to the map with the browsers geolocation data.
  The layer will display a position point and an accuracy "ring".

  projection should be from the maps view, ala: view.getProjection()
*/
export function getGeolocationLayer(projection) {
    //currentPosition = [-152.404, 61.3707];

    const geolocation = new Geolocation({
        // enableHighAccuracy must be set to true to have the heading value.
        trackingOptions: {
            enableHighAccuracy: true,
        },
        tracking: true,
        projection: projection,
    });

    const accuracyFeature = new Feature({ 'NAME': 'accuracy_feat' });

    geolocation.on('change:accuracyGeometry', function () {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    });

    const positionFeature = new Feature({ 'NAME': 'pos_feat' });

    positionFeature.setStyle(
        new Style({
            image: new CircleStyle({
                radius: 6,
                fill: new Fill({
                    color: '#3399CC',
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 2,
                }),
            }),
        })
    );

    geolocation.on('change:position', function () {
        const coordinates = geolocation.getPosition();
        currentPosition = coordinates;
        positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
    });

    return new VectorLayer({
        source: new VectorSource({
            features: [accuracyFeature, positionFeature],
        }),
    });
}
