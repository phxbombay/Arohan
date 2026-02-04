import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState({
        coordinates: null, // { lat, lng }
        address: null,     // string (e.g., "Bengaluru, Karnataka")
        loading: true,
        error: null
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation(prev => ({ ...prev, loading: false, error: "Geolocation not supported" }));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Reverse Geocoding using OpenStreetMap Nominatim
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    // Extract city/area from address
                    const addressObj = data.address;
                    const city = addressObj.city || addressObj.town || addressObj.village || addressObj.county || "Unknown Location";
                    const state = addressObj.state;
                    const formattedAddress = state ? `${city}, ${state}` : city;

                    setLocation({
                        coordinates: { lat: latitude, lng: longitude },
                        address: formattedAddress,
                        loading: false,
                        error: null
                    });
                } catch (err) {
                    console.error("Geocoding error:", err);
                    setLocation({
                        coordinates: { lat: latitude, lng: longitude },
                        address: "Location Detected", // Fallback
                        loading: false,
                        error: null
                    });
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                let errorMessage = "Location permission denied";
                if (error.code === 2) errorMessage = "Location unavailable";
                if (error.code === 3) errorMessage = "Location request timed out";

                setLocation(prev => ({ ...prev, loading: false, error: errorMessage }));
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, []);

    const searchLocation = async (query) => {
        if (!query) return;

        setLocation(prev => ({ ...prev, loading: true }));

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const displayNameParts = display_name.split(',');
                const formattedAddress = displayNameParts.slice(0, 2).join(',').trim(); // City, State

                setLocation({
                    coordinates: { lat: parseFloat(lat), lng: parseFloat(lon) },
                    address: formattedAddress,
                    loading: false,
                    error: null
                });
            } else {
                throw new Error("Location not found");
            }
        } catch (err) {
            console.error("Search location error:", err);
            setLocation(prev => ({
                ...prev,
                loading: false,
                error: "Location not found. Please try again."
            }));
        }
    };

    return (
        <LocationContext.Provider value={{ ...location, searchLocation }}>
            {children}
        </LocationContext.Provider>
    );
};
