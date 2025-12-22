export interface Station {
    id: number;
    name: string | undefined;
    x: number;
    z: number;
    isStation: number;
    lines: number[];
    lat: number;
    lng: number;
    isPedestrianLinked: number | undefined;
}