import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { subscribeToNotifications } from '../notificationService';

export const PushNotificationButton = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [permission, setPermission] = useState(Notification.permission);

    useEffect(() => {
        if (permission === 'granted') {
            setIsSubscribed(true);
        }
    }, [permission]);

    const handleSubscribe = async () => {
        const result = await Notification.requestPermission();
        setPermission(result);

        if (result === 'granted') {
            const success = await subscribeToNotifications();
            if (success) setIsSubscribed(true);
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
