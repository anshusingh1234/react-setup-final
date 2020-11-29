import React, {Fragment} from 'react';
import config from '../../config'
import {FormattedMessage} from 'react-intl';

export function agoFormat(inputDate){
    if(typeof inputDate!="undefined" && inputDate.length>0){
        const timeVal = inputDate[0];
        const labelName = inputDate[1]; 
        if(labelName){
          return labelName.toLowerCase();
        }
        else return '';
    }
}

export function getFullMonth(month){
  return month.toLowerCase();
}

export function getTodaysDate(){
    return formatDate();
}

export function createUrl(url){
  return url;
}

export function getPageNo(url){
  let pageno = 1;
  if(url.indexOf('?page=') > -1){
      pageno = parseQueryString(url, 'page');
  }else{
      let queryString = url.split('?');
      let urlSplit = queryString[0].split('/');
      pageno = urlSplit[urlSplit.length-1];
      if(!/^[0-9]+$/.test(pageno)){
          pageno = 1;
      }
  }
  return pageno;
}

export function getPastDate(date, day=1){
    var date = new Date(date);
    if(day != 0)
        date.setDate(date.getDate() - day);
    return formatDate(date);
}

export function formatDate(date = ''){
    let today = date ? new Date(date) : new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!

    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    } 
    if (mm < 10) {
        mm = '0' + mm;
    } 
    return `${yyyy}-${mm}-${dd}`;
}

export function arraySearch(arr,val) {
    for (var i=0; i<arr.length; i++)
        if (arr[i] === val)                    
            return i;
    return false;
}


export function stripTags(html, stripTo){
	stripTo= stripTo | 0;
	html = html.replace(/<(?:.|\n)*?>/gm, '');
	if(stripTo != 0){
		if(html.length > stripTo){
			html = html.substr(0, stripTo) + '...';
		}
	}
	return html;
}

export function getPathName(url){
    let queryString = url.split('?');
    let urlSplit = queryString[0].split('/');
    let pageno = urlSplit[urlSplit.length-1];
    if(!isNaN(parseInt(pageno))){
        urlSplit = urlSplit.slice(0, urlSplit.length-1);
    }
    return urlSplit.join('/')+(queryString[1] ? '?'+queryString[1] : '');
}


export function shorten(str, maxLen, separator = ' '){
    if (str.length <= maxLen) return str;
    str = str.substr(0, str.lastIndexOf(separator, maxLen));
    return str+' ...';
}

function validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}


export function parseQueryString(location, key=''){
    if(!location){
        return '';
    }
    var params = {}, queries, temp, i, l;
	// Split into key/value pairs
	let queryString = location.split('?');
    if(queryString[1]){
        queries = queryString[1].split("&");
        // Convert the array of strings into an object
        for ( i = 0, l = queries.length; i < l; i++ ) {
            temp = queries[i].split('=');
            params[temp[0]] = temp[1];
        }
        if(key !='')
            return params[key] ? params[key] : '';
        else
            return params
    }
    return '';
}

export function trimChars(string, length){
    return string.length>length ? string.substr(0, length)+'...' : string;
}

export function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();

    return rect.bottom > 0 &&
        rect.right > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
        rect.top < (window.innerHeight || document.documentElement.clientHeight);
}

export function getCustomJS(code){
    if(!code){
        return '';
    }
    let script = /<script>(.*)<\/script>/gm.exec(code);
    return (script && script[1]) ?  script[1] : '';
}

export function divideArraytoChunks(array, chunkSize){

    if(!(array && Array.isArray(array) && array.length)) return [];
    
    return array.reduce((resultArray, item, index) => { 
        const chunkIndex = Math.floor(index/chunkSize)
      
        if(!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [] // start a new chunk
        }
      
        resultArray[chunkIndex].push(item)
      
        return resultArray
      }, [])
}

export function generateUUID() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 16; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        if(i%4 == 0 && i>0){
            result += '-'    
        }
    }
    return result;
}
