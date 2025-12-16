import React from 'react';
import type { Coords } from '../../../interfaces/Coords';
import './HUD_Coords.css';

interface HUDProps {
    coords: Coords;
}

export const HUD_Coords: React.FC<HUDProps> = ({ coords }) => {
    return (
        <div className="mc-coords">
            <div>X: {coords.x}</div>
            <div>Z: {coords.z}</div>
            <div>Chunk: {coords.chunkX} / {coords.chunkZ}</div>
        </div>
    );
};
