

// Takes ref_id and returns the lat long for the summit marker
export default async function getSummitLocation(ref_id) {
    if (!isSummit(ref_id)) {
        throw new Error("not a summit");
    }

    const SUMMIT_URL = "https://api2.sota.org.uk/api/summits/"

    let url = SUMMIT_URL + ref_id;

    const data = await $.ajax({ url: url });

    return { 'lat': data.latitude, 'lon': data.longitude };
}

function isSummit(ref) {
    const regex = new RegExp('[a-zA-Z0-9]{2,3}\/[a-zA-Z0-9]{2}-[0-9]{3}');
    const res =  regex.test(ref);
    return res;
}



export { getSummitLocation,  isSummit };