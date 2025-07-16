// ===============================================
// SERVICE WORKER FOR PWA OFFLINE FUNCTIONALITY
// ===============================================

const CACHE_NAME = 'mountain-goat-farm-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Resources to cache for offline functionality
const STATIC_RESOURCES = [
    '/',
    '/index.html',
    '/goat-records.html',
    '/health-records.html',
    '/breeding-records.html',
    '/financial-records.html',
    '/genealogy.html',
    '/qr-scanner.html',
    '/feed-schedule.html',
    '/styles.css',
    '/farm-records.css',
    '/genealogy.css',
    '/qr-scanner.css',
    '/script.js',
    '/farm-records.js',
    '/genealogy.js',
    '/qr-scanner.js',
    '/language-manager.js',
    '/offline.html',
    '/manifest.json',
    // External libraries
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://unpkg.com/@zxing/library@latest',
    'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching files');
                return cache.addAll(STATIC_RESOURCES);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Installation failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension requests
    if (event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Try to fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Cache successful responses
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Network failed, try to serve offline page for HTML requests
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match(OFFLINE_URL);
                        }
                        
                        // For other requests, try to find a cached version
                        return caches.match('/offline-fallback.json');
                    });
            })
    );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'farm-data-sync') {
        event.waitUntil(syncFarmData());
    }
});

// Push notifications for alerts
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'You have a new farm alert',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'view',
                title: 'View Details',
                icon: '/icons/view-icon.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/icons/dismiss-icon.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Mountain Goat Farm Alert', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked', event.action);
    
    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/health-records.html')
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Sync farm data when online
async function syncFarmData() {
    try {
        console.log('Service Worker: Syncing farm data...');
        
        // Get offline data from IndexedDB
        const offlineData = await getOfflineData();
        
        if (offlineData.length > 0) {
            // Send data to server
            const response = await fetch('/api/sync-farm-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(offlineData)
            });

            if (response.ok) {
                console.log('Service Worker: Data synced successfully');
                await clearOfflineData();
                
                // Notify all clients about successful sync
                const clients = await self.clients.matchAll();
                clients.forEach(client => {
                    client.postMessage({
                        type: 'SYNC_SUCCESS',
                        message: 'Farm data synced successfully'
                    });
                });
            }
        }
    } catch (error) {
        console.error('Service Worker: Sync failed', error);
    }
}

// Helper function to get offline data (placeholder for IndexedDB implementation)
async function getOfflineData() {
    // This would typically read from IndexedDB
    return JSON.parse(localStorage.getItem('offlineFarmData') || '[]');
}

// Helper function to clear offline data
async function clearOfflineData() {
    localStorage.removeItem('offlineFarmData');
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_DATA') {
        // Cache additional data
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.put(event.data.url, new Response(JSON.stringify(event.data.data)));
            });
    }
});

// Periodic background sync for health checks
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'health-check') {
        event.waitUntil(performHealthCheck());
    }
});

async function performHealthCheck() {
    try {
        // Check for overdue health records
        const healthData = JSON.parse(localStorage.getItem('healthRecords') || '[]');
        const today = new Date();
        
        const overdueChecks = healthData.filter(record => {
            const nextCheck = new Date(record.nextCheckDate);
            return nextCheck < today;
        });

        if (overdueChecks.length > 0) {
            // Show notification for overdue health checks
            self.registration.showNotification('Health Check Reminder', {
                body: `${overdueChecks.length} goat(s) need health check-ups`,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/health-badge.png',
                tag: 'health-reminder'
            });
        }
    } catch (error) {
        console.error('Service Worker: Health check failed', error);
    }
}
