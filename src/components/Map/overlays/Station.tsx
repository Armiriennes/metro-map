import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import nodesData from '../../../assets/nodes.json';

const minecraftToLatLng = (x: number, z: number): [number, number] => {
    return [-z / 32, x / 32];
};

export const Stations: React.FC = () => {
    return (
        <>
            {nodesData.map(node => (
                <Marker
                    key={node.id}
                    position={minecraftToLatLng(node.x, node.z)}
                    icon={L.divIcon({
                        className: 'node-icon',
                        html: `<div style="
                width:12px;
                height:12px;
                background:white;
                display:${node.isStation ? 'block' : 'none'};
                border-radius:50%;
                border:2px solid black;
            "></div>`,
                    })}
                >
                    {node.isStation && (
                        <Tooltip direction="top" offset={[0, -10]} opacity={0} permanent>
                            {node.name}
                        </Tooltip>
                    )}
                </Marker>
            ))}
        </>
    );
};
