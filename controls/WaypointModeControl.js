"use strict";

import { Control } from 'ol/control.js';

export class WaypointModeControl extends Control {

    #wpModeEnabled;
    #button;

    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(opt_options) {
        // create element for control
        const btn = document.createElement('button');
        btn.innerHTML = '📍'
        btn.className = 'btn';
        btn.title = 'Enter Waypoint Mode';
        const element = document.createElement('div');
        element.className = 'wp-mode-control ol-unselectable ol-control';
        element.appendChild(btn);

        super({
            element: element,
            target: undefined
        });

        // do the real stuff
        this.#wpModeEnabled = false;
        btn.addEventListener('click', this.toggleWaypointMode.bind(this), false);
        this.#button = btn;
    }

    get waypointModeEnabled() {
        return this.#wpModeEnabled;
    }
    set waypointModeEnabled(val) {
        return this.#wpModeEnabled = val;
    }

    /**
     * This method toggles waypoint mode off and on. 
     * 
     * It updates button control and UI elements and styling but otherwise just
     * sets the value of this.wpModeEnabled which is read by clients.
     */
    toggleWaypointMode() {
        this.#wpModeEnabled = !this.#wpModeEnabled;
        const m = document.getElementById("map");
        const footerMidDiv = document.getElementById("footer-middle");
        const wpStatusSpan = document.getElementById("waypointStatus");
        const statusSpan = document.getElementById("status");

        if (this.#wpModeEnabled) {
            this.#button.style.backgroundColor = 'red';
            m.style.cursor = 'crosshair';
            footerMidDiv.style.backgroundColor = 'red';
            footerMidDiv.style.borderRadius = '5px';
            footerMidDiv.style.textAlign = 'center';
            wpStatusSpan.innerText = 'WAYPOINT EDIT MODE - left click add. right click remove';
            wpStatusSpan.style.color = 'white';
            wpStatusSpan.style.fontWeight = 'bold';
            statusSpan.style.display = "none";
        }
        else {
            m.style.cursor = 'pointer';
            this.#button.style.backgroundColor = 'var(--ol-background-color)';
            footerMidDiv.style.backgroundColor = 'inherit';
            wpStatusSpan.style.color = 'inherit';
            footerMidDiv.style.textAlign = 'left';
            footerMidDiv.style.borderRadius = '0px';
            wpStatusSpan.innerText = '';
            statusSpan.style.display = "";
        }
    }
}
