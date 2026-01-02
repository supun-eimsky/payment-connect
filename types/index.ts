export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  user_type: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  national_id?: string;
  license_number?: string;
  organisation_id?:string;

}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface DashboardStats {
  totalBookings: number;
  activeBuses: number;
  totalRevenue: number;
  todayBookings: number;
}
export interface Ticket {
  id: string;
  session_id: string;
  ticket_number: string;
  boarding_stop_id: string;
  alighting_stop_id: string;
  ticket_type: string;
  fare_amount: number;
  payment_method: string;
  issued_at: string;
  status: string;
  created_at: string;
  route_id: string;
  route_code: string;
  route_name: string;
  direction_id: string;
  direction_start_location: string;
  direction_end_location: string;
  boarding_stop_name: string;
  alighting_stop_name: string;
  driver_id: string;
  driver_first_name: string;
  driver_last_name: string;
  conductor_id: string;
  conductor_first_name: string;
  conductor_last_name: string;
  bus_id: string;
  bus_registration_number: string;
  trip_id: string;
  session_number: number;
  card_payment_details:any;
}
export interface TicketDetails {
  data: Ticket[];
  total: number;
  next_cursor: string;
  has_more: boolean;
  previous_cursor: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}
// Trip related types
export interface Trip {
  id: string,
  trip_date: string,
  started_at: string,
  completed_at: string | null,
  status: "in_progress" | "completed" | "cancelled",
  bus_id: string,
  bus_registration_number: string,
  route_id: string,
  route_code: string,
  route_name: string,
  driver_id: string | null,
  driver_full_name: string | null,
  conductor_id: string | null,
  conductor_full_name: string | null,
  created_at: string,
  updated_at: string
  sessions: TripSession[];
  code?:string
}

export interface TripSession {
  id: number;
  sessionNumber: string;
  from: string;
  to: string;
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  driverName: string;
  conductorName: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  duration: string;
  totalRevenue: number;
  totalTickets: number;
  fullTickets: number;
  halfTickets: number;
}
export interface TripDetails {
  id: string,
  trip_date: string,
  started_at: string,
  completed_at: string | null,
  status: "in_progress" | "completed" | "cancelled",
  bus_id: string,
  bus_registration_number: string,
  route_id: string,
  route_code: string,
  route_name: string,
  driver_id: string,
  driver_full_name: string,
  code?: string,
  conductor_id: string,
  conductor_full_name: string,
  metrics:{
      total_revenue: number,
      total_tickets: number,
      full_tickets: number,
      half_tickets: number,
      cash_revenue: number,
      card_revenue: number,
      total_sessions: number
    },
  sessions: any,
  created_at:string,
  updated_at:string
}
export interface PaginatedResponse<T> {
  data: T[];
  next_cursor?: string | null;
  has_more?: boolean;
  limit: number;
  total:number;
  offset?:number|null
}
export interface PaginatedResponseRoute<T> {
  routes: T[];
  next_cursor?: string | null;
  has_more?: boolean;
  limit: number;
  total:number;
  offset?:number|null
}
export interface TripFilters {
  bus_id?: string;
  company_id?: string
  route_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  driver_id?: string;
  conductor_id?: string;
  sort_order?: 'asc' | 'desc';
  started_at_from?: string;
  started_at_to?: string;
  limit?: number;

}

// Types
export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'multiselect';
  options?: { name: string; id: string }[];
  placeholder?: string;
  
  icon?: React.ReactNode;
}

export interface FilterValues {
  [key: string]: any;
}

export interface DynamicFilterProps {
  isOpen: boolean;
  onClose: () => void;
  fields: FilterField[];
  values: FilterValues;
  onApply: (values: FilterValues) => void;
  onReset: () => void;
}