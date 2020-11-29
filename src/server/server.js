import express from 'express';
import path from 'path';
import compression from "compression";
import { configureStore } from "../app/data/store";
import { matchRoutes } from 'react-router-config';

import config from "../config/index"
import Routes from '../routes/routes';
import serverRoutes from './renderer/serverRoutes'
import { matchUrlStructure, getMobile } from './Utils'
import render from './renderer/render';

const server = express();

const PUBLIC_DIR = path.resolve(__dirname, "../../public");
server.use(express.static(PUBLIC_DIR, { maxAge: 86400000*7, lastModified: true })); // oneWeek = 86400000*7;
server.use(compression());
server.disable('x-powered-by');
server.use('/', serverRoutes);

server.get('*', async (req, res) => {
	let routeMatch = {};
	let activeroute = {};
	let store = configureStore({});

	var startDate = new Date();
	var starttime = startDate.getTime();
	
	global.contentInPage = new Set();
	global.navigator = {
		userAgent: req.headers['user-agent']
	}
	let isMobile = getMobile(req);
		
	let setStatus = {status: 200};
	
	if(setStatus.status == 200){
		const actionsTemp = matchRoutes(Routes, req.path).map(({route, match}) => {
			routeMatch = match;
			if(!route.routes){
				activeroute = route
			}
			return !route.component.load ? route.component : route.component.load().then(res => {
				return res.default
			})
		});

		try{
			const loadedActions = await Promise.all(actionsTemp);
			const actions = loadedActions
				.map((component, index) => {
					return component.fetching ? component.fetching({ ...store, match:routeMatch, activeroute, location: req.originalUrl, path: req.path, isMobile }) : null
				})
				.map(async actions => {	
					return await Promise.all((actions || []).map(p => p && new Promise((resolve) => p.then(resolve).catch(resolve))))
				});
			
			await Promise.all( actions ).then((response)=>{
				for(let i=0;i<response.length;i++){
					for(let j=0;j<response[i].length;j++){
						if(response[i][j].length > 0){
							let res = response[i][j][0];
							if(res.code >= 400 && res.critical == 1){
								setStatus = {status: res.code}
							}
						}else if(response[i][j] && response[i][j]['code'] >= 400 && response[i][j]['critical'] == 1){
							setStatus = {status: response[i][j]['code']}
							break;
						}
					}
				}
			});
		}catch(ex){
			console.log('Exception in SERVER', ex)
			setStatus = {status: 500};
		}
	}

	//Check requested url and match conditions to proceed
	let storeData = store.getState();
	
	//Check if any other URL that we have not define inside routes, then set status 404
	if(routeMatch.isExact==false){
		setStatus = {status: 404}
	}

	let matcharr = matchUrlStructure(routeMatch, req.path, storeData);
	if(!matcharr.isMatch){
		//Extract Query Parameters and join them
		let queryString = Object.keys(req.query).map(key => key + '=' + req.query[key]).join('&');
		let articleUrl = matcharr.articleData.content.guid;
		return res.redirect(301, articleUrl+(queryString?'?'+queryString:''));
	}else{
		const context = { };
		render(req, res, store, storeData, context, routeMatch, setStatus, isMobile, matcharr);
		var endDate = new Date();
		var endtime = endDate.getTime();
		var timeDiff = endtime - starttime;
		console.log(req.url," (",timeDiff,"ms)"); 
	}
});

server.listen(config.PORT, () => {
	console.log(config.BASE_URL+' started on PORT '+config.PORT);
});