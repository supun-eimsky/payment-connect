export interface Devices {
    id?: any;
  //  company_id: string;
    device_code: string;
    serial_number: string;
    model: string;
    manufacturer: string
    imei: string,
    mac_address: string,
    purchase_date: string,
    warranty_expiry: string,
    firmware_version: string,
    status:string,
    organisation_id?:string|null

}

export interface DeviceFilters {
    status?: string,
    search?: string,
    device_code?: string,
    serial_number?: string,
    model?: string,
    limit?: number,
    offset?: number,
    company_id?: string
    organisation_id?: string

}


export interface DeviceTableProps {
    buses: Devices[];
    onAdd: () => void;
    onEdit: (bus: Devices) => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
}

export interface DeviceProps {
    companyId: string;
    companyList: any[] | null;
    organisationList: any[] | null;
    initialData?: Devices | null;
    onSelectCompany: (data: any) => void;
    onSubmit: (data: Devices) => void;
    onCancel: () => void;
}

export interface CreateCompanyAssignmentPayload {
  company_id: string;
  assignment_reason?:string;
  assigned_date?: string;

}