import React from 'react';
import type {SidebarProps} from "../interfaces/SidebarProps.ts";

const Sidebar: React.FC<SidebarProps> = ({ station, onClose }) => {
    return (
        <div
            className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ${
                station ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold">Station Info</h2>
                <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    ✕
                </button>
            </div>

            {station ? (
                <div className="p-4 space-y-2">
                    <p><strong>Nom:</strong> {station.name}</p>
                    <p><strong>X:</strong> {station.x}</p>
                    <p><strong>Z:</strong> {station.z}</p>
                    <p><strong>Lat:</strong> {station.lat.toFixed(5)}</p>
                    <p><strong>Lng:</strong> {station.lng.toFixed(5)}</p>
                </div>
            ) : (
                <div className="p-4">Cliquez sur une station pour voir les détails</div>
            )}
        </div>
    );
};

export default Sidebar;
