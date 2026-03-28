import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { subscribeToNotifications } from '../notificationService';

export const PushNotificationButton = () => {
    const isSupported = typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>(
        isSupported ? Notification.permission : 'default'
    );

    useEffect(() => {
        if (isSupported && permission === 'granted') {
            setIsSubscribed(true);
        }
    }, [permission, isSupported]);

    const handleSubscribe = async () => {
        if (!isSupported) {
            alert('Push notifications are not supported on this browser. On iOS, please use "Add to Home Screen" to enable this feature.');
            return;
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result === 'granted') {
                const success = await subscribeToNotifications();
                if (success) setIsSubscribed(true);
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    };

    if (permission === 'denied') {
        return <Button disabled startIcon={<NotificationsIcon />}>Notifications Blocked</Button>;
    }

    if (isSubscribed) {
        return <Button disabled startIcon={<NotificationsIcon />} color="success">Notifications On</Button>;
    }

    return (
        <Button
            variant="contained"
            color="primary"
            startIcon={<NotificationsIcon />}
            onClick={handleSubscribe}
        >
            Enable Notifications
        </Button>
    );
};
