/**
 * Location Service
 * Provides real city detection using browser Geolocation API and reverse geocoding
 */

const GEOCODING_API_KEY = import.meta.env.VITE_GEOCODING_API_KEY || '';

/**
 * Get user's current position using browser Geolocation API
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                }
                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
};

/**
 * Reverse geocode coordinates to get city and country
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<{city: string, country: string, state: string, fullLocation: string}>}
 */
export const reverseGeocode = async (latitude, longitude) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'PixelPlanet-EcoApp/1.0'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Geocoding service unavailable');
        }

        const data = await response.json();
        
        if (!data || !data.address) {
            throw new Error('Unable to determine location');
        }

        const address = data.address;
        const city = address.city || address.town || address.village || address.county || 'Unknown City';
        const state = address.state || address.region || '';
        const country = address.country || 'Unknown Country';
        
        // Create a readable full location string
        const fullLocation = state 
            ? `${city}, ${state}, ${country}`
            : `${city}, ${country}`;

        return {
            city,
            state,
            country,
            fullLocation
        };
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        throw error;
    }
};

/**
 * Get user's city and location information
 * @returns {Promise<{city: string, country: string, state: string, fullLocation: string, coordinates: {latitude: number, longitude: number}}>}
 */
export const getUserLocation = async () => {
    try {
        const coordinates = await getCurrentPosition();
        const locationInfo = await reverseGeocode(coordinates.latitude, coordinates.longitude);
        
        return {
            ...locationInfo,
            coordinates
        };
    } catch (error) {
        console.error('Error getting user location:', error);
        throw error;
    }
};

/**
 * Request location permission and get location
 * Shows user-friendly error messages
 * @returns {Promise<{city: string, country: string, state: string, fullLocation: string} | null>}
 */
export const requestLocationPermission = async () => {
    try {
        const location = await getUserLocation();
        return location;
    } catch (error) {
        console.error('Location permission error:', error);
        return null;
    }
};
