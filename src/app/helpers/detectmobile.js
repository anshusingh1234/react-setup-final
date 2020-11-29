import config from "../../config/index"
const isMobile = {
    Android: function Android() {
        return (!navigator.userAgent || navigator.userAgent.match(/Android/i) == null) ? false : true;
    },
    BlackBerry: function BlackBerry() {
        return (!navigator.userAgent || navigator.userAgent.match(/BlackBerry/i) == null) ? false : true;
    },
    iOS: function iOS() {
        return (!navigator.userAgent || navigator.userAgent.match(/iPhone|iPad|iPod/i) == null) ? false : true;
    },
    Opera: function Opera() {
        return (!navigator.userAgent || navigator.userAgent.match(/Opera Mini/i) == null) ? false : true;
    },
    Windows: function Windows() {
        return (!navigator.userAgent || navigator.userAgent.match(/IEMobile/i) == null) ? false : true;
    },
    Googlebot: function() {
        return (!navigator.userAgent || navigator.userAgent.match(/Googlebot/i) == null) ? false : true;
    },
    Amp: function(){
        if (typeof navigator.userAgent === 'undefined') {
            return false;
        } else {
            if(typeof window !== 'undefined') { 
                if(window.location.href.indexOf('/amp/') > -1){
                    return true;
                }
            }
            return navigator.userAgent == 'Amp' ? true : false;
        }  
    },
    any: function() {
        if((isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows())){
            return true;
        }
        return false;
    }
};

export default isMobile;