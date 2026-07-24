

// Takes park id and returns the lat long for the parks marker

import { FeatureLike } from "ol/Feature";
import { getParkLastActx, isPark } from "./PotaApi";

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

export { updateFooterLinks };