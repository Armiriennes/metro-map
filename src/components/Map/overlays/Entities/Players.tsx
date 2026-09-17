import React, { useEffect, useState } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import type {Player} from "../../../../interfaces/Players.ts";
import type {PlayersData} from "../../../../interfaces/PlayersData.ts";
import { CoordsConverter } from '../../../../utils/Coords_Converter.ts';
const baseUrl = import.meta.env.VITE_MAP_URL;

export const Players: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/players`);
                const data: PlayersData = await res.json();
                setPlayers(data.players.filter(p => p.world === 'minecraft_overworld'));
            } catch (err) {
                console.error('Erreur fetch players:', err);
            }
        };
        fetchPlayers().then();
        const interval = setInterval(fetchPlayers, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {players.map(player => {
                const [lat, lng] = CoordsConverter.minecraftToLatLng(player.x, player.z);

                const icon = L.divIcon({
                    className: 'player-icon',
                    html: `
                              <div style="position: relative; width: 50px; height: 50px;">
                                <img src="https://mc-heads.net/avatar/${player.uuid}"
                                     alt="${player.name}'s skins" 
                                     style="
                                       width: 16px; 
                                       height: 16px; 
                                       position: absolute; 
                                       top: 50%; 
                                       left: 50%;
                                       z-index: 2;
                                     " />
                              </div>
                            `,
                    iconSize: [50, 50],
                    iconAnchor: [25, 25], //center on one block
                });

                return (
                    <Marker
                        key={player.uuid}
                        position={[lat, lng]}
                        icon={icon}
                    >
                        <Tooltip direction="top" offset={[8, 0]} permanent>
                            <div>
                                <strong>{player.name}</strong>
                                <div>❤️ {player.health/2}</div>
                            </div>
                        </Tooltip>
                    </Marker>
                );
            })}
        </>
    );
};