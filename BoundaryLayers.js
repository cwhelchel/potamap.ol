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

const summitColors = [
    "rgba(255, 99, 71, 0.8)",
    "rgba(70, 130, 180, 0.9)",
    "rgba(255, 105, 180, 0.9)",
    "rgba(60, 179, 113, 0.9)",
    "rgba(255, 165, 0, 0.8)",
    "rgba(34, 139, 34, 0.9)",
    "rgba(221, 160, 221, 0.8)",
    "rgba(255, 20, 147, 0.8)",
    "rgba(0, 191, 255, 0.8)",
    "rgba(0, 200, 0, 0.9)",
    "rgba(255, 69, 0, 0.9)",
    "rgba(255, 215, 0, 0.7)",
    "rgba(100, 149, 237, 0.8)",
    "rgba(255, 99, 132, 0.8)",
    "rgba(0, 0, 255, 0.9)",
    "rgba(255, 223, 0, 0.8)",
    "rgba(255, 0, 255, 0.8)",
    "rgba(102, 205, 170, 0.7)",
    "rgba(255, 99, 71, 0.75)",
    "rgba(147, 112, 219, 0.9)",
    "rgba(255, 182, 193, 0.8)",
    "rgba(255, 246, 143, 0.8)",
    "rgba(1, 128, 128, 0.8)",
    "rgba(250, 128, 114, 0.8)",
    "rgba(204, 255, 255, 0.8)",
    "rgba(0, 200, 0, 0.9)",
    "rgba(255, 69, 0, 0.9)",
    "rgba(255, 215, 0, 0.7)",
    "rgba(100, 149, 237, 0.8)",
    "rgba(255, 99, 132, 0.8)",
    "rgba(0, 0, 255, 0.9)",
    "rgba(255, 223, 0, 0.8)",
    "rgba(255, 99, 71, 0.8)",
    "rgba(70, 130, 180, 0.9)",
    "rgba(255, 105, 180, 0.9)",
    "rgba(60, 179, 113, 0.9)",
    "rgba(255, 165, 0, 0.8)",
];


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
        let summitLayers = new Collection();

        let path = './data/' + key + '/';

        let i = 0;

        // summit color index
        let j = 0

        let summitGroup = new LayerGroup({
            title: 'Summits',
            fold: 'close',
        });

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
            else if (obj.title.startsWith('Summits')) {
                const color = summitColors[j];
                const title = obj.title.slice(8);
                var l = new VectorLayer({
                    title: title,
                    layerId: i++,
                    visible: false,
                    minZoom: 8,
                    style: new Style({
                        image: new Icon({
                            anchor: [0.5, 0.5],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            src: 'data/img/triangle.png',
                            color: color,
                            crossOrigin: 'anonymous'
                        })
                    }),
                    source: new VectorSource({
                        format: new GeoJSON(),
                        url: path + obj.file,
                    })
                });
                summitLayers.push(l);
                j++;
                return;
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

        summitGroup.setLayers(summitLayers);
        layers.push(summitGroup);
        i = 0;

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