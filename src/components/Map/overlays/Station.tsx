import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import nodesData from '../../../assets/nodes.json';

// Minecraft to Leaflet
const minecraftToLatLng = (x: number, z: number): [number, number] => [-z / 32, x / 32];

export const Stations: React.FC = () => {
    return (
        <>
            {nodesData
                .filter(node => node.isStation === 1) // ne garder que les stations
                .map(node => (
                    <Marker
                        key={node.id}
                        position={minecraftToLatLng(node.x, node.z)}
                        icon={L.divIcon({
                            className: 'node-icon',
                            html: `<div style="
                                width:12px;
                                height:12px;
                                background:white;
                                border-radius:50%;
                                border:2px solid black;
                                display:block;
                            "></div>`,
                        })}
                    >
                        <Tooltip direction="top" offset={[0, -10]} opacity={0} permanent>
                            {node.name}
                        </Tooltip>
                    </Marker>
                ))}
        </>
    );
};
