export interface OrganisationFilters {
    status?: string,
    city?: string,
    province?: string,
    search?: string,
    limit?: number,
    offset?: number,
    organisation_id?: string | null

}
export interface Organisation {
    id: any;
    name: string,
    code: string,
    registration_number: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    province: string,
    status?: string
}
export interface OrganisationTableProps {
    organisations: Organisation[];
    onAdd: () => void;
    onEdit: (organisation: Organisation) => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
}
export interface OrganisationFormProps {
    organisation_id: string|null;
    initialData?: Organisation | null;
    onSubmit: (data: Organisation) => void;
    onCancel: () => void;
}