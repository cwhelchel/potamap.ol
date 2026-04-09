

// Takes park id and returns the lat long for the parks marker

import { FeatureLike } from "ol/Feature";
import { getParkLastActx, isPark } from "./PotaApi";

// moderate checking on the park name
export default function getPopupContent(features: FeatureLike[]) {

    let layerContent = "";
    let content = "";

    features.forEach((f) => {
        const name = f.get('NAME'); // should ALWAYS be there 
        const title = f.get('TITLE'); // will be there for pota parks

        if (name === "accuracy_feat" || name === "pos_feat")
            return;

        const { html, isLayerInfo } = getContent(f);

        if (isLayerInfo) {
            // init layer content div
            if (layerContent === "") {
                layerContent = `<span class="layers-title">other layers:</span><div class="layers">`;
            }
            layerContent += html;
        }
        else
            content += html;

        console.log(layerContent);
    });

    if (layerContent !== "")
        layerContent += "</div>";

    return content + layerContent;
}

function getContent(f: FeatureLike) {
    let name = f.get('NAME'); // should ALWAYS be there 
    let title = f.get('TITLE'); // will be there for pota parks
    const type = f.get('type');
    let res = "";
    let shapeTitle = '';
    let isLayerInfo = false;

    if (name === "accuracy_feat" || name === "pos_feat" || type === "ffma")
        return { html: "", isLayerInfo: false };

    // from a shapefile. use its properties as they provide way more info
    if (title === undefined) {
        isLayerInfo = true;
        const layerBadge = `<div class="shape-prop layer-badge">layer</div>`;

        let p = f.getProperties();
        for (var property in p) {
            if (typeof (p[property]) == "string") {
                if (property === "NAME" || property === "name") {
                    const n = p["NAME"] ?? p["name"];
                    shapeTitle = `<div class="shape-name">${n}</div>`;
                    continue;
                }
                res += `<div class="shape-prop">${property} : ${p[property]}</div>`;
            }
        }
        let propsDiv = `<div class="shape-props">${res}</div>`
        res = `<div class="shape-popover">${shapeTitle}${propsDiv}</div>`
    }
    else {
        // POTA or SOTA marker was clicked
        res = `<div class="popover-title">${name} - ${title}</div>`;
    }
    return { html: res, isLayerInfo: isLayerInfo };
}

function updateFooterLinks(feature: FeatureLike) {
    let name = feature.get('NAME'); // should ALWAYS be there 
    let title = feature.get('TITLE'); // will be there for pota parks
    if (title === undefined)
        return;

    const res = `${name} - ${title}`;

    // from POTA park markers. get and display POTA specific info
    if (isPark(name)) {
        $("#potaLink").attr('href', `https://pota.app/#park/${name}`);
        $("#potaLink").text(res);
        $("#wikiLink").attr('href', `https://pota.miraheze.org/wiki/${title}`);
        $("#wikiLink").text('Wiki')
        let lastAct = getParkLastActx(name);
        lastAct.then(
            function (value) { $("#actxData").text("Last Activation: " + `${value?.lastActivator} on ${value?.date}`) },
            function (error) { /* code if some error */ }
        );
    } else {
        // summit
        $("#potaLink").attr('href', `https://www.sotadata.org.uk/en/summit/${name}`);
        $("#potaLink").text(res);
        $("#wikiLink").text('')
        let p = feature.getProperties();
        $("#actxData").text(p['ASSOCIATION'] + ' / ' + p['REGION']);
    }
}

export { getPopupContent, updateFooterLinks };