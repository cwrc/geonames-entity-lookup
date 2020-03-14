'use strict';

/*
     config is passed through to fetch, so could include things like:
     {
         method: 'get',
         credentials: 'same-origin'
    }
    Note that the default config includes the accept header.  If an over-riding config
    is passed in, don't forget to set the accept header so we get json back from dbpedia
    and not XML.
*/

const fetchWithTimeout = async (url, config = {headers: {'Accept': 'application/json'}}, timeout = 30000) => {

    /*
        the reject on the promise in the timeout callback won't have any effect, *unless*
        the timeout is triggered before the fetch resolves, in which case the setTimeout rejects
        the whole outer Promise, and the promise from the fetch is dropped entirely.
    */
   
    setTimeout(() => {
        throw new Error('Call to geonames timed out');
    }, timeout);

    const response = await fetch(url, config)
        .catch( error => {
            throw new Error(`Something wrong with the call to geonames, possibly a problem with the network or the server. Error: ${error}`);
        });

    if (response.ok) return response.json();

    // if status not ok, through an error
    throw new Error(`Something wrong with the call to geonames, possibly a problem with the network or the server. HTTP error: ${response.status}`);

}

const getPlaceLookupURI = (queryString) => {
    return `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(queryString)}&username=cwrcgeonames&maxRows=10`
}

const callGeonamesURL = async (url, queryString) => {

    const results = await fetchWithTimeout(url);

    const mapResults = results.geonames.map(
        ({
            toponymName,
            adminName1: state = '',
            countryName = '',
            geonameId,
            fcodeName: description = 'No description available'
        }) => {
            const name = `${toponymName} ${state} ${countryName}`;
            const uri = `http://geonames.org/${geonameId}`;

            return {
                nameType: 'place',
                id: uri,
                uri,
                uriForDisplay: null,
                externalLink: uri,
                name,
                repository: 'geonames',
                originalQueryString: queryString,
                description
            }
        })

    return mapResults;
}

const findPlace = (queryString) => {
    return callGeonamesURL(getPlaceLookupURI(queryString), queryString)
}

// module.exports = {
export default {
    findPlace,
    getPlaceLookupURI
}