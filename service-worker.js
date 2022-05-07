const APP_PREFIX = "BountifulBudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  "./public/index.html",
  "./public/css/style.css",
  "./public/models/transaction.js",
];

self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        
    )
})