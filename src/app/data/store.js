import { applyMiddleware, createStore, compose, combineReducers } from "redux";
import * as reducers from "./ducks";
import reduxThunk from "redux-thunk";
import { apiService } from "./middlewares";


export function configureStore(preloadedState){
    let composeEnhancers = compose;
    if (typeof window !== 'undefined') {
        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        preloadedState = window.INITIAL_STATE || {};
    }
    const rootReducer = combineReducers( reducers );
    return createStore(
        rootReducer,
        preloadedState,
        composeEnhancers(
            applyMiddleware(
                apiService,
                reduxThunk,
            ),
        ),
    );
}