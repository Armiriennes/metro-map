import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
    tileSize?: number;
}


const TILE_RANGES: Record<number, { minX: number; maxX: number; minY: number; maxY: number }> = {
    // min = -(2^(n+1)) | max = (2^(n+1))-1
    0: { minX: -2, maxX: 1, minY: -2, maxY: 1 },
    1: { minX: -4, maxX: 3, minY: -4, maxY: 3 },
    2: { minX: -8, maxX: 7, minY: -8, maxY: 7 },
    3: { minX: -16, maxX: 15, minY: -16, maxY: 15 },
};

export const SquareMap: React.FC<Props> = ({ tileSize = 128 }) => {
    const mapUrl = import.meta.env.VITE_MAP_URL!;
    const worldName = import.meta.env.VITE_WORLD_MAP_NAME!;

    const maxRealZoom = 3;
    const maxLeafletZoom = 10;

    // center 0-0
    const bounds: [[number, number], [number, number]] = [
        [TILE_RANGES[maxRealZoom].minY * tileSize, TILE_RANGES[maxRealZoom].minX * tileSize],
        [TILE_RANGES[maxRealZoom].maxY * tileSize, TILE_RANGES[maxRealZoom].maxX * tileSize],
    ];

    const urlTemplate = `${mapUrl}/tiles/${worldName}/{z}/{x}_{y}.png`;

    return (
        <MapContainer
            crs={L.CRS.Simple}
            bounds={bounds}
            minZoom={0}
            maxZoom={maxLeafletZoom}
            zoom={maxRealZoom}
            style={{
                width: '100vw',
                height: '100vh',
                imageRendering: 'pixelated',
            }}
        >
            <TileLayer
                url={urlTemplate}
                tileSize={tileSize}
                minZoom={0}
                maxZoom={maxLeafletZoom}
                maxNativeZoom={maxRealZoom}
            />
        </MapContainer>
    );
};
