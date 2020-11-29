	var express = require('express');
var server = express.Router();
import glob from "glob";
import path from 'path';
import fs from "fs";

var url = require('url');
var http = require('http');
//import requestImageSize from 'request-image-size';

const PUBLIC_DIR = path.resolve(__dirname, "../../../public");

server.get('/index.php', (req, res) => {
	res.status(404).end('Not Found');
});

server.get('/healthcheck', (req, res) => {
	res.status(200).end('ok')
});

server.get('/nginx_status', (req, res) => {
	res.status(200).end('ok')
});

server.get('/dist/*.js', (req, res) => {
	let useagent = req.headers['user-agent'];
	let isBot = false;
	if(useagent){
		useagent = useagent.toLowerCase();
		if(useagent.indexOf('googlebot') > -1  || useagent.indexOf('bingbot') > -1 || useagent.indexOf('slurp') > -1){
			isBot = true;
		}
	}
	if(isBot || 1){
		let path = req.url;
		let filename = path.substring(path.lastIndexOf('/')+1);
		filename = filename.split('.');
		let filenameWildcard = '';
		if(filename.length > 0){
			for (let index = 0; index < filename.length; index++) {
				if(filename[index].length > 15){
					if(filenameWildcard.indexOf('*') ===  -1){
						filenameWildcard = filenameWildcard + '*';
					}
				}else{
					if(filename[index] == 'js'){
						filenameWildcard = filenameWildcard + '.js';
					}else{
						filenameWildcard = filenameWildcard + filename[index];
					}
				}
			}
			
			try{
				var files = glob.sync(PUBLIC_DIR+'/dist/'+filenameWildcard, {});
				if(files[0]){
					let jsFile = fs.readFileSync(files[0], 'utf8');
					res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
					res.status(200).send(jsFile);
				}else{
					res.status(404).end('Not Found');
				}
			}catch (error) {
				res.status(404).end('Not Found');
			}
		}
	}
	
	res.status(404).end('Not Found');
});


server.get('/dist/*.css', (req, res) => {
	let path = req.url;
	let filename = path.substring(path.lastIndexOf('/')+1);
	filename = filename.split('.');
	let filenameWildcard = '';
	if(filename.length > 0){
		for (let index = 0; index < filename.length; index++) {
			if(filename[index].length > 15){
				if(filenameWildcard.indexOf('*') ===  -1){
					filenameWildcard = filenameWildcard + '*';
				}
			}else{
				if(filename[index] == 'css'){
					filenameWildcard = filenameWildcard + '.css';
				}else{
					filenameWildcard = filenameWildcard + filename[index];
				}
				
			}	
		}
		try{
			var files = glob.sync(PUBLIC_DIR+'/dist/'+filenameWildcard, {});
			if(files[0]){
				let cssFile = fs.readFileSync(files[0], 'utf8');
				res.setHeader('Content-Type', 'text/css; charset=UTF-8');
				res.status(200).send(cssFile);
			}else{
				res.status(404).end('Not Found');
			}
		}catch (error) {
			res.status(404).end('Not Found');
		}
	}
	res.status(404).end('Not Found');
});

server.get('*.(map|jpeg|jpg|png|gif|ico|ttf|woff|otf|woff2)', (req, res) => {
    res.status(404).end('Not Found')
});


module.exports = server;