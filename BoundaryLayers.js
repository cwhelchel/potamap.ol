'use strict';

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON'
import LayerGroup from 'ol/layer/Group'
import Collection from 'ol/Collection.js';
import { Icon, Style, Stroke, Fill, Circle } from 'ol/style.js';

import LocData from './LayerData.js'


const stroke = new Stroke({
    color: '#3399CC',
    width: 1.25,
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

/**
 * Creates all the layers for the app
 * 
 * @return Array of LayerGroup containing all the park layers.
 */
export default function initLayers() {
    let d = LocData.data;
    let groups = [];

    for (var key in d.data) {
        //console.log('location: ' + key);
        let layers = new Collection();

        let path = './data/' + key + '/';

        let i = 0;

        // loop thru each location
        d.data[key].forEach(function (obj) {
            // console.log(obj.title)
            // console.log(path + obj.file)

            var l = new VectorLayer({
                title: obj.title,
                layerId: i++,
                visible: false,
                style: (obj.title.startsWith('Parks')) ? iconStyle : defaultStyle,
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