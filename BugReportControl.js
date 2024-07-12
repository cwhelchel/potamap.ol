"use strict";

import { Control } from 'ol/control.js';

export class BugReportControl extends Control {
    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(opt_options) {
        const options = opt_options || {};

        //const button = document.createElement('button');
        
        const link = document.createElement('a');
        link.innerHTML = '⚠️';
        link.title = 'Report error on Github';
        link.href = "https://github.com/cwhelchel/potamap.ol/issues";
        link.target = "_blank";

        const element = document.createElement('div');
        element.className = 'bug-rpt-control ol-unselectable ol-control';
        element.appendChild(link);

        super({
            element: element,
            target: options.target,
        });
    }
}
