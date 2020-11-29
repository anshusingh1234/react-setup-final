import config from "../../../config"
import fetch from "../utils/fetch";

const apiBaseUrl = config.API_BASE_URL;
const userBaseUrl = config.USER_API_BASE_URL;
const baseUrl = config.BASE_URL;

const apiService = ( {getState } ) => ( next ) => ( action ) => {
    var allCalls = [];
    if(typeof action.CALL_API === 'undefined') {
        return next(action);
    }

    let getStateData = getState();
    let url = '';
    action.CALL_API.map((action)=> {
        if(action !== null && typeof action.meta.path !== 'undefined') {
            const { method = "GET", body, isHeader } = action.meta;
            url = handleUrl(action, getStateData)
            allCalls.push( fetch( url, method, body, isHeader, getStateData.home.nocache ).then(
              res => handleResponse( res, action, next ),
              err => handleResponse( err, action, next ))
            );
        }else{
            handleResponse( {code: action.meta.status, message: 'Internal server error', data: { records: [ ] }, critical: action.meta.critical ? action.meta.critical : 0}, action, next )
        }
    });

    let havingChildSuccess = -1;
    for (let index = 0; index < action.CALL_API.length; index++) {
        const obj = action.CALL_API[index];
        if(typeof obj.meta.success !== "undefined"){
            havingChildSuccess = index;
            break;
        }
    }
    
    return new Promise( (resolve, reject) =>{
        Promise.all(allCalls).then( (results) =>{
            let criticalSuccess = true;
            for(let i=0;i<results.length;i++){
                if(results[i].code >= 400 && results[i].critical == 1){
                    criticalSuccess = false;
                }
            }
            if(criticalSuccess){
                if(havingChildSuccess != -1){                    
                    var rs = action.CALL_API[havingChildSuccess].meta.success(results[havingChildSuccess]);
                    var allChildCalls = [];
                    rs && rs.map((childAction)=> {
                        const { path, method = "GET", body, isHeader } = childAction.meta;
                        let url = handleUrl(childAction, getStateData)
                        allChildCalls.push( fetch( url, method, body, isHeader, getStateData.home.nocache ).then(
                                        res => handleResponse( res, childAction, next ),
                                        err => handleErrors( err, childAction, next ))
                        );
                    });

                    if(allChildCalls.length > 0){
                        return Promise.all(allChildCalls).then( (allChildResults)=>{
                            resolve(allChildResults);
                        }).catch( ex => {
                            reject(ex);
                        });
                    }else{
                        resolve(results);    
                    }
                }else{
                    resolve(results);
                }
            }else{
                resolve(results);
            }
            
        }).catch( ex => {
            reject(ex);
            //return Promise.reject(ex);
        });
    });
};

function handleResponse( res, action, next ) {
    try{
        if(res.error && res.error < 500 && res.error >= 400){
            res = { code: res.error, message: 'Not Found', data: { records: [ ] }, critical: action.meta.critical ? action.meta.critical : 0 };
        }else if(res.error && res.error >= 500){
            res = { code: res.error, message: 'Internal server error', data: { records: [ ] }, critical: action.meta.critical ? action.meta.critical : 0 };
        }else if(res.code && res.code < 500 && res.code >= 400){
            res = { code: res.code, message: 'Not Found', data: { records: [ ] }, critical: action.meta.critical ? action.meta.critical : 0 };
        }else if(res.code && res.code >= 500){
            res = { code: res.code, message: 'Internal server error', data: { records: [ ] }, critical: action.meta.critical ? action.meta.critical : 0 };
        }else{
            res.critical = action.meta.critical ? action.meta.critical : 0
        }

        next( {
            type: action.type,
            payload: res,
            meta: action.meta,
        } );
        return res;
    }catch(ex){
        return ex;
    }
}


function handleUrl(action, getState){
    let path = action.meta.path;
    let url = `${ apiBaseUrl }${ path }`;
    if(action.meta.isbase){
        url = `${ baseUrl }${ path }`;
    }else if(path.substr(1,5) == 'users'){
        url = `${ userBaseUrl }${ path }`;
    }else if(action.meta.iscomment){
        url = `${ config.COMMENT_API_BASE_URL }${ path }`;
    }

    if(path.indexOf('http') !== -1){
        url = path;
    }

    return url;
}

export default apiService;