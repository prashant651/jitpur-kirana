// A simple service worker for caching the app shell to enable offline functionality.

const CACHE_NAME = 'jitpur-kirana-cache-v10'; // Bumped version to ensure new worker installs
const urlsToCache = [
  './',
  './index.html',
  './index.js',
  './favicon.svg',
  './manifest.json',
  
  // App Core
  './App.js',
  './types.js',
  
  // Hooks
  './hooks/usePersistentState.js',
  
  // Services
  './services/bs-date-utils.js',
  './services/geminiService.js',
  './services/mock-data.js',

  // Components
  './components/AccountForm.js',
  './components/AccountLedger.js',
  './components/Accounts.js',
  './components/AccountsView.js',
  './components/CalendarView.js',
  './components/CashBalanceSheet.js',
  './components/ChequeCard.js',
  './components/ChequeForm.js',
  './components/ChequeManager.js',
  './components/ContactBookView.js',
  './components/Contacts.js',
  './components/Dashboard.js',
  './components/DashboardView.js',
  './components/Header.js',
  './components/HisabAccountsLedger.js',
  './components/HomeDashboard.js',
  './components/IdeaCard.js', // This is the AccountCard
  './components/Loader.js',
  './components/Nav.js',
  './components/PlaceholderView.js',
  './components/Settings.js',
  './components/StockManager.js',
  './components/StockTable.js',
  './components/TransactionForm.js',
  './components/TransactionHistory.js',

  // External Resources
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  
  // CRITICAL: Use explicit, fully-resolved CDN URLs for robust caching
  'https://aistudiocdn.com/react@19.1.1/index.js',
  'https://aistudiocdn.com/react-dom@19.1.1/client.js',
  'https://aistudiocdn.com/@google/genai@1.19.0/index.js'
];

// Install event: open a cache and add the app shell files to it.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        // Use addAll with a catch to log errors for specific failed URLs
        return cache.addAll(urlsToCache).catch(error => {
            console.error('Failed to cache one or more URLs:', error);
        });
      })
      .then(() => self.skipWaiting()) // Force the waiting service worker to become the active service worker.
  );
});

// Fetch event: serve cached content when offline, with a fallback for SPA navigation.
self.addEventListener('fetch', event => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If we have a match in the cache, return it.
        if (response) {
          return response;
        }
        
        // Otherwise, fetch from the network.
        // And if successful, cache the new response for next time.
        return fetch(event.request).then(networkResponse => {
            // Check if we received a valid response
            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && !networkResponse.type.endsWith('cors')) {
                return networkResponse;
            }
            
            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
                .then(function(cache) {
                    cache.put(event.request, responseToCache);
                });

            return networkResponse;
        }).catch(() => {
          // If the network fails and it's a navigation request (e.g., loading a page),
          // return the main app shell page. This is crucial for SPAs.
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});


// Activate event: clean up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If a cache is not in our whitelist, delete it.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all pages under its scope immediately.
  );
});