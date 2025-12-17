import React from 'react';
import { Polyline } from 'react-leaflet';
import { CoordsConverter } from '../../../../utils/Coords_Converter.ts';

export const MapBorder: React.FC = () => {
    const corners: [number, number][] = [
        CoordsConverter.minecraftToLatLng(8000, 8000),
        CoordsConverter.minecraftToLatLng(8000, -8000),
        CoordsConverter.minecraftToLatLng(-8000, -8000),
        CoordsConverter.minecraftToLatLng(-8000, 8000),
        CoordsConverter.minecraftToLatLng(8000, 8000), // pour fermer la ligne
    ];

    return <Polyline positions={corners} pathOptions={{ color: 'pink', weight: 3 }} />;
};
