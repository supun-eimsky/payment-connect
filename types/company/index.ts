export interface CompanyFilters {
    status?: string,
    city?: string,
    province?: string,
    search?: string,
    limit?: number,
    offset?: number,
    organisation_id?: string|null

}
export interface Company {
    id: any;
    organisation_id: string | null;
    name: string;
    registration_number: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    status?: string
}
export interface CompanyTableProps {
    companies: Company[];
    onAdd: () => void;
    onEdit: (bus: Company) => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
}
export interface CompanyFormProps {
    organisation_id: string|null;
    initialData?: Company | null;
    organisations?:any[];
    onSubmit: (data: Company) => void;
    onCancel: () => void;
}