import { Bus } from "../bus-management";

export interface UserFilters {
    status?: string,
    search?: string,
    user_type?: string,
    organisation_id?: string | null,
    limit?: number,
    offset?: number,
    company_id?: string | null,
    email_verified?: string,
    phone_verified?: string,
}
export interface User {
    user_type?: string,
    email?: string,
    username?: string,
    phone?: string,
    password?: string,
    first_name?: string,
    last_name?: string,
    national_id?: string,
    organisation_id?: string | null,
    license_number?: string | null,
    company_id?: string | null
    id?: any,
    status?: string | null,
    full_name?: string,
    email_verified?: boolean,



}
export interface UserFormProps {
    companyId: string;
    OrganisationId: string | null;
    initialData?: User | null;
    onSubmit: (data: User) => void;
    onCancel: () => void;
}
export interface UserTableProps {
    users: User[];
    onAdd: () => void;
    onEdit: (bus: User) => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
}
export interface CreateCrewAssignment {
    id?: any;
    bus_id: string;
    user_id: string;
    assigned_date: string;
    removed_date?: string;
    status: string;
}