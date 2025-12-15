import React, { useState, useRef } from 'react'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './Squaremap.css'

interface Props {
    tileSize?: number
}

const TILE_RANGES: Record<number, { minX: number; maxX: number; minY: number; maxY: number }> = {
    0: { minX: -2, maxX: 1, minY: -2, maxY: 1 },
    1: { minX: -4, maxX: 3, minY: -4, maxY: 3 },
    2: { minX: -8, maxX: 7, minY: -8, maxY: 7 },
    3: { minX: -16, maxX: 15, minY: -16, maxY: 15 },
}

function MouseTracker({
                          onMove,
                      }: {
    onMove: (e: L.LeafletMouseEvent) => void
}) {
    useMapEvents({
        mousemove(e) {
            onMove(e)
        },
    })

    return null
}

export const SquareMap: React.FC<Props> = ({ tileSize = 128 }) => {
    const mapUrl = import.meta.env.VITE_MAP_URL!
    const worldName = import.meta.env.VITE_WORLD_MAP_NAME!

    const maxRealZoom = 3
    const maxLeafletZoom = 10

    const [coords, setCoords] = useState<{
        x: number
        z: number
        chunkX: number
        chunkZ: number
    } | null>(null)

    const mapRef = useRef<L.Map | null>(null)

    // @ts-ignore
    const onMapCreated = (map: L.Map) => {
        mapRef.current = map

        map.on('mousemove', (e: L.LeafletMouseEvent) => {

            const x = Math.floor(e.latlng.lng)
            const z = Math.floor(e.latlng.lat)

            setCoords({
                x,
                z,
                chunkX: Math.floor(x / 16),
                chunkZ: Math.floor(z / 16),
            })
        })
    }

    // Centre zoom 0
    const zoom0 = TILE_RANGES[0]
    const centerX = ((zoom0.minX + zoom0.maxX + 1) / 2) * tileSize
    const centerY = ((zoom0.minY + zoom0.maxY + 1) / 2) * tileSize

    const urlTemplate = `${mapUrl}/tiles/${worldName}/{z}/{x}_{y}.png`

    return (
        <div className="map-wrapper">
            <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
                {coords && (
                    <div className="mc-coords">
                        <div>X: {coords.x}</div>
                        <div>Z: {coords.z}</div>
                        <div>
                            Chunk: {coords.chunkX} / {coords.chunkZ}
                        </div>
                    </div>
                )}

                <MapContainer
                    crs={L.CRS.Simple}
                    center={[centerY, centerX]}
                    zoom={maxRealZoom}
                    minZoom={0}
                    maxZoom={maxLeafletZoom}
                    style={{
                        width: '100%',
                        height: '100%',
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

                    <MouseTracker
                        onMove={(e) => {
                            const x = Math.floor(e.latlng.lng*32)
                            const z = -Math.floor(e.latlng.lat*32)
                            setCoords({
                                x,
                                z,
                                chunkX: Math.floor(e.latlng.lng*2),
                                chunkZ: -Math.floor(e.latlng.lat*2),
                            })
                        }}
                    />
                </MapContainer>
            </div>
        </div>
    )
}