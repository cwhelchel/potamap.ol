'use strict';

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON'
import LayerGroup from 'ol/layer/Group'
import BaseLayer from 'ol/layer/Base.js';
import Collection from 'ol/Collection.js';
import { Icon, Style, Stroke, Fill, Circle, Text } from 'ol/style.js';

import LocData from './LayerData.js'
import { getActxData } from './ActivationData.js'


const stroke = new Stroke({
    color: '#3399CC',
    width: 1.25,
});

const countyStroke = new Stroke({
    color: 'rgba(176,26,146,0.5)', // #b01a92
    width: 1.1,

});

const defaultStyle = [
    new Style({
        stroke: stroke,
        fill: new Fill({ color: 'rgba(0,255,255,0.4)' })
    }),
];

const iconStyle = new Style({
    image: new Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'data/img/yd.png',
    }),
});

const activatedIconStyle = new Style({
    image: new Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'data/img/gd.png',
    }),
});


const trailStyle = [
    new Style({
        stroke: new Stroke({
            color: '#33cc8c',
            width: 3.00,
        }),
        fill: new Fill({ color: 'rgba(50,255,100,0.4)' })
    }),
];

function createCountyStyle(county) {
    const countyStyle = [
        new Style({
            stroke: countyStroke,
            fill: new Fill({ color: 'rgba(176,26,146,0.05)' }),
            text: new Text({ text: county, stroke: countyStroke })
        }),
    ];

    return countyStyle;
}

// we need to track these so the initial style is set correctly. its based off
// configuration in LayerData.js LocData titles.
const trailNames = [
    "AT", "NCT NST", "PE NHT", "LC NHT", "MP NHT", "WARO NHT", "TOT NHT",
    "SAFE NHT", "FL NST", "CALI NHT", "OR NHT", "OLSP NHT", "BFO NHT", "ELCA_TA NHT",
    "ELCA_LT NHT"
];

function polygonStyleFunction(feature, resolution) {
    return createCountyStyle(feature.get('name'));
}

/**
 * Creates all the layers for the app
 * 
 * @return Array of LayerGroup containing all the park layers.
 */
export default function initLayers() {
    let d = LocData.data;
    let groups = [];

    const activated = getActxData();

    var styleFunction = function (feature, resolution) {

        if (activated && activated.includes(feature.get("NAME"))) {
            return activatedIconStyle;
        }
        else {
            return iconStyle;
        }
    }

    for (var key in d.data) {
        //console.log('location: ' + key);
        let layers = new Collection();

        let path = './data/' + key + '/';

        let i = 0;

        // loop thru each location
        d.data[key].forEach(function (obj) {

            if (obj.title.startsWith('Parks')) {
                var s = styleFunction;
            }
            else if (trailNames.includes(obj.title)) {
                var s = trailStyle;
            }
            else if (obj.title.startsWith('Counties')) {
                var s = polygonStyleFunction;
            }
            else {
                var s = defaultStyle;
            }

            var l = new VectorLayer({
                title: obj.title,
                layerId: i++,
                visible: false,
                style: s,
                source: new VectorSource({
                    format: new GeoJSON(),
                    url: path + obj.file,
                })
            });

            layers.push(l);
        });


        let grp = new LayerGroup({
            title: key,
            fold: 'close',
        });
        grp.setLayers(layers);

        groups.push(grp);
    }

    return groups;
};

export { defaultStyle, initLayers };