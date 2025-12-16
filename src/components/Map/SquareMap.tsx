import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Props } from '../../interfaces/Props';
import type { Coords } from '../../interfaces/Coords';
import linesData from '../../assets/lines.json';
import './Squaremap.css';

import { HUD_Coords } from './overlays/HUD_Coords.tsx';
import { Stations } from './overlays/Station.tsx';
import { Lines } from './overlays/Lines.tsx';
import { MouseTracker } from "./overlays/MouseTracker.tsx";

export const SquareMap: React.FC<Props> = ({ tileSize = 128 }) => {
    const mapUrl = import.meta.env.VITE_MAP_URL!;
    const worldName = import.meta.env.VITE_WORLD_MAP_NAME!;
    const maxRealZoom = 3;
    const maxLeafletZoom = 10;
    const [coords, setCoords] = useState<Coords | null>(null);

    return (
        <div className="map-wrapper">
            {coords && <HUD_Coords coords={coords} />}
            <MapContainer
                crs={L.CRS.Simple}
                center={[0, 0]}
                zoom={maxRealZoom}
                minZoom={0}
                maxZoom={maxLeafletZoom}
                style={{ width: '100vw', height: '100vh', imageRendering: 'pixelated' }}
            >
                <TileLayer
                    url={`${mapUrl}/tiles/${worldName}/{z}/{x}_{y}.png`}
                    tileSize={tileSize}
                    minZoom={0}
                    maxZoom={maxLeafletZoom}
                    maxNativeZoom={maxRealZoom}
                />

                <MouseTracker setCoords={setCoords} />
                <Stations />
                <Lines lines={linesData} />
            </MapContainer>

        </div>
    );
};