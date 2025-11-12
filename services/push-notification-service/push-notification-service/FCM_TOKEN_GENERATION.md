# FCM Token Generation Guide

## Important Note

**FCM tokens CANNOT be generated server-side in Python.** They MUST be generated client-side in the browser because:
- They require browser APIs (Service Worker, Notification API)
- They need user permission for notifications
- They are tied to the specific browser/device instance
- They require the Firebase SDK to be initialized in the browser

## Solution: Dynamic Configuration Endpoints

While we can't generate tokens server-side, we've created endpoints that:
1. **Provide Firebase configuration dynamically** - No hardcoding needed
2. **Accept and store tokens** - Once generated client-side
3. **Provide instructions** - Step-by-step guide for token generation

## API Endpoints

### 1. Get Firebase Configuration
```http
GET /api/fcm/config
```

**Response:**
```json
{
  "success": true,
  "message": "Firebase configuration retrieved successfully",
  "data": {
    "apiKey": "AIzaSyAhjO0QwwuwnySLBYzGPgPfgPCVpIg-lGg",
    "authDomain": "mindful-torus-458106-p9.firebaseapp.com",
    "projectId": "mindful-torus-458106-p9",
    "storageBucket": "mindful-torus-458106-p9.firebasestorage.app",
    "messagingSenderId": "1073235646116",
    "appId": "1:1073235646116:web:7df2d8ca4d1a3c23fd7831",
    "vapidKey": "BHL99TXdSPLmvxRkimYNKoLsjBIMe3TYNb3RPnGEe1M-7e8msvm7n2IVtU48mvDdJ0CO9MpcHBX_PgZYgYsHvL8"
  }
}
```

### 2. Get Token Generation Instructions
```http
POST /api/fcm/generate-token
Content-Type: application/json

{
  "user_id": "user123",
  "device_type": "web",
  "platform": "chrome"
}
```

**Response:** Returns Firebase config + step-by-step instructions

### 3. Store Generated Token
```http
POST /api/device-tokens
Content-Type: application/json

{
  "user_id": "user123",
  "token": "fcm_token_generated_in_browser",
  "device_type": "web",
  "platform": "chrome"
}
```

## Complete Client-Side Flow

### JavaScript Example

```javascript
// Step 1: Get Firebase config from your API
const configResponse = await fetch('/api/fcm/config');
const { data: firebaseConfig } = await configResponse.json();

// Step 2: Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-messaging.js';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Step 3: Register service worker (for web)
if ('serviceWorker' in navigator) {
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  
  // Step 4: Request notification permission
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    // Step 5: Generate FCM token
    const token = await getToken(messaging, {
      vapidKey: firebaseConfig.vapidKey,
      serviceWorkerRegistration: registration
    });
    
    console.log('FCM Token:', token);
    
    // Step 6: Send token to your backend
    await fetch('/api/device-tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'user123',
        token: token,
        device_type: 'web',
        platform: 'chrome'
      })
    });
    
    console.log('Token stored successfully!');
  }
}
```

### Python Client Example (for mobile apps)

```python
import requests

# Step 1: Get Firebase config
response = requests.get('http://your-api/api/fcm/config')
config = response.json()['data']

# Step 2: Use Firebase Admin SDK or mobile SDK to generate token
# (This is done in the mobile app, not in Python backend)
# The mobile app will generate the token and send it back

# Step 3: Store the token when received from mobile app
token_data = {
    "user_id": "user123",
    "token": "token_from_mobile_app",
    "device_type": "mobile",
    "platform": "ios"  # or "android"
}

response = requests.post('http://your-api/api/device-tokens', json=token_data)
print(response.json())
```

## Why Server-Side Generation is Impossible

1. **Browser APIs Required**: FCM tokens require:
   - Service Worker API (for web)
   - Notification API
   - Browser-specific storage

2. **User Permission**: Must request notification permission from the user

3. **Device-Specific**: Each browser/device gets a unique token

4. **Firebase SDK**: Must run in the browser environment

## Alternative: Mobile App Token Generation

For mobile apps (iOS/Android):
- Use Firebase SDK in the native app
- Generate token in the app
- Send token to your Python backend via `POST /api/device-tokens`

## Configuration Management

All Firebase configuration is stored in `app/config.py` and can be:
- Set via environment variables
- Changed in `.env` file
- Retrieved dynamically via `/api/fcm/config`

This allows you to:
- Change config without code changes
- Support multiple environments
- Keep sensitive keys in environment variables

