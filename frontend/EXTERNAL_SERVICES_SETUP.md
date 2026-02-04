# External Services Setup Guide
**Date**: January 28, 2026  
**Purpose**: Configuration instructions for third-party integrations

---

## 1. Mailchimp Newsletter Integration

### Step 1: Create Mailchimp Account
1. Sign up at https://mailchimp.com/
2. Create a free account (up to 500 subscribers free)

### Step 2: Get API Key
1. Go to Account → Extras → API Keys
2. Create a new API key
3. Copy the key (format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1`)

### Step 3: Create Audience
1. Go to Audience → All contacts
2. Create a new audience for "Arohan Newsletter"
3. Note the Audience ID (found in Settings → Audience name and defaults)

### Step 4: Backend Integration
Create `backend/routes/newsletter.js`:
```javascript
const express = require('express');
const router = express.Router();
const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX // e.g., 'us1'
});

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  
  try {
    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
      email_address: email,
      status: 'subscribed'
    });
    
    res.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Mailchimp error:', error);
    res.status(500).json({ success: false, message: 'Subscription failed' });
  }
});

module.exports = router;
```

### Step 5: Environment Variables
Add to `.env`:
```
MAILCHIMP_API_KEY=your_api_key_here
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_AUDIENCE_ID=your_audience_id
```

### Step 6: Frontend Connection
Update `NewsletterSignup.jsx` line 21:
```javascript
const response = await fetch('/api/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
});
```

**Status**: ✅ UI Complete, Backend Placeholder Ready

---

## 2. Tidio Chat Widget

### Step 1: Sign Up
1. Go to https://www.tidio.com/
2. Create free account (50 conversations/month free)

### Step 2: Get Widget Code
1. Go to Settings → Install Widget
2. Copy the script tag (looks like):
```html
<script src="//code.tidio.co/xxxxxxxxxxxxxx.js" async></script>
```

### Step 3: Add to index.html
Add before closing `</body>` tag in `frontend/index.html`:
```html
  <!-- Tidio Chat Widget -->
  <script src="//code.tidio.co/YOUR_KEY_HERE.js" async></script>
</body>
```

### Step 4: Customize Widget
1. In Tidio dashboard, go to Appearance
2. Set colors to match Arohan brand (Primary: #DC2626)
3. Set greeting message: "Hi! Need help with Arohan? Ask us anything!"
4. Enable offline mode

**Estimated Time**: 10 minutes  
**Status**: Waiting for account creation

---

## 3. Firebase Push Notifications

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name: "Arohan Health"
4. Enable Google Analytics (optional)

### Step 2: Register Web App
1. In project, click "Web" icon (</>) 
2. App nickname: "Arohan Frontend"
3. Check "Also set up Firebase Hosting"
4. Copy Firebase config object

### Step 3: Add Config
Create `frontend/src/firebase-config.js`:
```javascript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "arohan-health.firebaseapp.com",
  projectId: "arohan-health",
  storageBucket: "arohan-health.appspot.com",
  messagingSenderId: "123456789",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
```

### Step 4: Generate VAPID Key
1. In Firebase console, go to Project Settings → Cloud Messaging
2. Under "Web Push certificates", click "Generate key pair"
3. Copy the VAPID key

### Step 5: Service Worker
Create `frontend/public/firebase-messaging-sw.js`:
```javascript
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  projectId: "arohan-health",
  messagingSenderId: "123456789",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

### Step 6: Request Permission
Add to component:
```javascript
import { messaging, getToken } from '../firebase-config';

const requestNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
    console.log('FCM Token:', token);
    // Send token to backend to save for user
  } catch (error) {
    console.error('Notification permission denied', error);
  }
};
```

**Estimated Time**: 30 minutes  
**Status**: Requires Firebase account

---

## 4. Cloudinary Image CDN

### Step 1: Sign Up
1. Go to https://cloudinary.com/
2. Create free account (25GB storage, 25GB bandwidth/month)

### Step 2: Get Credentials
1. Go to Dashboard
2. Note: Cloud Name, API Key, API Secret

### Step 3: Backend Integration
Install SDK:
```bash
npm install cloudinary
```

Create `backend/utils/cloudinary.js`:
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image
const uploadImage = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'arohan',
    transformation: [
      { width: 1200, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' } // Automatically serve WebP/AVIF
    ]
  });
  return result.secure_url;
};

module.exports = { uploadImage };
```

### Step 4: Frontend Usage
```jsx
// Instead of:
<img src="/images/product.jpg" alt="Product" />

// Use Cloudinary URL:
<img 
  src="https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_800,f_auto,q_auto/arohan/product.jpg"
  srcSet="
    https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_400,f_auto,q_auto/arohan/product.jpg 400w,
    https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_800,f_auto,q_auto/arohan/product.jpg 800w,
    https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_1200,f_auto,q_auto/arohan/product.jpg 1200w
  "
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Product"
/>
```

**Estimated Time**: 20 minutes  
**Status**: Requires Cloudinary account

---

## 5. Google Analytics 4 (Already Set Up)

### Current Status: ✅ Configured
- Tracking ID placeholder in `index.html`: `G-XXXXXXXXXX`
- Analytics initialized in `main.tsx`
- Event tracking helpers in `utils/eventTracking.js`

### Action Needed:
1. Create GA4 property at https://analytics.google.com/
2. Get Measurement ID (format: `G-XXXXXXXXXX`)
3. Replace placeholder in `frontend/index.html` line 39:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_REAL_ID"></script>
```
4. Update `frontend/src/utils/analytics.js` line 4:
```javascript
const GA_MEASUREMENT_ID = 'G-YOUR_REAL_ID';
```

**Estimated Time**: 5 minutes

---

## Summary

| Service | Purpose | Setup Time | Status |
|---------|---------|------------|--------|
| **Mailchimp** | Newsletter | 15 min | UI ready, needs API key |
| **Tidio** | Live chat | 10 min | Needs account + widget code |
| **Firebase** | Push notifications | 30 min | Needs project setup |
| **Cloudinary** | Image CDN | 20 min | Needs cloud name/API |
| **GA4** | Analytics | 5 min | Configured, needs real ID |

**Total Setup Time**: ~1.5 hours for all services

**Next Steps**:
1. Create accounts for each service
2. Add credentials to `.env` files
3. Test each integration 
4. Monitor dashboards for first week

---

**All code is ready to connect once you have the credentials!** 🚀
