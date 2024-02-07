'use strict';

import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style.js';

const iconStyle = new Style({
    image: new Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'data/img/yd.png',
    }),
});

export default class PotaLayers {

    constructor() {
        this._layers = {
            "US-GA": this.createLayer('./data/parks-US-GA.geojson'),
            "US-NC": this.createLayer('./data/parks-US-NC.geojson')
        };
    }

    getLayers() {
        return this._layers;
    }

    getLayer(key) {
        return this._layers[key];
    }

    createLayer(loc) {
        return new VectorLayer({
            style: iconStyle,
            source: new VectorSource({
                format: new GeoJSON(),
                url: loc
            })
        });
    }

}