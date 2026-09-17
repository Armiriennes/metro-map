import React from 'react';
import { Polyline } from 'react-leaflet';
import nodesData from '../../../../assets/json/nodes.json';
import { CoordsConverter } from '../../../../utils/Coords_Converter.ts';
import type {LinesProps} from "../../../../interfaces/Line_Props.ts";
import type {Segment} from "../../../../types/Segment.ts";
import type {Line} from "../../../../types/Line.ts";
import type {PathOptions} from "leaflet";

const getDashArray = (style ? : string): string | undefined => {
    switch (style) {
        case 'dashed':
            return '10 6';
        case 'dotted':
            return '2 9';
        default:
            return undefined;
    }
};

export const Lines: React.FC<LinesProps> = ({ lines }) => {
    const segments: Segment[] = [];

    lines.forEach(line => {
        for (let i = 0; i < line.nodes.length - 1; i++) {
            const aId = line.nodes[i];
            const bId = line.nodes[i + 1];

            const aNode = nodesData.find(n => n.id === aId)!;
            const bNode = nodesData.find(n => n.id === bId)!;

            const from = CoordsConverter.minecraftToLatLng(aNode.x, aNode.z);
            const to   = CoordsConverter.minecraftToLatLng(bNode.x, bNode.z);

            const key = aId < bId ? `${aId}-${bId}` : `${bId}-${aId}`;

            let seg = segments.find(s => s.key === key);
            if (!seg) {
                seg = { key, from, to, lines: [] };
                segments.push(seg);
            }

            seg.lines.push(line);
        }
    });

    const getNormalStyle = (line: Line): PathOptions => ({
        color: `#${line.hex}`,
        weight: line.thickness ?? 7,
        dashArray: getDashArray(line.style),
        lineCap: 'round' as const,
        lineJoin: 'round' as const,
    });

    const getSharedSegmentStyle = (
        line: Line,
        index: number,
        total: number
    ) => ({
        color: `#${line.hex}`,
        weight: (line.thickness ?? 7) + 1,
        dashArray: '10 17',
        dashOffset: `${index * (20 / total)}`,
        lineCap: 'square' as const,
        lineJoin: 'round' as const,
    });

    return (
        <>
            {segments.flatMap(seg => {
                if (seg.lines.length === 1) {
                    const line = seg.lines[0];
                    return (
                        <Polyline
                            key={`${seg.key}-${line.id}`}
                            positions={[seg.from, seg.to]}
                            pathOptions={getNormalStyle(line)}
                            pane="lines-base"
                        />
                    );
                }

                return seg.lines.map((line, index) => (
                    <Polyline
                        key={`${seg.key}-${line.id}`}
                        positions={[seg.from, seg.to]}
                        pathOptions={getSharedSegmentStyle(
                            line,
                            index,
                            seg.lines.length
                        )}
                        pane="lines-shared"
                    />
                ));
            })}
        </>
    );
};
