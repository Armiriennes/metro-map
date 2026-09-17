import React from 'react';
import { Marker, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import nodesData from '../../../../assets/json/nodes.json';
import { CoordsConverter } from '../../../../utils/Coords_Converter.ts';
import './Station.css';

interface StationsProps {
    onSelectStation?: (station: any) => void;
}

export const Stations: React.FC<StationsProps> = ({ onSelectStation }) => {
    // Si on clique sur la carte (hors d'un marqueur), on ferme la Sidebar
    useMapEvent('click', () => {
        if (onSelectStation) {
            onSelectStation(null);
        }
    });

    return (
        <>
            {nodesData
                .filter(node => node.isStation === 1)
                .map(node => {
                    const position = CoordsConverter.minecraftToLatLng(node.x, node.z);
                    const icon = L.divIcon({
                        className: 'node-icon',
                        html: `
                            <div style="
                                width:15px !important;
                                height:15px !important;
                                background:white;
                                border-radius:50%;
                                border:2px solid black;
                                cursor:pointer;
                            "></div>
                        `,
                    });

                    return (
                        <Marker
                            key={node.id}
                            position={position}
                            icon={icon}
                            eventHandlers={{
                                click: (e) => {
                                    e.originalEvent.stopPropagation();
                                    // Déclenche l'ouverture du panneau latéral avec les données de la station
                                    if (onSelectStation) {
                                        onSelectStation(node);
                                    }
                                },
                            }}
                        />
                    );
                })}
        </>
    );
};