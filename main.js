'use strict';

import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import LayerGroup from 'ol/layer/Group'
import VectorSource from 'ol/source/Vector';
import Overlay from 'ol/Overlay.js';
import LayerSwitcher from 'ol-layerswitcher';
import {fromLonLat} from 'ol/proj.js';

import initLayers from './BoundaryLayers.js'
import StaticData from './StaticData.js'


let groups = initLayers();

let allGroup = new LayerGroup({
    layers: [],
    title: 'All'
});

const map = new Map({
    target: document.getElementById('map'),
    layers: [new TileLayer({ source: new OSM() }), allGroup],
    title: 'Map',
    type: 'base',
    view: new View({
        center: [0, 0],
        zoom: 2
    })
});

for (let i = 0; i < groups.length; i++) {
    allGroup.getLayers().getArray().push(groups[i]);
}

// remove visibility of all groups in layerswitcher
//for (let i = 0; i < groups.length; i++) {
//allGroup.getLayers().getArray()[1].getLayersArray()[0].setProperties({ "visible": true });
//allGroup.getLayers().getArray()[0].getLayersArray()[1].setProperties({"visible": true});
//allGroup.getLayers().getArray()[0].getLayersArray()[2].setProperties({"visible": true});
//}

// allGroup.getLayers().getArray().push

var layerSwitcher = new LayerSwitcher({
    tipLabel: 'Poop', // Optional label for button
    startActive: true,
    activationMode: 'click',
    groupSelectStyle: 'children', // Can be 'children' [default], 'group' or 'none'
    reverse: true
});

map.addControl(layerSwitcher);


// add popup div as map overlay
const element = document.getElementById('popup');

const popup = new Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
});
map.addOverlay(popup);

let popover;
function disposePopover() {
    if (popover) {
        popover.dispose();
        popover = undefined;
    }
}

// display popup on click
map.on('click', function (evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });

    disposePopover();
    if (!feature) {
        return;
    }

    popup.setPosition(evt.coordinate);
    popover = new bootstrap.Popover(element, {
        placement: 'top',
        html: true,
        content: feature.get('NAME') + ' - ' + feature.get('TITLE'),
    });
    popover.show();
});

// change mouse cursor when over marker
map.on('pointermove', function (e) {
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    //console.log(map.getTarget().style)
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});

// Close the popup when the map is moved
map.on('movestart', disposePopover);

function applyMargins() {
    $("#map .ol-zoom").css("margin-top", $("nav").outerHeight())
    $("#map").css("margin-top", $("nav").outerHeight())
}

$(window).on("resize", applyMargins);

applyMargins();

function fuckThatChicken(inVal) {
    let layers = allGroup.getLayers();
    

    for (var groups in layers.getArray()) {
        var temp = layers.getArray()[groups];
        let properties = temp.getProperties();
        if (properties["title"] === inVal) {
            temp.setProperties({ "visible": true });
            for (let i = 0; i < temp.getLayersArray().length; i++) {
                temp.getLayersArray()[i].setProperties({ "visible": true });
            }

            layerSwitcher.renderPanel();

            var container = $("div.panel"); // hope there's only one
            var element = $("label:contains('" + inVal + "')");

            container.scrollTop(
                element.offset().top - container.offset().top + container.scrollTop()
            );

            let lat = StaticData.data[inVal].lat;
            let lon = StaticData.data[inVal].lon;
            let zoom = StaticData.data[inVal].zoom;
            map.getView().animate({zoom: zoom, center: fromLonLat([lon, lat])});
        }
    }
}

$('#locBtn').click(function () {
    const inVal = $('#locTxt').val();

    fuckThatChicken(inVal);

    // this works earlier.
    // allGroup.getLayers().getArray()[1].getLayersArray()[0].setProperties({"visible": true});

    // let layers = allGroup.getLayers();
    
    // for (var groups in layers.getArray()) {
    //     var temp = layers.getArray()[groups];
    //     let properties = temp.getProperties();
    //     if (properties["title"] === inVal) {
    //         temp.setProperties({ "visible": true });
    //         for (let i = 0; i < temp.getLayersArray().length; i++) {
    //             temp.getLayersArray()[i].setProperties({ "visible": true });
    //         }

    //         layerSwitcher.renderPanel();

    //         var container = $("div.panel"); // hope there's only one
    //         var element = $("label:contains('" + inVal + "')");

    //         container.scrollTop(
    //             element.offset().top - container.offset().top + container.scrollTop()
    //         );

    //         let lat = StaticData.data[inVal].lat;
    //         let lon = StaticData.data[inVal].lon;
    //         let zoom = StaticData.data[inVal].zoom;
    //         map.getView().animate({zoom: zoom, center: fromLonLat([lon, lat])});
    //     }
    // }
});

$('#locSelect').on( "change", function() {
    fuckThatChicken(this.value);
});
//39c74a95-eef5-4727-9079-5866aefae6d9 ak
