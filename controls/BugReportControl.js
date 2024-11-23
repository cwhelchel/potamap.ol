"use strict";

import { Control } from 'ol/control.js';

export class BugReportControl extends Control {
    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(opt_options) {
        const options = opt_options || {};

        const btn = document.createElement('button');
        btn.innerHTML = '<a title="Report error on Github" href="https://github.com/cwhelchel/potamap.ol/issues" target="_blank">⚠️</a>'
        btn.className = 'btn';

        const element = document.createElement('div');
        element.className = 'bug-rpt-control ol-unselectable ol-control';
        element.appendChild(btn);

        super({
            element: element,
            target: options.target,
        });
    }
}
