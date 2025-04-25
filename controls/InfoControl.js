"use strict";

import { Control } from 'ol/control.js';

export class InfoControl extends Control {
    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(opt_options) {
        const options = opt_options || {};

        const button = document.createElement('button');
        button.innerHTML = '❔';
        button.title = 'Info';

        // bootstrap modal stuff
        button.className = 'btn btn-primary';
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#exampleModalCenter');

        const element = document.createElement('div');
        element.className = 'info-control ol-unselectable ol-control';
        element.appendChild(button);

        super({
            element: element,
            target: options.target,
        });
    }
}
