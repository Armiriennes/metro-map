import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import nodesData from '../../assets/nodes.json'
import linesData from '../../assets/lines.json'
import './Squaremap.css'

interface Props {
    tileSize?: number
}

interface Coords {
    x: number
    z: number
    chunkX: number
    chunkZ: number
}

// Minecraft X/Z TO Leaflet lat/lng
const minecraftToLatLng = (x: number, z: number): [number, number] => {
    const lng = x / 32
    const lat = -z / 32
    return [lat, lng]
}

// HUD COORDS TRACKER
const MouseTracker: React.FC<{ setCoords: (c: Coords) => void }> = ({ setCoords }) => {
    useMapEvents({
        mousemove(e) {
            const x = Math.floor(e.latlng.lng * 32)
            const z = -Math.floor(e.latlng.lat * 32)
            setCoords({
                x,
                z,
                chunkX: Math.floor(e.latlng.lng * 2),
                chunkZ: -Math.floor(e.latlng.lat * 2),
            })
        },
    })
    return null
}

export const SquareMap: React.FC<Props> = ({ tileSize = 128 }) => {
    const mapUrl = import.meta.env.VITE_MAP_URL!
    const worldName = import.meta.env.VITE_WORLD_MAP_NAME!
    const maxRealZoom = 3
    const maxLeafletZoom = 10

    const [coords, setCoords] = useState<Coords | null>(null)

    // zoom0
    const centerX = 0
    const centerY = 0

    const urlTemplate = `${mapUrl}/tiles/${worldName}/{z}/{x}_{y}.png`

    return (
        <div className="map-wrapper">
            <MapContainer
                crs={L.CRS.Simple}
                center={[centerY, centerX]}
                zoom={maxRealZoom}
                minZoom={0}
                maxZoom={maxLeafletZoom}
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

                {/* HUD COORDS */}
                <MouseTracker setCoords={setCoords} />

                {/* Nodes / Stations */}
                {nodesData.map((node) => (
                    <Marker
                        key={node.id}
                        position={minecraftToLatLng(node.x, node.z)}
                        icon={L.divIcon({
                            className: 'node-icon',
                            html: `<div style="
                                width:10px;
                                height:10px;
                                background:${'white'};
                                display:${node.isStation ? 0 : 'none'};                                
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

                {/* Lines */}
                {linesData.map((line) => {
                    const lineNodes = line.nodes
                        .map((id) => nodesData.find((n) => n.id === id))
                        .filter(Boolean) as typeof nodesData

                    const positions = lineNodes.map((n) => minecraftToLatLng(n.x, n.z))

                    return (
                        <Polyline
                            key={line.id}
                            positions={positions}
                            color={`#${line.hex ?? '000'}`}
                            weight={5}
                        />
                    )
                })}

            </MapContainer>

            {/* HUD */}
            {coords && (
                <div className="mc-coords">
                    <div>X: {coords.x}</div>
                    <div>Z: {coords.z}</div>
                    <div>
                        Chunk: {coords.chunkX} / {coords.chunkZ}
                    </div>
                </div>
            )}
        </div>
    )
}
