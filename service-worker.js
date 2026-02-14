// A simple service worker for caching the app shell to enable offline functionality.

const CACHE_NAME = 'jitpur-kirana-cache-v15'; // Bumped version to force updates
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
  './components/IdeaCard.js', 
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(urlsToCache).catch(error => {
            console.error('Failed to cache one or more URLs:', error);
        });
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(networkResponse => {
            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && !networkResponse.type.endsWith('cors')) {
                return networkResponse;
            }
            
            var responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)