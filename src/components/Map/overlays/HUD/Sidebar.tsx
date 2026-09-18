import React from 'react';
import linesData from '../../../../assets/json/lines.json';
import nodesData from '../../../../assets/json/nodes.json';
import './Sidebar.css';

interface SidebarProps {
    station: any;
    onClose: () => void;
}

const formatLineName = (line: { type: string; name: string }) => {
    if (line.type === 'LGV' || line.type === 'TGV') {
        return (line.name.replace(/([0-9]+)[a-zA-Z]/gi, '$1')).replace(/^LGV\s*/i, '');
    }
    if (line.type === 'Metro') {
        let num = line.name.replace(/^M\s*/i, '').trim();
        return num.replace(/\s*bis$/i, 'b');
    }
    if (line.type === 'RER') {
        return line.name.replace(/^RER\s*/i, '').trim();
    }
    return line.name;
};

const getLineTerminus = (line: any) => {
    if (!line || !line.nodes || line.nodes.length === 0) {
        return { start: '', end: '' };
    }

    const startNodeId = line.nodes.find((nodeId: number) => {
        const node = nodesData.find(n => n.id === nodeId);
        return node && node.isStation === 1;
    });

    const endNodeId = [...line.nodes].reverse().find((nodeId: number) => {
        const node = nodesData.find(n => n.id === nodeId);
        return node && node.isStation === 1;
    });

    const startStation = nodesData.find(n => n.id === startNodeId);
    const endStation = nodesData.find(n => n.id === endNodeId);

    return {
        start: startStation ? startStation.name : '',
        end: endStation ? endStation.name : ''
    };
};

export const Sidebar: React.FC<SidebarProps> = ({ station, onClose }) => {
    const connectedLines = station.lines
        ? station.lines
            .map((lineId: number) => linesData.find(line => line.id === lineId))
            .filter(Boolean)
        : [];

    const pedestrianNode = station.isPedestrianLinked === 1
        ? nodesData.find(node => node.id === station.PedestrianLinksToNode)
        : null;

    // Récupération des lignes de la station reliée à pied
    const pedestrianLines = pedestrianNode && pedestrianNode.lines
        ? pedestrianNode.lines
            .map((lineId: number) => linesData.find(line => line.id === lineId))
            .filter(Boolean)
        : [];

    // Helper pour générer les badges de ligne
    const renderLineBadge = (line: any) => {
        const isMetro = line.type === 'Metro';
        const isRER = line.type === 'RER';
        const isLGV = line.type === 'LGV' || line.type === 'TGV';
        const isFuniculaire = line.type === 'Funiculaire';
        const isTelecabine = line.type === 'Telecabine';

        return (
            <div className="line-badge-wrapper">
                {isMetro && (
                    <div className="metro-badge-container">
                        <div className="metro-icon-m">M</div>
                        <div
                            className="metro-line-pill"
                            style={{ backgroundColor: `#${line.hex}` }}
                        >
                            {formatLineName(line)}
                        </div>
                    </div>
                )}

                {isRER && (
                    <div className="rer-badge-container">
                        <div className="rer-icon-box">RER</div>
                        <div
                            className="rer-line-pill"
                            style={{ backgroundColor: `#${line.hex}` }}
                        >
                            {formatLineName(line)}
                        </div>
                    </div>
                )}

                {isLGV && (
                    <div className="lgv-badge-container">
                        <div className="lgv-icon-box">TGV</div>
                        <div className="lgv-diamond-badge">
                            <span>{formatLineName(line)}</span>
                        </div>
                    </div>
                )}

                {(isFuniculaire || isTelecabine) && (
                    <div className="cable-badge-container">
                        <div className="cable-icon-box">
                            {isFuniculaire ? '🚡' : '🚠'}
                        </div>
                        <div
                            className="cable-line-pill"
                            style={{ backgroundColor: `#${line.hex}` }}
                        >
                            {formatLineName(line)}
                        </div>
                    </div>
                )}

                {!isMetro && !isRER && !isLGV && !isFuniculaire && !isTelecabine && (
                    <div
                        className="line-badge"
                        style={{ backgroundColor: `#${line.hex}` }}
                    >
                        <span className="line-type">{line.type}</span>
                        <span className="line-name">{formatLineName(line)}</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside className="sidebar-panel">
            <button className="sidebar-close-btn" onClick={onClose}>✕</button>

            <div className="sidebar-header">
                <span className="sidebar-subtitle">Station de Transport</span>
                <h2 className="sidebar-title">{station.name}</h2>
                <div className="sidebar-coords">
                    <span>X: {station.x}</span>
                    <span>Z: {station.z}</span>
                </div>
            </div>

            <hr className="sidebar-divider" />

            <div className="sidebar-section">
                <h3>Lignes en correspondance</h3>
                <div className="lines-list">
                    {connectedLines.map((line: any) => {
                        const { start, end } = getLineTerminus(line);
                        const hasTermini = start && end;

                        return (
                            <div key={line.id} className="line-row">
                                {renderLineBadge(line)}

                                {hasTermini && (
                                    <div className="line-termini">
                                        <span className="termini-separator">|</span>
                                        <span className="termini-text">{start} <b>⇔</b> {end}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {pedestrianNode && (
                <div className="sidebar-section pedestrian-section">
                    <div className="pedestrian-header">
                        <span className="pedestrian-icon">🚶</span>
                        <div>
                            <span className="pedestrian-subtitle">CORRESPONDANCE PIÉTONNE</span>
                            <h3 className="pedestrian-station-name">{pedestrianNode.name}</h3>
                        </div>
                    </div>

                    {pedestrianLines.length > 0 && (
                        <div className="pedestrian-lines-container">
                            <span className="pedestrian-lines-label">Lignes accessibles :</span>
                            <div className="lines-list">
                                {pedestrianLines.map((line: any) => {
                                    const { start, end } = getLineTerminus(line);
                                    const hasTermini = start && end;

                                    return (
                                        <div key={line.id} className="line-row">
                                            {renderLineBadge(line)}
                                            {hasTermini && (
                                                <div className="line-termini">
                                                    <span className="termini-separator">|</span>
                                                    <span className="termini-text">{start} <b>⇔</b> {end}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </aside>
    );
};