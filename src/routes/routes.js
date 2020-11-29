import React from 'react';
import App from "../app/containers/App";
import {Home} from "./splitComponent"


const routes = [{
	component: App,
	routes: [
		{
			path: "/",
			component: Home,
			exact: true,
		},
	]
}];


export default routes;
