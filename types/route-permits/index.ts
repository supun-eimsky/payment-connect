export interface RoutePermit {
    id: string;
    company_id: string;
    route_id: string;
    permit_number: string;
    issued_date: string;
    expiry_date: string
    status: string

}
export interface RoutePermitFilters {
    status?: string,
    search?: string,
    route_id?: string,
    expiring_soon?: string,
    limit?: number,
    offset?: number,
    company_id?: string

}
export interface RoutePermitFormData {
    id: any;
    company_id: string;
    route_id: string;
    permit_number: string;
    issued_date: string;
    expiry_date: string
}
export interface RoutePermitProps {
    companyId: string;
    companyList: any[] | null;
    routList:any[]|[];
    initialData?: RoutePermitFormData | null;
    onSelectCompany: (data: any) => void;
    onSubmit: (data: RoutePermitFormData) => void;
    onCancel: () => void;
}
export interface RoutePermitTableProps {
    buses: RoutePermit[];
    onAdd: () => void;
    onEdit: (bus: RoutePermit) => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
}