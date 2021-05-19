import React from 'react';
import ReactDOM from 'react-dom';
import { loadableReady } from '@loadable/component'
import { Provider } from 'react-redux';
import { configureStore } from "../app/data/store";
import Routes from '../routes/routes';
import { renderRoutes } from 'react-router-config';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import custom from "./custom";
//import pwa from "./pwa";

//loadableReady(() => {
	let store = configureStore(window.INITIAL_STATE);
	const reduxState = store.getState();
	
	ReactDOM.render(
		<Provider store={ store }>
      <HelmetProvider>
        <BrowserRouter>
          <div className="wrap">{renderRoutes(Routes, window.extraprops)}</div>
        </BrowserRouter>
      </HelmetProvider>
		</Provider>
	, document.getElementById('main_app_id'));
//});