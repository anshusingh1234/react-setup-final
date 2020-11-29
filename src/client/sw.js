var DOMAIN_NAME = self.location.origin;
const url = new URL(location.href);
const debug = url.searchParams.has('debug');
const env = url.searchParams.get('env');
var API_CACHE = 'api-cache';
var RUNTIME_CACHE = 'runtime-cache';
var ASSETS_CACHE = 'assets-cache';

var cacheUrl = ['im.mainapp.in', ''];
if (workbox) {
	(function () {
		console.log(`Yay! Workbox is loaded 🎉 at`, DOMAIN_NAME);
		workbox.setConfig({debug: false});
		workbox.core.clientsClaim();

		self.__precacheManifest = [];
		self.__precacheManifest.unshift(
			{
			  url: "/",
			  revision: new Date().getTime(),
			},
			{
			  url: "/?mode=standalone&utm_source=pwa",
			  revision: new Date().getTime(),
			},
			{
			  url: "/favicon.ico",
			},
			{
				url:'/offline.html'
			},
			{
				url:'/images/mainapp-default.png'
			},
			{
				url:'/400.json'
			},
			{
				url:'/500.json'
			}
		);

		workbox.precaching.precacheAndRoute(self.__precacheManifest || [], {
			directoryIndex: null,
			cleanUrls: false,
		});

		workbox.routing.registerRoute(
			"/",
			new workbox.strategies.StaleWhileRevalidate({
				cacheName: ASSETS_CACHE,
				plugins: [
					new workbox.cacheableResponse.Plugin({
						statuses: [0, 200]
					}),
					new workbox.expiration.Plugin({
						maxEntries: 1,
						maxAgeSeconds: 30 * 24 * 60 * 60 // 30d
					})
				]
			})
		);

		workbox.routing.registerRoute(
			"/?mode=standalone&utm_source=pwa",
			new workbox.strategies.StaleWhileRevalidate({
				cacheName: ASSETS_CACHE,
				plugins: [
					new workbox.cacheableResponse.Plugin({
						statuses: [0, 200]
					}),
					new workbox.expiration.Plugin({
						maxEntries: 1,
						maxAgeSeconds: 30 * 24 * 60 * 60 // 30d
					})
				]
			})
		);
		
		workbox.routing.registerRoute(
			"/favicon.ico",
			new workbox.strategies.StaleWhileRevalidate({
				cacheName: ASSETS_CACHE,
				plugins: [
					new workbox.cacheableResponse.Plugin({
						statuses: [0, 200]
					}),
					new workbox.expiration.Plugin({
						maxEntries: 1,
						maxAgeSeconds: 30 * 24 * 60 * 60 // 30d
					})
				]
			})
		);

		workbox.routing.registerRoute(
			"/offline.html",
			new workbox.strategies.StaleWhileRevalidate({
				cacheName: ASSETS_CACHE,
				plugins: [
					new workbox.cacheableResponse.Plugin({
						statuses: [0, 200]
					}),
					new workbox.expiration.Plugin({
						maxEntries: 1,
						maxAgeSeconds: 30 * 24 * 60 * 60 // 30d
					})
				]
			})
		);

		workbox.routing.registerRoute(
			"/images/mainapp-default.png",
			new workbox.strategies.StaleWhileRevalidate({
				cacheName: ASSETS_CACHE,
				plugins: [
					new workbox.cacheableResponse.Plugin({
						statuses: [0, 200]
					}),
					new workbox.expiration.Plugin({
						maxEntries: 1,
						maxAgeSeconds: 30 * 24 * 60 * 60 // 30d
					})
				]
			})
		);

		workbox.routing.registerRoute(
			"/400.json",
			new workbox.strategies.StaleWhileRevalidate({
				cacheName: ASSETS_CACHE,
				plugins: [
					new workbox.cacheableResponse.Plugin({
						statuses: [0, 200]
					}),
					new workbox.expiration.Plugin({
						maxEntries: 1,
						maxAgeSeconds: 30 * 24 * 60 * 60 // 30d
					})
				]
			})
		);

		workbox.routing.registerRoute(
			"/500.json",
			new workbox.strategies.StaleWhileRevalidate({
				cacheName: ASSETS_CACHE,
				plugins: [
					new workbox.cacheableResponse.Plugin({
						statuses: [0, 200]
					}),
					new workbox.expiration.Plugin({
						maxEntries: 1,
						maxAgeSeconds: 30 * 24 * 60 * 60 // 30d
					})
				]
			})
		);
		
		/* API caching */
		var apiHandler = new workbox.strategies.StaleWhileRevalidate({
			cacheName: API_CACHE,
			plugins: [new workbox.expiration.Plugin({
				maxEntries: 100,
				maxAgeSeconds: 24 * 60 * 60 // 1day
			}), new workbox.cacheableResponse.Plugin({
				statuses: [200]
			})]
		});

		// workbox.routing.registerRoute(/(http|https):\/\/(frontend-api-navik.mainapp.com)(.*?)/, function (args) {
		// 	return apiHandler.handle(args).then(function (response) {
		// 		if (response.status > 400) {
		// 			return caches.match('400.json');
		// 		} else {
		// 			return response;
		// 		}
		// 	}).catch(function (ex) {
		// 		return caches.match('500.json');
		// 	});
    // }, 'GET');
    
    
		/* API caching */

		/* Static caching */
		workbox.routing.registerRoute(/^(https|http):\/\/((www|beta|staging)\.mainapp\.com|localhost:3003)\/.*\.(woff|woff2|png|jpg|jpeg|svg|gif|ico).*/, new workbox.strategies.CacheFirst({
			cacheName: ASSETS_CACHE,
			plugins: [new workbox.expiration.Plugin({
				maxEntries: 50,
				maxAgeSeconds: 30*24*60*60 // 30 days
			})]
		}), 'GET');

		workbox.routing.registerRoute(/^(https|http):\/\/((www|beta|staging)\.mainapp\.com|localhost:3003)\/.*\.(js|css).*/, new workbox.strategies.StaleWhileRevalidate({
			cacheName: ASSETS_CACHE,
			plugins: [new workbox.expiration.Plugin({
				maxEntries: 50,
				maxAgeSeconds: 30*24*60*60 // 30 days
			})]
		}), 'GET');
		/* Static caching */

		/* Home/Any Page which is open Url */
		workbox.routing.registerRoute(/^(https|http):\/\/(.*(?<!im|commentstg|comment|geoapi|jssocdn|jssostg)\.mainapp\.com|localhost:3003)\/.*/, function (args) {
			if(!cacheUrl.includes(args.url.hostname)){	
				return new workbox.strategies.StaleWhileRevalidate({
					cacheName: RUNTIME_CACHE,
					plugins: [new workbox.expiration.Plugin({
						maxEntries: 50,
						maxAgeSeconds:  30 * 60 // 30min
					}), new workbox.cacheableResponse.Plugin({
						statuses: [200]
					})]
				}).handle(args).then(function (response) {
					return response;
				});	
			}
		}, 'GET');

		/* Home/Any Page which is open Url */
		workbox.routing.setCatchHandler(({event}) => {
			switch (event.request.destination) {
				case 'document':
				case 'unknown':
					return caches.match(workbox.precaching.getCacheKeyForURL('/offline.html'));
					break;
				case 'image':
					return caches.match(workbox.precaching.getCacheKeyForURL('/images/mainapp-default.png'));
					break;
				default:
					/* Without fallback, just return an error response. */
					return Response.error();
			}
		});

		self.addEventListener('install', function (event) {
			return event.waitUntil(self.skipWaiting());
		});

		self.addEventListener('activate', function (event) {
			console.log('activating service worker');
			event.waitUntil(
				caches.keys().then(function (cacheNames) {
					return Promise.all(
						cacheNames.map(function (cacheName) {
							if (cacheName.indexOf('null') > -1 || cacheName.indexOf('desktop') > -1 || cacheName.indexOf('mobile') > -1) {
								console.log('Deleting out of date cache:', cacheName);
								return caches.delete(cacheName);
							}
						})
					);
				})
			);
			return event.waitUntil(self.clients.claim());
		});

		/* Enable Offline Google Analytics */
		workbox.googleAnalytics.initialize();

	})();
} else {
	console.log('Boo! Workbox didn\'t load 😬');
}