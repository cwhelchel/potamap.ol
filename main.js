import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style.js';
import Overlay from 'ol/Overlay.js';

const iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 0.5],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    src: 'data/img/yd.png',
  }),
});

var gaDnrLayer = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: './data/dnr20a.geojson'
  })
})

var gaPotaLayer = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: './data/parks-US-GA.geojson'
  }),
  style: iconStyle
})

//gaPotaLayer.style = iconStyle

const map = new Map({
  target: document.getElementById('map'),
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    gaDnrLayer,
    gaPotaLayer
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

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