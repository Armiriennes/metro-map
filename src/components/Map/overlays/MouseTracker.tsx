import { useMapEvents } from 'react-leaflet';
import React from 'react';
import type {MouseTracker_Props} from "../../../interfaces/MouseTracker_Props.ts";

export const MouseTracker: React.FC<MouseTracker_Props> = ({ setCoords }) => {
    useMapEvents({
        mousemove(e) {
            const x = Math.floor(e.latlng.lng * 32);
            const z = -Math.floor(e.latlng.lat * 32); // south is negative on mc
            setCoords({
                x,
                z,
                chunkX: Math.floor(e.latlng.lng * 2),
                chunkZ: -Math.floor(e.latlng.lat * 2), // south is negative on mc
            });
        },
    });

    return null;
};
