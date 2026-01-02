export interface Bus {
    id: string;
    company_id: string;
    registration_number: string;
    fleet_number: string;
    model: string;
    manufacturer: string;
    year_of_manufacture: number;
    seating_capacity: number;
    standing_capacity: number;
    status:string;
    created_at: string;
    updated_at: string;
    is_operational: boolean;
    is_in_maintenance: boolean;
    is_retired: boolean;
    is_decommissioned: boolean;
    total_capacity: number;
    age: number;
    device: any;
}

        export interface BusTableProps {
            buses: Bus[];
            onAdd: () => void;
            onEdit: (bus: Bus) => void;
            onDelete: (id: string) => void;
            onView: (id: string) => void;
            onfilter:()=>void;
        }

export interface BusFormData {
    id: any;
    company_id: string;
    registration_number: string;
    fleet_number: string;
    model: string;
    manufacturer: string;
    year_of_manufacture: number;
    seating_capacity: number;
    standing_capacity: number;
}

export interface BusFormProps {
    companyId: string;
    onfilter:any;
    companyList:any[]|null;
    initialData?: BusFormData | null;
    onSubmit: (data: BusFormData) => void;
    onCancel: () => void;
}
export interface BusFilters {
    status?: string,
    search?: string,
    min_year?: string,
    max_year?: string,
    limit?: number,
    offset?: number,
    company_id?: string
    organisation_id?: string

}
