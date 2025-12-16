import { useMapEvents } from 'react-leaflet';
import type { Coords } from '../../../interfaces/Coords';
import React from 'react';

interface MouseTrackerProps {
    setCoords: (coords: Coords) => void;
}

export const MouseTracker: React.FC<MouseTrackerProps> = ({ setCoords }) => {
    useMapEvents({
        mousemove(e) {
            const x = Math.floor(e.latlng.lng * 32);
            const z = -Math.floor(e.latlng.lat * 32);
            setCoords({
                x,
                z,
                chunkX: Math.floor(e.latlng.lng * 2),
                chunkZ: -Math.floor(e.latlng.lat * 2),
            });
        },
    });

    return null;
};
