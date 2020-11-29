import fetch from "isomorphic-fetch";
import config from "../../../config";
export default ( url, method, body, isHeader, nocacache ) => {
    let options = '';
    if(method === "GET"){
        options = {
            method    
        }
    }else{
        options = {
            method,
            body: JSON.stringify( body ),
        }
    }
    options.headers = requestHeaders();

    var starttime = new Date().getTime();
    return fetch( url, options )
        .then( res => {
            var endDate = new Date();
            var endtime = endDate.getTime();
            var timeDiff = endtime - starttime;
            if(timeDiff > 500 || !config.PRODUCTION)
                console.log(url," (",timeDiff,"ms)")
            return parseStatus( res.status, res)
        } ).catch((e) => {
            console.log('API FETCHING ERROR: ', e, url, options);
            return parseStatus( 500, [])
        })
}

function parseStatus( status, res ) {
    return new Promise( ( resolve, reject ) => {
        if ( status >= 200 && status < 300 ) {
            res.json().then( response => resolve( response ) );
        } else {
            resolve({success:0, error:status, response:[]});
        }
    } );
}

function requestHeaders() {
    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    }
    return headers;
}
