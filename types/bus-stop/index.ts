export interface BusStopFormData {
    id: any;

    stop_code: string;
    stop_name_en: string;
    stop_name_si: string;
    stop_name_tm: string;
    latitude: number;
    longitude: number;
}

export interface BusStopFormProps {
    companyId: string;
    initialData?: BusStopFormData | null;
    onSubmit: (data: BusStopFormData) => void;
    onCancel: () => void;
}
export interface BusStops {
    id: string;
    stop_code: string;
    stop_name_en: string;
    stop_name_si: string;
    stop_name_tm: string;
    latitude: number;
    longitude: number;
    status: string
}
export interface BusStopFilters {
    status?: string,
    search?: string,
    stop_code?:string,
    stop_name_en?: string,
    limit?: number,
    offset?: number,

}

export interface BusStopTableProps {
    buses: BusStops[];
    onAdd: () => void;
    onEdit: (bus: BusStops) => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
}