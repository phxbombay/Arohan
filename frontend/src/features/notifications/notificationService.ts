export const subscribeToNotifications = async () => {
    try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            throw new Error('Push notifications not supported');
        }

        const registration = await navigator.serviceWorker.ready;

        // Get VAPID key from backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications/vapid-key`);
        const { publicKey } = await response.json();

        // Subscribe
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey)
        });

        // Send subscription to backend
        await fetch(`${import.meta.env.VITE_API_URL}/notifications/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add Auth header if needed, usually managed by axios interceptor but here we use fetch for pure SW logic or integration
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ subscription })
        });

        console.log('Registered for push notifications');
        return true;
    } catch (error) {
        console.error('Failed to subscribe to notifications:', error);
        return false;
    }
};

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
