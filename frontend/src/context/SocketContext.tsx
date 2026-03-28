import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Connect to backend URL (adjust if needed for prod vs dev)
        // For production, fallback to current origin to satisfy Safari's strict HTTPS policies
        const socketUrl = import.meta.env.VITE_API_URL || window.location.origin;

        // In production (docker), it might be relative if served from same origin
        // But for dev, we point to the API_URL
        const socketInstance = io(socketUrl, {
            withCredentials: true,
            transports: ['websocket', 'polling'], // Try websocket first
            reconnectionAttempts: 5,
        });

        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Socket connected:', socketInstance.id);
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        socketInstance.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setIsConnected(false);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
