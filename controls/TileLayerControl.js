"use strict";

import { Control } from 'ol/control.js';
import XYZ from 'ol/source/XYZ.js';
import TileLayer from 'ol/layer/Tile';

const xyzSrc = new XYZ({
    attributions: ['Powered by Esri',
        'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
    attributionsCollapsible: false,
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 23
});

export class TileLayerControl extends Control {
    src_ = null;

    /**
     * 
     * @param {any} src: the initial OSM() tile source used when map created
     */
    constructor({ src }) {
        const button = document.createElement('button');
        button.innerHTML = '🗺';
        button.title = 'Toggle Map Display';

        // bootstrap modal stuff
        button.className = 'btn';

        const element = document.createElement('div');
        element.className = 'toggle-layer-control ol-unselectable ol-control';
        element.appendChild(button);

        super({
            element: element,
            target: undefined
        });

        this.src_ = src;

        button.addEventListener('click', this.handleLayerSwitch2.bind(this), false);
    }

    handleLayerSwitch2() {
        const map = this.getMap();

        const layer = map.getLayers().getArray().filter(function (l) {
            return l instanceof TileLayer;
        });

        if (layer[0].getSource() == xyzSrc)
            layer[0].setSource(this.src_);
        else
            layer[0].setSource(xyzSrc);
    }
}
