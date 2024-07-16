"use strict";

import { Control } from 'ol/control.js';

export class TileLayerControl extends Control {
    fn = null;

    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(opt_options) {
        const options = opt_options || {};

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
            target: options.target,
        });

        this.fn = opt_options;

        button.addEventListener('click', this.handleLayerSwitch.bind(this), false);
    }

    handleLayerSwitch() {
        if (this.fn)
            this.fn()
    }
}
