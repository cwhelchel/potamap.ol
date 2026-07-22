"use strict";

import { Control } from 'ol/control.js';
import Geolocation from 'ol/Geolocation.js';
import { currentPosition } from '../getGeolocationLayer.js';

export class ZoomToPosControl extends Control {
    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(opt_options) {
        const btn = document.createElement('button');
        btn.innerHTML = '🎯'
        btn.className = 'btn';
        btn.title = 'Zoom to your position';

        const element = document.createElement('div');
        element.className = 'zoom-pos-control ol-unselectable ol-control';
        element.appendChild(btn);

        super({
            element: element,
            target: undefined
        });

        //btn.addEventListener('click', this.handleButtonClick.bind(this), false);
        btn.addEventListener('click', this.zoomToPosition.bind(this), false);
    }

    zoomToPosition() {
        const map = this.getMap();

        const coordinates = currentPosition;
        if (coordinates !== undefined && coordinates !== null) {
            let zoom = 10;
            let c = coordinates;
            map.getView().animate({ zoom: zoom, center: c });
        }
    }
}
