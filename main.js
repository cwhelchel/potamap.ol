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
import { fromLonLat } from 'ol/proj.js';
import { Icon, Style, Stroke, Fill, Circle } from 'ol/style.js';

import { defaultStyle, initLayers } from './BoundaryLayers.js'
import StaticData from './StaticData.js'
import getParkLocation from './PotaApi.js'

const selectStyle = new Style({
    fill: new Fill({
        color: 'rgba(126,126,126,0.5)',
    }),
    stroke: new Stroke({
        color: 'rgba(255, 155, 155, 0.7)',
        width: 2,
    }),
});

// create all our layers: boundary shapes and pota park markers. grouped into
// layer groups for each location (US-GA, etc)
let groups = initLayers();

let allGroup = new LayerGroup({
    layers: [],
    title: 'All'
});

// add our created groups into a single top level group
for (let i = 0; i < groups.length; i++) {
    allGroup.getLayers().getArray().push(groups[i]);
}

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

// remove visibility of all groups in layerswitcher
//for (let i = 0; i < groups.length; i++) {
//allGroup.getLayers().getArray()[1].getLayersArray()[0].setProperties({ "visible": true });
//allGroup.getLayers().getArray()[0].getLayersArray()[1].setProperties({"visible": true});
//allGroup.getLayers().getArray()[0].getLayersArray()[2].setProperties({"visible": true});
//}

// allGroup.getLayers().getArray().push

var layerSwitcher = new LayerSwitcher({
    startActive: true,
    activationMode: 'click',
    groupSelectStyle: 'children',
    reverse: false // this logic is backwards-af
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

    let content = "";

    //const feature = 
    map.forEachFeatureAtPixel(evt.pixel, function (x) {
        content += getContent(x) + "</br>";
        //return feature;
    });

    disposePopover();
    // if (!feature) {
    //     return;
    // }

    popup.setPosition(evt.coordinate);
    popover = new bootstrap.Popover(element, {
        placement: 'top',
        html: true,
        content: content,
    });
    popover.show();

    function getContent(f) {
        let name = f.get('NAME'); // should ALWAYS be there 
        let title = f.get('TITLE'); // will be there for pota parks
        let res = "";

        // from a shapefile. use its properties as they provide way more info
        if (title === undefined) {
            let p = f.getProperties();
            for (var property in p) {
                if (typeof (p[property]) == "string") {
                    res += `${property} : ${p[property]} <br/>`;
                }
            }
            res = `<span class="shapeProps">${res}</span>`
        }
        else {
            res = `${name} - ${title}`;
            $("#potaLink").attr('href', `https://pota.app/#park/${name}`);
            $("#potaLink").text(res);
            $("#wikiLink").attr('href', `https://pota.miraheze.org/wiki/${title}`);
        }
        return res;
    }
});

// // change mouse cursor when over marker
// map.on('pointermove', function (e) {
//     const pixel = map.getEventPixel(e.originalEvent);
//     const hit = map.hasFeatureAtPixel(pixel);
//     //console.log(map.getTarget().style)
//     map.getTarget().style.cursor = hit ? 'pointer' : '';
// });

// Close the popup when the map is moved
map.on('movestart', disposePopover);

function applyMargins() {
    $("#map .ol-zoom").css("margin-top", $("nav").outerHeight())
    $("#map").css("margin-top", $("nav").outerHeight())
    $("#map").css("margin-top", $("nav").outerHeight())
    $("#map").css("margin-bottom", $(".footer").outerHeight())
}

$(window).on("resize", applyMargins);

applyMargins();

function clearLocLayerGroups() {
    for (let i = 0; i < groups.length; i++) {
        groups[i].setProperties({ "visible": false });

        // hide each sub layer
        groups[i].getLayersArray().forEach(function (val, i, array) {
            val.setProperties({ "visible": false });
        });
    }
}

function showLocLayerGroup(inVal) {
    let layers = allGroup.getLayers();

    clearLocLayerGroups();

    for (var groups in layers.getArray()) {
        var temp = layers.getArray()[groups];
        let properties = temp.getProperties();
        if (properties["title"] === inVal) {
            selectLayerGroup(temp);

            scrollToLayGroupInPanel(inVal);

            zoomToLocation(inVal);
        }
    }
}

$('#parkBtn').click(function () {
    const input = $('#parkTxt').val();
    let loc = getParkLocation(input);
    loc.then(
        function (value) { map.getView().animate({ zoom: 12, center: fromLonLat([value.lon, value.lat]) }); },
        function (error) { /* code if some error */ }
    );
});

$('#parkTxt').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        $(this).parent().find('button').click();
    }
});

$('#locSelect').on("change", function () {
    showLocLayerGroup(this.value);
});

function zoomToLocation(locId) {
    if (!(locId in StaticData.data))
        return;
    let lat = StaticData.data[locId].lat;
    let lon = StaticData.data[locId].lon;
    let zoom = StaticData.data[locId].zoom;
    map.getView().animate({ zoom: zoom, center: fromLonLat([lon, lat]) });
}

function scrollToLayGroupInPanel(locId) {
    var container = $("div.panel");
    var element = $("label:contains('" + locId + "')");

    container.scrollTop(
        element.offset().top - container.offset().top + container.scrollTop()
    );
}

function selectLayerGroup(layerGroup) {

    // set to be checked and open the tree node
    layerGroup.setProperties({ "visible": true, "fold": 'open' });

    // set each child visible
    for (let i = 0; i < layerGroup.getLayersArray().length; i++) {
        layerGroup.getLayersArray()[i].setProperties({ "visible": true });
    }

    // refresh redraw panel
    layerSwitcher.renderPanel();
}

let selected = null;
let hoverTitle = "";

map.on('pointermove', function (e) {
    if (selected !== null) {
        selected.setStyle(defaultStyle);
        selected = null;
        $("#status").text(' ');
        hoverTitle = " ";
        map.render();
    }

    map.forEachFeatureAtPixel(e.pixel, function (f) {
        selected = f;
        // only the features w/ pota markers have TITLE
        if (f.get('TITLE') === undefined) {
            f.setStyle(selectStyle);
            map.render();
            hoverTitle = selected.get('NAME')
            return true;
        }
        // keeps the POTA park marker dots from getting restyles
        hoverTitle = selected.get('NAME') + ' - ' + selected.get('TITLE');
        selected = null;
    });

    $("#status").text(hoverTitle);
});
