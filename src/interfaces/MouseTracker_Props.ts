import type {Coords} from "./Coords.ts";

export interface MouseTracker_Props {
    setCoords: (coords: Coords) => void;
}