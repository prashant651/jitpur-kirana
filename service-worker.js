// Jitpur Kirana Service Worker v25
const CACHE_NAME = 'jitpur-kirana-cache-v25';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.js',
  '/favicon.svg',
  '/manifest.json',
  
  // App Core
  '/App.js',
  '/types.js',
  
  // Hooks
  '/hooks/usePersistentState.js',
  
  // Services
  '/services/bs-date-utils.js',
  '/services/mock-data.js',
  '/services/firebase.js',

  // Components
  '/components/AccountForm.js',
  '/components/AccountLedger.js',
  '/components/Accounts.js',
  '/components/CalendarView.js',
  '/components/CashBalanceSheet.js',
  '/components/ChequeCard.js',
  '/components/ChequeForm.js',
  '/components/ChequeManager.js',
  '/components/Contacts.js',
  '/components/Header.js',
  '/components/HisabAccountsLedger.js',
  '/components/HomeDashboard.js',
  '/components/Nav.js',
  '/components/Settings.js',
  '/components/StockManager.js',
  '/components/StockTable.js',
  '/components/TransactionForm.js',
  '/components/TransactionHistory.js',

  // External Resources
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js',
  
  'https://aistudiocdn.com/react@19.1.1/index.js',
  'https://aistudiocdn.com/react-dom@19.1.1/client.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).then(networkResponse => {
            if(!networkResponse || networkResponse.status !== 200) return networkResponse;
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
            return networkResponse;
        }).catch(() => {
          if (event.request.mode === 'navigate') return caches.match('/index.html');
        });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});