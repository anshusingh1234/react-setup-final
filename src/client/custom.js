import config from '../config'
import copy from 'copy-to-clipboard';


window.Util = {
    Observe: function(selector, threshold, cb, element=false){
        let elem = '';
        if(element){
            elem = selector;
        }else{
            elem = document.querySelector(selector);
        }
        
        threshold = threshold || 100; // Default Threshold, given to load just before coming to viewport
        if(elem != null){
            if ("IntersectionObserver" in window) {
                let elemObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            let target = entry.target;
                            cb();
                            elemObserver.unobserve(target);
                        }
                    });
                }, {
                    rootMargin: '0px 0px '+threshold+'px 0px'
                });
                elemObserver.observe(elem);
            } else {
                cb();
            }
        }
    },
    isInViewport: function (elem, fromBottom=2, threshold=0) {
        if(!elem){
            return false;
        }
        var bounding = elem.getBoundingClientRect();
        return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            (bounding.bottom/fromBottom) - threshold <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    setCookie: function(name, value, daysToExpire){
        var date = new Date();
        date.setTime(date.getTime()+(daysToExpire*24*60*60*1000));
        document.cookie = name + "=" + JSON.stringify(value) + "; expires=" + date.toGMTString()+"; path=/;";
    },
    getCookie: function(name){
        var name = name + "=";
        var allCookieArray = document.cookie.split(';');
        for(var i=0; i<allCookieArray.length; i++){
            var temp = allCookieArray[i].trim();
            if (temp.indexOf(name)==0){
                let value = temp.substring(name.length,temp.length);
                return JSON.parse(value);
            }
                
        }
        return "";
    },
    clearCookie: function(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
    setLocalstorage: function(key, value, isJSON){
        if(isJSON){
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
        return true;
    },
    getLocalstorage: function(key, isJSON){
        let value = localStorage.getItem(key);
        if(isJSON){
            value = JSON.parse(value);
        }
        return value;
    },
    removeLocalstorage: function(key){
        localStorage.removeItem(key);
        return true;
    },
    loadScript: function(path, async="true", cb){
		var s = document.createElement('script');
        s.src = path;
        s.type = "text/javascript";
        s.async = async;
        document.getElementsByTagName('head')[0].appendChild(s);
        s.onload = function() {
            if(cb) cb('success');
        };
        s.onerror = function() {
            if(cb) cb('error');
        };
    },
    
    loadCustomScript: function(scripts){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML = scripts;        
        document.getElementsByTagName('head')[0].appendChild(script);
    },
    
    copyToClipboard: function(text=''){
        copy(text);
        alert('Link Copied');
    },
   
    replaceState: function(title, url){
        history.replaceState(null, null, url);
        if(title)
            document.title = title;
    },
    
    loadSecondFoldLibraries: function(){
       
    }
}
