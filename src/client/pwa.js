let deferredPrompt;
window.PWA = {
    isStandAlone: function(){
        let opened_in_app = false;
        if (window.matchMedia('(display-mode: standalone)').matches) {
            opened_in_app = true;
        }
        return opened_in_app;
    },
    showAddToHome: function(){
        document.querySelector('.mainapp-lite') && document.querySelector('.mainapp-lite').classList.remove('d-none');
    },
    hideAddToHome: function(){
        document.querySelector('.mainapp-lite') && document.querySelector('.mainapp-lite').classList.add('d-none');
    },
    installEventListeners: function(){
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            PWA.showAddToHome();
        });
    
        window.addEventListener('appinstalled', (evt) => {
            //console.log('App Installed in User Device');
            gtag('event', 'PWA', {
                'event_category' : 'Add to Home Screen',
                'event_label' : 'installed'
            });
            Util.setCookie('pwa_installed', true, 30);
        });
    },
    promptToUser: function(){
        deferredPrompt.prompt();
        deferredPrompt.userChoice
            .then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    PWA.hideAddToHome();
                }
                deferredPrompt = null;
            });
    },
    addToHomeScreen: function(){
        if(document.querySelector('.mainapp-lite')){
            PWA.hideAddToHome();
            if(Util.getCookie('pwa_installed')){
                return;
            }

            if(!PWA.isStandAlone() && 'serviceWorker' in navigator) {
                PWA.installEventListeners();
                document.querySelector('.mainapp-lite').addEventListener('click', (e)=>PWA.promptToUser());
            }
        }
    }
}
PWA.addToHomeScreen();