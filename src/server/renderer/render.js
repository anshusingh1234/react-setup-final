import React from 'react';
import { renderToString } from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server'
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import path from 'path';
import fs from 'fs';
import Routes from '../../routes/routes';
import {IntlProvider } from "react-intl";
import config from '../../config/index';
import { HelmetProvider } from 'react-helmet-async';
import { getCSSText, getAPPIconHTML, getPreConnect, thirdPartyAnalytics, noscriptTag, serviceWorker } from "../Utils"

const statsFile = path.resolve('./public/dist/loadable-stats.json')
export default (request, res, store, storeData, context, routematch, setStatus, isMobile, articleData) => {
    const extractor = new ChunkExtractor({ statsFile })
    try{
        const reduxState = storeData;
        let lang = 'en';

        let status = setStatus.status;
        let extraprops = { status, isMobile, serverRequest:true}

        const helmetContext = {};

        const html = renderToString(extractor.collectChunks(<Provider store={ store }>
            {/* <IntlProvider locale={lang} messages={locale[lang]}> */}
                <HelmetProvider context={helmetContext}>
                    <StaticRouter location={request.originalUrl} context={context}>
                        <div className="wrap">{renderRoutes(Routes, extraprops)}</div>
                    </StaticRouter>
                </HelmetProvider>
            {/* </IntlProvider> */}
        </Provider>));
        
        res.setHeader('content-type', 'text/html; charset=utf-8');
        if(status < 500 && status > 400) {
            res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        }else if(status >= 500) {
            res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        }
        const { helmet } = helmetContext;
        let reactDom = '';
        reactDom = getHeader(extractor, lang, helmet, isMobile, articleData, request) + html + getFooter(extractor, lang, reduxState, extraprops, isMobile, request);
        res.status(status).end(reactDom);
    }catch(ex){
        logger(isMobile, request.originalUrl, ex)
    }
};


function logger(isMobile, pathname, ex){
    let date = new Date();
    console.error(date.toString(), ' ', pathname, ' env:'+isMobile ? 'Mobile' : 'Desktop',' ' , ex);
}

function getHeader(extractor, lang, helmet, isMobile, articleData, request){
    const cssText = getCSSText(isMobile, lang)
    const linkTags = extractor.getLinkTags()
    return `<!doctype html><html lang="${lang}"><head>${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}<meta name="google-site-verification" content="ZgFICIedNvVZl5pV9EfAUeenwta9vBY0Za_GgmV4zuw" />${getAPPIconHTML(lang)}${getPreConnect()}${linkTags}${(process.env.NODE_APP != 'production') ? '<meta name="robots" content="noindex, nofollow" />' :''}<style type="text/css">${cssText}#closeDiv { top: 102px !important; left: auto !important; right: 0 !important;} .skinner-ad #closeDiv{ top: 0px !important; }</style>
    ${helmet.script.toString()}
    ${thirdPartyAnalytics(request, lang, isMobile, articleData)}
    </head>
    <body>
    ${noscriptTag(lang)}
    <div id="main_app_id">`;
}



function getFooter(extractor, lang, reduxState, extraprops, isMobile, request){
    reduxState = JSON.stringify(reduxState).replace(/</g, '\\u003c');
    return `</div><script type="text/javascript">window.is_production=${process.env.NODE_APP=='production' ? true: false}; window.INITIAL_STATE=${ reduxState };window.extraprops=${JSON.stringify(extraprops)};window.isMobile=${isMobile};var contentInPage=new Set([${[...contentInPage].join(',')}]);</script>
    ${serviceWorker(extractor, lang, isMobile, request)}  
    </body>
    </html>`;
}