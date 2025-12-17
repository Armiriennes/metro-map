import React from 'react';
import './HudCoords.css';
import type {Hud_Props} from "../../../../interfaces/Hud_Props.ts";

export const HudCoords: React.FC<Hud_Props> = ({ coords }) => {
    return (
        <div className="mc-coords">
            <div>X: {coords.x}</div>
            <div>Z: {coords.z}</div>
            <div>Chunk: {coords.chunkX} / {coords.chunkZ}</div>
        </div>
    );
};
