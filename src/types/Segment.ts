import type {Line} from "./Line.ts";

export type Segment = {
    key: string;
    from: [number, number];
    to: [number, number];
    lines: Line[];
};