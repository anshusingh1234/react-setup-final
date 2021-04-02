import Mobile from '../app/helpers/detectmobile'
import path from 'path';
import fs from 'fs';
import config from '../config/index';
import e from 'express';

export function matchEndWithoutSlashUrl(url){
	let returnObj = {isMatch: false, url_old: url, url_new: ''}
	var url_arr = url.split("?");
	if(url_arr.length > 0){
		url = url_arr[0];
	}
	var lastChar = url.charAt(url.length-1);
	if(lastChar != "/"){
		var allowed_extensions = url.match(/\.(php|html|htm|jpg|gif|png|js|css|woff|ttf|ico|xml|txt|rss|svg|woff2|eot|map|json)$/g);
		if (allowed_extensions == null && url != '/apple-app-site-association'){
			returnObj.isMatch = true;
			returnObj.url_new = url+"/";
		}
	}
	return returnObj;
}

export function matchEndWithSlashUrl(url){
	let returnObj = {isMatch: false, url_old: url, url_new: ''}
	if(!url || url == '/'){
		return returnObj;
	}
	var url_arr = url.split("?");
	if(url_arr.length > 0){
		url = url_arr[0];
	}
	var lastChar = url.charAt(url.length-1);
	if(lastChar == "/"){
		returnObj.isMatch = true;
		if(url_arr[1]){
			returnObj.url_new = url.replace(/\/$/, "")+'?'+url_arr[1];
		}else{
			returnObj.url_new = url.replace(/\/$/, "");
		}
		
	}
	return returnObj;
}

export function matchUrlStructure(routeMatch, url, reduxState){
	let returnObj = {isMatch: true, isArticle: false, articleData:{}}
  return returnObj;
}

export function getMobile(req){
	let isMobile = false;
	if(req.headers['pmuser_ua']){
		if(req.headers['pmuser_ua'] == '1'){
			isMobile = true;
		}else{
			isMobile = false;
		}
	}else{
		if(Mobile.any()){
			isMobile = true;
		}else{
			isMobile = false;
		}
	}
	return isMobile;
}


export function getCSSText(isMobile, lang){
	let stylesOriginalFiles = 'web.css';
  let style_css = path.resolve(__dirname, "../../public", "dist", stylesOriginalFiles);
  return fs.readFileSync(style_css, 'utf8');
}


export function getAPPIconHTML(lang){
	return `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"><link rel="manifest" href="/site.webmanifest"><link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"><meta name="msapplication-TileColor" content="#da532c"><meta name="theme-color" content="#ffffff"><meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="referrer" content="origin"/><meta http-equiv="content-type" content="text/html;charset=UTF-8" /><meta http-equiv="X-UA-Compatible" content="ie=edge"><meta property="og:site_name" content="Graphs"/><meta name="twitter:card" content="summary_large_image"/><meta property="og:type" content="website"/>`;
}

export function getPreConnect(){
	let preconnect = [
	]
	let preconnectHTML = [];
	for (let index = 0; index < preconnect.length; index++) {
		preconnectHTML.push(`<link rel="preconnect" href="${preconnect[index]}"/>`);
	}
	return preconnectHTML.join('')
}

export function allowJS(request, isMobile){
	if(!isMobile){
		return 'function isallow(){return true}';
	}
	return `function isallow(){let return_data = true;let str = 'laibgchdtehfoguhsie';let t = '';for(let i=0;i<str.length;i++){if(i%2==0){t+=str[i];}}if(navigator && navigator.userAgent && navigator.userAgent.toLowerCase().indexOf(t) > -1){return_data = false;}str = 'ianbscidgehftgs';t = '';for(let i=0;i<str.length;i++){if(i%2==0){t+=str[i];}}if(navigator && navigator.userAgent && navigator.userAgent.toLowerCase().indexOf(t) > -1){return_data = false;}str = 'gatbmcedterfigx';t = '';for(let i=0;i<str.length;i++){if(i%2==0){t+=str[i];}}if(navigator && navigator.userAgent && navigator.userAgent.toLowerCase().indexOf(t) > -1){return_data = false;}str = 'paibncgddeofm';t = '';for(let i=0;i<str.length;i++){if(i%2==0){t+=str[i];}}if(navigator && navigator.userAgent && navigator.userAgent.toLowerCase().indexOf(t) > -1){return_data = false;}str = 'patbsct';t = '';for(let i=0;i<str.length;i++){if(i%2==0){t+=str[i];}}if(navigator && navigator.userAgent && navigator.userAgent.toLowerCase().indexOf(t) > -1){return_data = false;}return return_data;}`
}


export function thirdPartyAnalytics(request, lang, isMobile, articleDetail){
  return '';
}


export function noscriptTag(lang){
	return '';
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function getScripts(extractor, lang, hash){
	const scriptTags = extractor.getScriptElements()	
	let scriptFiles = [];
	for (const scripts in scriptTags) {
		let index = scripts[0];
		if(scriptTags[index] && scriptTags[index].props && scriptTags[index].props.src){
			scriptFiles.push(`${scriptTags[index].props.src}`)
		}
	}

	var unique = scriptFiles.filter( onlyUnique );
    unique = unique.join(',');
    return unique;
}

function loadcommonjs(){
	return `function loadcommonjs(){for (var i = 0; i < jsArray.length; i++) {let clientJs = jsArray[i];var script = document.createElement("script");script.src = jsArray[i];document.body.appendChild(script);}}`
}

export function serviceWorker(extractor, lang, isMobile, request){
    let hash = extractor.stats.hash;
	const serviceWorkerUrl = '/sw.js?hash='+hash;
	const scriptFiles = getScripts(extractor, lang, hash);
	
	return `<script type="text/javascript">var jsArray = "${scriptFiles}".split(',');${allowJS(request, isMobile)}${loadcommonjs()}${isMobile ? `if ('serviceWorker' in navigator) {navigator.serviceWorker.register('${serviceWorkerUrl}')}` : `if ('serviceWorker' in navigator) { navigator.serviceWorker.getRegistrations().then(function(registrations) {for(let registration of registrations) {registration.unregister()}})}`};if(isallow()){loadcommonjs();}</script>`;
}
