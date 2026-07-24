'use strict';

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import LayerGroup from 'ol/layer/Group'
import Overlay from 'ol/Overlay.js';
import { fromLonLat } from 'ol/proj.js';
import { Style, Stroke, Fill, Icon } from 'ol/style.js';
import { defaults as defaultControls } from 'ol/control.js';

import KML from 'ol/format/KML.js'
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';

import LayerSwitcher from 'ol-layerswitcher';
import Autocomplete from 'bootstrap5-autocomplete'

import { defaultStyle, initLayers } from './BoundaryLayers.js'
import StaticData from './StaticData.js'
import { getParkLocation, getParkLastActx, isPark } from './PotaApi.js'
import { currentPosition, getGeolocationLayer } from './getGeolocationLayer.js';
import { handleActxUpload } from './ActivationData.js';

import { InfoControl } from './controls/InfoControl.js'
import { TileLayerControl } from './controls/TileLayerControl.js';
import { ZoomToPosControl } from './controls/ZoomToPosControl.js';
import { WaypointModeControl } from './controls/WaypointModeControl.js';
import { updateFooterLinks } from './MapClickHandler.ts'
import { getSummitLocation, isSummit } from './SotaApi.js';
import { KmlLayer } from './KmlLayer.js';
import { WaypointLayer } from './WaypointLayer.js';
import { toLonLat } from 'ol/proj';
import PotamapPopup from './PotamapPopup.ts';


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
    title: 'All',
    fold: 'open',
});

// this group is for showing uploaded KML and also for any user added waypoints
let uploadGroup = new LayerGroup({
    layers: [],
    title: 'Uploads',
    fold: 'open'
});


// add our created groups into a single top level group
for (let i = 0; i < groups.length; i++) {
    allGroup.getLayers().getArray().push(groups[i]);
}

const view = new View({
    center: [0, 0],
    zoom: 2
})

const osmSrc = new OSM();

const tileLayer = new TileLayer({
    source: osmSrc
});

const map = new Map({
    target: document.getElementById('map'),
    layers: [tileLayer, allGroup, uploadGroup],
    title: 'Map',
    type: 'base',
    view: view,
    controls: defaultControls().extend([
        new TileLayerControl({ src: osmSrc }),
        new ZoomToPosControl(),
        new WaypointModeControl()])
});

// add layer and source for GPS position
const geolocLayer = getGeolocationLayer(view.getProjection());
let waypointLayer = null;

map.addLayer(geolocLayer);

// add our layer switcher component
var layerSwitcher = new LayerSwitcher({
    startActive: false,
    activationMode: 'click',
    groupSelectStyle: 'children',
    reverse: false, // this logic is backwards-af
    tipLabel: "Open Layer Switcher",
    collapseTipLabel: "Close Layer Switcher",
});

map.addControl(layerSwitcher);

// add popup div as map overlay
const element = document.getElementById('popup');

const popup = new Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
});

const pmPopup = new PotamapPopup();

map.addOverlay(pmPopup.getPopupOverlay());


/**
 * Click handlers
 */

// Handle default map click
map.on('click', function (evt) {

    const clicked = map.getFeaturesAtPixel(evt.pixel);

    // handle waypoint stuff b/c we'll stop the other popup
    const controlsArray = map.getControls().getArray();
    const wpModeCtrl = controlsArray.find(ctl => ctl instanceof WaypointModeControl);

    if (wpModeCtrl && wpModeCtrl.waypointModeEnabled) {

        let isEditing = false;

        console.log('testing for wp edit...');

        for (const x of clicked) {
            if (x.get("type") === "kml_wp") {
                isEditing = true;
                console.log("is wp, editing", x);
                waypointLayer.editFeature(evt, x);
                break;
            }
        }

        if (!isEditing) {
            const ll = toLonLat(evt.coordinate);
            $("#hidden-coordinates").val(JSON.stringify(ll));
            waypointLayer.showAddWaypoint(evt);
        }
        return;
    }

    // update the footer stuff
    map.forEachFeatureAtPixel(evt.pixel, function (x) {
        updateFooterLinks(x); // REHOST
    });

    // show main popup
    pmPopup.showPopup(evt, clicked);
});

// handle right click
map.getViewport().addEventListener('contextmenu', function (event) {
    // Prevent the default browser context menu from opening
    event.preventDefault();

    const controlsArray = map.getControls().getArray();
    const wpModeCtrl = controlsArray.find(ctl => ctl instanceof WaypointModeControl);

    // if were in waypoint edit mode...
    if (wpModeCtrl && wpModeCtrl.waypointModeEnabled) {
        const pixel = map.getEventPixel(event);
        const coordinate = map.getCoordinateFromPixel(pixel);

        const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
            return feature;
        });

        //console.log('Removing:', feature, feature.getProperties());
        if (feature && feature.getProperties().type == "kml_wp") {
            waypointLayer.removeWaypoint(feature);
        }
    }
});

