import type {Station} from "./Station.ts";

export interface SidebarProps {
    station: Station | null;
    onClose: () => void;
}