import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector';
import Overlay from 'ol/Overlay.js';
import PotaLayers from './PotaLayers.js'


var gaDnrLayer = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: './data/dnr20a.geojson'
  })
})

var gaNatLayer = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: './data/geojsonOutput.json'
  })
});


const map = new Map({
  target: document.getElementById('map'),
  layers:  [new TileLayer({source: new OSM()})],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});


// add our layers
let currentLayer = 'US-GA';
let potaLayers = new PotaLayers();
let x = potaLayers.getLayers();

map.addLayer(gaNatLayer);
map.addLayer(gaDnrLayer);
map.addLayer(potaLayers.getLayer(currentLayer));


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

function onLocationBtn(event) {

};

$('#locBtn').click(function() {
  map.removeLayer(potaLayers.getLayer(currentLayer));
  const inVal =  $('#locTxt').val();
  currentLayer = inVal;
  map.addLayer(potaLayers.getLayer(currentLayer));
});

$('input#checkGaDnr').change(function () {
  if ($('input#checkGaDnr').is(':checked')) {
    map.addLayer(gaDnrLayer);
  } else {
    map.removeLayer(gaDnrLayer);
  }
});

$('input#checkGaNat').change(function () {
  if ($('input#checkGaNat').is(':checked')) {
    map.addLayer(gaNatLayer);
  } else {
    map.removeLayer(gaNatLayer);
  }
});