// Close the popup when the map is moved
map.on('movestart', function (event) {
    pmPopup.hidePopup();
});

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

    initKmlLayersFromStorage()

    // add waypoint layer for user waypoints
    const wl = new WaypointLayer({ title: 'Waypoints', mapProjection: view.getProjection() });
    uploadGroup.getLayers().push(wl.vectorLayer);
    map.addOverlay(wl.editOverlay);
    map.addOverlay(wl.addOverlay);

    waypointLayer = wl;

    // roll/bump this number up to force a display of the landing modal info box
    const expectedLanding = 6;

    if (localStorage.getItem('showLanding') === null) {
        showLandingModal();
    } else {
        const storedVal = localStorage.getItem('showLanding');
        if (storedVal < expectedLanding) {
            showLandingModal();
        }
    }

    function showLandingModal() {
        const myModalEl = document.getElementById('landingModal');
        const myModal = new bootstrap.Modal(myModalEl);
        myModal.toggle();
        localStorage.setItem('showLanding', expectedLanding);
    }
});

$('#parkBtn').click(function () {
    // this hidden input will be set by the new autocomplete plugin
    const input = $('#parkTxt').val();

    if (isPark(input)) {
        let loc = getParkLocation(input);
        loc.then(
            function (value) { map.getView().animate({ zoom: 12, center: fromLonLat([value.lon, value.lat]) }); },
            function (error) { console.log('error getting park location. may be bad park reference id'); }
        );
    } else if (isSummit(input)) {
        let loc = getSummitLocation(input);
        loc.then(
            function (value) { map.getView().animate({ zoom: 12, center: fromLonLat([value.lon, value.lat]) }); },
            function (error) { console.log('error getting summit location. may be bad reference id'); }
        );
    }
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

    const layers = layerGroup.getLayers();

    layers.forEach(function (layer) {
        let title = layer.getProperties().title;

        // dont auto select counties
        const titleIgnore = ["Counties", "FFMA"];

        if (!titleIgnore.includes(title)) {
            layer.setProperties({ "visible": true });
        }

        // if we want to show a sub group (like summits) we have to 
        // loop thru a the sub-layergroup. but for now we dont want to show
        // the summits when the state is selected
    });

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
        const ignoreNames = ["accuracy_feat", "pos_feat"]
        const ignoreTypes = ["ffma", "county"]
        if (f.get('TITLE') === undefined && !ignoreNames.includes(name) && !ignoreTypes.includes(type)) {
            oldStyle = f.getStyle();

            if (type === 'trail')
                f.setStyle(trailSelectStyle);
            else if (type && type.startsWith('kml'))
                f.setStyle(oldStyle);
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

async function handleKmlFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const newLayer = new KmlLayer({ title: file.name });

    uploadGroup.getLayers().push(newLayer.vectorLayer);

    KmlLayer.handleKmlUpload(file, map, newLayer.vectorSource);
}

function initKmlLayersFromStorage() {
    const search = 'kml_';
    const values = Object.keys(localStorage)
        .filter((key) => key.startsWith(search))
        .map((key) => { return { "name": key, "value": localStorage[key] } });

    values.forEach((x) => {
        const title = x.name.substring(4);
        const newLayer = new KmlLayer({ title: title, data: x.value, projection: map.getView().getProjection() });
        uploadGroup.getLayers().push(newLayer.vectorLayer);
    });
}

document.getElementById('kmlFileUpload').addEventListener('change', handleKmlFileUpload);

// Add event listeners for the menu options
document.getElementById('link-delete-uploads').addEventListener('click', () => {
    console.log('deleting all uploads');

    const search = 'kml_';
    const values = Object.keys(localStorage)
        .filter((key) => key.startsWith(search))
        .map((key) => key);

    values.forEach((item) => { localStorage.removeItem(item) });

    window.location.reload();
});
document.getElementById('link-delete-waypoints').addEventListener('click', () => {
    console.log(waypointLayer);
    waypointLayer.clear();
});

document.getElementById('link-download-waypoints').addEventListener('click', () => {
    console.log('download waypoints');

    const data = localStorage.getItem('user_waypoints');

    // create blob and a temp link
    const blob = new Blob([data], { type: "application/vnd.google-earth.kml+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "user_waypoints.kml";

    document.body.appendChild(link);
    link.click();

    // remove temp link
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
});


Autocomplete.init("#autocompleteBottomInput", {
    valueField: "v",
    labelField: "l",
    highlightTyped: true,
    fixed: true, // fixes dropdown pos on small screens
    maximumItems: 10,
    suggestionsThreshold: 4,
    onSelectItem: ({ label, value }) => {
        //console.log('label', label);
        //console.log('value', value);
        $('#parkTxt').val(value);
        $('#parkBtn').click();
    }
});