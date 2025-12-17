export class CoordsConverter {
    public static minecraftToLatLng(x: number, z: number): [number, number] {
        return [-z / 32, x / 32];
    }

    public static latLngToMinecraft(lat: number, lng: number): [number, number] {
        const x = lng * 32;
        const z = -lat * 32;
        return [x, z];
    }
}
