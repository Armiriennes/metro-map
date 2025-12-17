import React from 'react';
import { Polyline } from 'react-leaflet';
import type { Line } from '../../../../types/Line.ts';
import nodesData from '../../../../assets/json/nodes.json';
import { CoordsConverter } from '../../../../utils/Coords_Converter.ts';
import type {LinesProps} from "../../../../interfaces/Line_Props.ts";

const getDashArray = (style?: string): string | undefined => {
    switch (style) {
        case 'dashed': return '10 6';
        case 'dotted': return '2 6';
        default: return undefined;
    }
};

export const Lines: React.FC<LinesProps> = ({ lines }) => {
    // segment map for offsetting multiple lines
    const segmentMap = new Map<string, Line[]>();
    lines.forEach(line => {
        for (let i = 0; i < line.nodes.length - 1; i++) {
            const a = line.nodes[i], b = line.nodes[i + 1];
            const key = a < b ? `${a}-${b}` : `${b}-${a}`;
            if (!segmentMap.has(key)) segmentMap.set(key, []);
            segmentMap.get(key)!.push(line);
        }
    });

    //Thank you Anima for the maths <3
    const buildOffsetPositions = (line: Line, offsetScaleFactor = 0): [number, number][] => {
        const result: [number, number][] = [];
        for (let i = 0; i < line.nodes.length; i++) {
            const node = nodesData.find(n => n.id === line.nodes[i])!;
            const base = CoordsConverter.minecraftToLatLng(node.x, node.z);

            if (i === 0) {
                result.push(base);
                continue;
            }

            const prevId = line.nodes[i - 1];
            const currId = line.nodes[i];
            const key = prevId < currId ? `${prevId}-${currId}` : `${currId}-${prevId}`;
            const linesOnSegment = segmentMap.get(key) ?? [];
            const index = linesOnSegment.findIndex(l => l.id === line.id);
            const offsetScale = (line.thickness ?? 5) * offsetScaleFactor;
            const offset = linesOnSegment.length > 1
                ? (index - (linesOnSegment.length - 1) / 2) * offsetScale
                : 0;

            const [lat1, lng1] = result[result.length - 1];
            const [lat2, lng2] = base;
            const dx = lng2 - lng1;
            const dy = lat2 - lat1;
            const len = Math.sqrt(dx*dx + dy*dy) || 1;
            const ox = (-dy / len) * offset;
            const oy = (dx / len) * offset;

            result.push([lat2 + oy, lng2 + ox]);
        }
        return result;
    };

    return (
        <>
            {lines.map(line => (
                <Polyline
                    key={line.id}
                    positions={buildOffsetPositions(line)}
                    pathOptions={{
                        color: `#${line.hex}`,
                        weight: line.thickness ?? 5,
                        dashArray: getDashArray(line.style),
                        lineCap: 'round',
                        lineJoin: 'round'
                    }}
                />
            ))}
        </>
    );
};
