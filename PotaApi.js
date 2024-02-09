

// Takes park id and returns the lat long for the parks marker
// moderate checking on the park name
export default async function getParkLocation(park) {
    const re = /K-[0-9]*/;
    park = park.toUpperCase();
    let b = re.test(park);

    if (b == false) return;

    let url = "https://api.pota.app/park/" + park;

    const parkData = await $.ajax({url: url});

    return { 'lat': parkData.latitude, 'lon': parkData.longitude };
}
