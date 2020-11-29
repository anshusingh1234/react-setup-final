import { combineReducers } from "redux";
import types from "./types";
import createReducer from "../../utils/createReducer";

const homeBigStory = createReducer( [ ] )( {
    [ types.FETCH_HOME_BIG_STORY ]: ( state, action ) => action.payload.data,
} );


export default combineReducers( {
    homeBigStory,
} );
