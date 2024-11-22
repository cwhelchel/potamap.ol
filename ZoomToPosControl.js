"use strict";

import { Control } from 'ol/control.js';
import Geolocation from 'ol/Geolocation.js';

export class ZoomToPosControl extends Control {
    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(opt_options) {
        const options = opt_options || {};

        const btn = document.createElement('button');
        btn.innerHTML = '🎯'
        btn.className = 'btn';
        btn.title = 'Zoom to your position';

        const element = document.createElement('div');
        element.className = 'zoom-pos-control ol-unselectable ol-control';
        element.appendChild(btn);

        super({
            element: element,
            target: options.target,
        });

        this.callback = opt_options;

        btn.addEventListener('click', this.handleButtonClick.bind(this), false);
    }

    handleButtonClick() {

        if (this.callback)
            this.callback();
    }
}
