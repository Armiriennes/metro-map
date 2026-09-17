import React, { useState } from 'react';
import { MapContainer, Pane, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Props } from '../../interfaces/Props';
import type { Coords } from '../../interfaces/Coords';
import linesData from '../../assets/json/lines.json';
import './Squaremap.css';

import { HudCoords } from './overlays/HUD/HudCoords.tsx';
import { Stations } from './overlays/Entities/Station.tsx';
import { Lines } from './overlays/Map/Lines.tsx';
import { MouseTracker } from './overlays/MouseTracker.tsx';
// import { Players } from "./overlays/Entities/Players.tsx";
import { MapBorder } from "./overlays/Map/WorldBorder.tsx";
import { Sidebar } from './overlays/HUD/Sidebar.tsx';

export const Squaremap: React.FC<Props> = ({ tileSize = 128 }) => {
    const mapUrl = import.meta.env.VITE_MAP_URL;
    const worldName = import.meta.env.VITE_WORLD_MAP_NAME;
    const maxRealZoom = 3;
    const maxLeafletZoom = 10;
    const [coords, setCoords] = useState<Coords | null>(null);

    // État pour stocker la station sélectionnée
    const [selectedStation, setSelectedStation] = useState<any | null>(null);

    return (
        <div className="map-wrapper" style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex' }}>
            {coords && <HudCoords coords={coords} />}
            <MapContainer
                crs={L.CRS.Simple}
                center={[0, 0]}
                zoom={maxRealZoom}
                minZoom={0}
                maxZoom={maxLeafletZoom}
                style={{ width: '100vw', height: '100vh', imageRendering: 'pixelated' }}
            >
                <MapBorder />
                <TileLayer
                    url={`${mapUrl}/tiles/${worldName}/{z}/{x}_{y}.png`}
                    tileSize={tileSize}
                    minZoom={0}
                    maxZoom={maxLeafletZoom}
                    maxNativeZoom={maxRealZoom}
                />

                <MouseTracker setCoords={setCoords} />
                <Stations onSelectStation={(station) => setSelectedStation(station)} />
                <Pane name="lines-base" style={{ zIndex: 400 }} />
                <Pane name="lines-shared" style={{ zIndex: 450 }} />
                <Lines lines={linesData} />
                {/*<Players />*/}
            </MapContainer>

            {/* Panneau latéral qui s'affiche en plus quand une station est cliquée */}
            {selectedStation && (
                <Sidebar
                    station={selectedStation}
                    onClose={() => setSelectedStation(null)}
                />
            )}
        </div>
    );
};