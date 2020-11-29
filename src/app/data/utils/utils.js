export function appendItemsNewdata(state, action){
    if(typeof state !== 'undefined'){
        var objLength = Object.keys(state).length;
        var returnObj = [];

        Object.keys(state).map((item, key) =>{
            returnObj[item] = state[item].concat(action.payload.data[item]);
            if(key+1 == objLength){
                action.payload.data = returnObj;
            }
        });
        return action.payload
    }
}

export function appendInstantSata(state, action){
    if(typeof state !== 'undefined'){
        var appendedMoredata = state.concat(action.payload.data.records);
        action.payload.data = appendedMoredata;
        return action.payload.data;
    }else{
        return action.payload
    }
}

export function removeDuplicate(state, action){
    if(typeof state !== 'undefined'){
        if(action.payload.data && action.payload.data.records && action.payload.data.records.length > 0){
            var records = action.payload.data.records;
            var returnObj = [];
            for(let i =0; i<records.length; i++){
                if(records[i].content_id && !contentInPage.has(records[i].content_id)){
                    contentInPage.add(records[i].content_id);
                    returnObj.push(records[i]);
                }
            }
            action.payload.data.records = returnObj;
        }
        return action
    }
}
