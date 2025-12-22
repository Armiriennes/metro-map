import React, { useState } from 'react';
import { Marker, Tooltip, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import nodesData from '../../../../assets/json/nodes.json';
import { CoordsConverter } from '../../../../utils/Coords_Converter.ts';
import './Station.css'

export const Stations: React.FC = () => {
    const [openStationId, setOpenStationId] = useState<number | null>(null);

    useMapEvent('click', () => {
        setOpenStationId(null);
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
                            "></div>
                        `,
                    });

                    const isOpen = openStationId === node.id;

                    return (
                        <Marker
                            key={node.id}
                            position={position}
                            icon={icon}
                            eventHandlers={{
                                click: (e) => {
                                    e.originalEvent.stopPropagation();
                                    setOpenStationId(isOpen ? null : node.id);
                                },
                            }}
                        >
                            {isOpen && (
                                <Tooltip
                                    direction="top"
                                    offset={[0, -10]}
                                    opacity={1}
                                    permanent
                                    className={`tooltip-fade ${isOpen ? 'show' : ''}`}
                                >
                                    {node.name}
                                </Tooltip>
                            )}
                        </Marker>
                    );
                })}
        </>
    );
};
