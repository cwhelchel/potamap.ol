'use strict';

import Papa from 'papaparse'

// use Papaparse to parse the activated_parks.csv file from pota.app user's 
// stats page... it can also do the same for the hunter_parks.csv file if they
// upload that.
export default async function handleActxUpload(file) {

    const r = new FileReader();

    r.onload = async (e) => {
        try {
            const parsedResult = Papa.parse(e.target.result, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true
            });

            if (parsedResult.errors.length > 0) {
                console.error('Errors parsing CSV:', parsedResult.errors);
                throw new Error('Error parsing CSV data.');
            }

            let parsed = parsedResult.data;

            let activated = []

            parsed.forEach(ad => {
                const r = ad['Reference'];
                activated.push(r);

            });

            setActxData(JSON.stringify(activated));
        }
        catch {
            setActxData("[]");
        }
    };

    r.readAsText(file);
}

function getActxData() {
    if (localStorage.getItem('locActxData') !== undefined) {
        const data = localStorage.getItem('locActxData');
        return JSON.parse(data);
    }

    return null;
}

async function setActxData(arr) {
    localStorage.setItem('locActxData', arr);
}

export { handleActxUpload, getActxData };