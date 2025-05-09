'use strict';

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ.js';
import LayerGroup from 'ol/layer/Group'
import Overlay from 'ol/Overlay.js';
import { fromLonLat } from 'ol/proj.js';
import { Style, Stroke, Fill } from 'ol/style.js';
import { defaults as defaultControls } from 'ol/control.js';

import LayerSwitcher from 'ol-layerswitcher';
import Autocomplete from 'bootstrap5-autocomplete'

import { defaultStyle, initLayers } from './BoundaryLayers.js'
import StaticData from './StaticData.js'
import { getParkLocation, getParkLastActx } from './PotaApi.js'
import { currentPosition, getGeolocationLayer } from './getGeolocationLayer.js';
import { handleActxUpload } from './ActivationData.js';

import { InfoControl } from './controls/InfoControl.js'
//import { BugReportControl } from './controls/BugReportControl.js';
import { TileLayerControl } from './controls/TileLayerControl.js';
import { ZoomToPosControl } from './controls/ZoomToPosControl.js';



const selectStyle = new Style({
    fill: new Fill({
        color: 'rgba(126,126,126,0.5)',
    }),
    stroke: new Stroke({
        color: 'rgba(255, 155, 155, 0.7)',
        width: 2,
    }),
});

const trailSelectStyle = new Style({
    fill: new Fill({
        color: 'rgba(204, 51, 115, 1.0)',
    }),
    stroke: new Stroke({
        color: 'rgba(204, 51, 115, 0.7)',
        width: 5,
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

const view = new View({
    center: [0, 0],
    zoom: 2
})

const xyzSrc = new XYZ({
    attributions: ['Powered by Esri',
        'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
    attributionsCollapsible: false,
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 23
});

const osmSrc = new OSM();

const tileLayer = new TileLayer({
    source: osmSrc
});

const map = new Map({
    target: document.getElementById('map'),
    layers: [tileLayer, allGroup],
    title: 'Map',
    type: 'base',
    view: view,
    controls: defaultControls().extend([new InfoControl(), new TileLayerControl(handleLayerSwitchCallback), new ZoomToPosControl(zoomToPosition)])
});

// add layer and source for GPS position
const geolocLayer = getGeolocationLayer(view.getProjection());

map.addLayer(geolocLayer);

// add our layer switcher component
var layerSwitcher = new LayerSwitcher({
    startActive: false,
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

function handleLayerSwitchCallback() {
    if (tileLayer.getSource() == xyzSrc)
        tileLayer.setSource(osmSrc);
    else
        tileLayer.setSource(xyzSrc);
}

// display popup on click
map.on('click', function (evt) {
    let content = "";

    map.forEachFeatureAtPixel(evt.pixel, function (x) {
        content += getContent(x) + "</br>";
    });

    disposePopover();

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
        let shapeTitle = '';

        // from a shapefile. use its properties as they provide way more info
        if (title === undefined) {
            let p = f.getProperties();
            for (var property in p) {
                if (typeof (p[property]) == "string") {
                    if (property === "NAME") {
                        shapeTitle = `<div class="shape-name">${p["NAME"]}</div>`;
                        continue;
                    }
                    res += `<div class="shape-prop">${property} : ${p[property]}</div>`;
                }
            }

            let propsDiv = `<div class="shape-props">${res}</div>`
            res = `<div class="shape-popover">${shapeTitle}${propsDiv}</div>`
        }
        else {
            // from POTA park markers. get and display POTA specific info
            res = `${name} - ${title}`;
            $("#potaLink").attr('href', `https://pota.app/#park/${name}`);
            $("#potaLink").text(res);
            $("#wikiLink").attr('href', `https://pota.miraheze.org/wiki/${title}`);
            let lastAct = getParkLastActx(name);
            lastAct.then(
                function (value) { $("#actxData").text("Last Activation: " + `${value.lastActivator} on ${value.date}`) },
                function (error) { /* code if some error */ }
            );
        }
        return res;
    }
});

// Close the popup when the map is moved
map.on('movestart', disposePopover);

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

$(document).ready(function () {
    if (localStorage.getItem('locSelectVal') !== undefined) {
        const x = localStorage.getItem('locSelectVal');
        //console.log(x);
        $('#locSelect').val(x);
        showLocLayerGroup(x);
    }
});

$('#parkBtn').click(function () {
    // this hidden input will be set by the new autocomplete plugin

    const input = $('#parkTxt').val();
    let loc = getParkLocation(input);
    loc.then(
        function (value) { map.getView().animate({ zoom: 12, center: fromLonLat([value.lon, value.lat]) }); },
        function (error) { /* code if some error */ }
    );
});


$('#locSelect').on("change", function () {
    localStorage.setItem('locSelectVal', this.value);
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

function zoomToPosition() {
    const coordinates = currentPosition;
    if (coordinates !== undefined && coordinates !== null) {
        let zoom = 10;
        let c = coordinates;
        map.getView().animate({ zoom: zoom, center: c });
    }
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
        let title = layerGroup.getLayersArray()[i].getProperties().title;

        // dont auto select counties
        if (title != "Counties") {
            layerGroup.getLayersArray()[i].setProperties({ "visible": true });
        }
    }

    // refresh redraw panel
    layerSwitcher.renderPanel();
}

let selected = null;
let hoverTitle = "";

let oldStyle = defaultStyle;

map.on('pointermove', function (e) {
    if (selected !== null) {
        selected.setStyle(oldStyle);
        selected = null;
        $("#status").text(' ');
        hoverTitle = " ";
        map.render();
    }

    map.forEachFeatureAtPixel(e.pixel, function (f) {
        selected = f;
        // only the features w/ pota markers have TITLE
        const name = f.get('NAME');
        const type = f.get('type');
        const ignore = ["accuracy_feat", "pos_feat"]
        if (f.get('TITLE') === undefined && !ignore.includes(name) && type !== 'county') {
            oldStyle = f.getStyle();

            if (type === 'trail')
                f.setStyle(trailSelectStyle);
            else
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

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    handleActxUpload(file);

    window.location.reload();
}

document.getElementById('fileUpload').addEventListener('change', handleFileUpload);

Autocomplete.init("#autocompleteBottomInput", {
    items: [{ title: "", id: "" }],
    valueField: "id",
    labelField: "title",
    highlightTyped: true,
    onSelectItem: ({label, value}) => {
        $('#parkTxt').val(value);
        $('#parkBtn').click();
    }
});