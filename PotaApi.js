

// Takes park id and returns the lat long for the parks marker
// moderate checking on the park name
export default async function getParkLocation(park) {
    const re = /[A-Z]{2}-[0-9]*/;
    park = park.toUpperCase();
    let b = re.test(park);

    if (b == false) return;

    let url = "https://api.pota.app/park/" + park;

    const parkData = await $.ajax({ url: url });

    return { 'lat': parkData.latitude, 'lon': parkData.longitude };
}

async function getParkLastActx(park) {
    const re = /[A-Z]{2}-[0-9]*/;
    park = park.toUpperCase();
    let b = re.test(park);

    if (b == false) return;

    let url = "https://api.pota.app/park/activations/" + park;

    const parkData = await $.ajax({ url: url, data: { "count": 1 } });

    let dt = parkData[0].qso_date.slice(0,4) + '-' +
             parkData[0].qso_date.slice(4,6) + '-' +
             parkData[0].qso_date.slice(6);
    return {
        'lastActivator': parkData[0].activeCallsign,
        'date': dt
    };
}

export { getParkLocation, getParkLastActx };