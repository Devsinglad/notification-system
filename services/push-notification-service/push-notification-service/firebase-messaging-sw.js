importScripts('https://www.gstatic.com/firebasejs/12.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.5.0/firebase-messaging-compat.js');

// ✅ Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAhjO0QwwuwnySLBYzGPgPfgPCVpIg-lGg",
  authDomain: "mindful-torus-458106-p9.firebaseapp.com",
  projectId: "mindful-torus-458106-p9",
  storageBucket: "mindful-torus-458106-p9.firebasestorage.app",
  messagingSenderId: "1073235646116",
  appId: "1:1073235646116:web:7df2d8ca4d1a3c23fd7831"
});

const messaging = firebase.messaging();

// ✅ Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.image || '/icon.png',
    data: {
      click_action: payload.fcmOptions?.link || payload.notification?.link || payload.data?.link || 'https://google.com', // fallback
    }
  };

  
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// ✅ Handle notification click
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click:', event.notification.data);

  event.notification.close(); // Close the notification popup

  const targetUrl = event.notification.data?.click_action || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If the link is already open, focus it
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open it in a new tab
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
