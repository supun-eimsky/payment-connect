import RouteForm from "@/components/route/route-form";

export interface Stop {
  id: string;
  stop_name_si: string;
  stop_name_en: string;
  stop_name_tm: string;
  stop_code: string;
  sequence_number: number;
  distance_from_start_km: number;
  latitude: number;
  longitude: number;
}

export interface Direction {
  id: string;
  start_location: string;
  end_location: string;
  total_distance_km: number;
  estimated_duration_minutes: number;
  status: string;
  stops: Stop[];
}
export interface RouteFormData {
  id: any;
  code: string;
  name: string;
  status: string;
}
export interface RouteProps {
  companyId: string;
  initialData?: RouteFormData | null;
  onSubmit: (data: RouteFormData) => void;
  onCancel: () => void;
}
export interface Route {
  id: string;
  code: string;
  name: string;
  status: string;
}
export interface RouteAssignment {
  id: string;
  route: Route;
  assigned_date: string;
  removed_date?: string;
  status: string;
}
export interface AllAssignment {
  bus: any,
  route_assignments: RouteAssignment[]
  crew_assignments: any[]
}


export interface FareCategory {
  category_id: string;
  category_name: string;
  full_amount_lkr: number;
  half_amount_lkr: number;
}

export interface Fare {
  id: string;
  direction_id: string;
  from_stop_id: string;
  to_stop_id: string;
  effective_from: string;
  effective_to: string;
  status: string;
  categories: FareCategory[];
}

export interface RouteData {
  route: Route;
  directions: Direction[];
}

export interface EditMode {
  type: string | null;
  id: string | null;
}
export interface RouteProps {
  companyId: string;
  initialData?: RouteFormData | null;
  onSubmit: (data: RouteFormData) => void;
  onCancel: () => void;
}
export interface RouteTableProps {
  buses: Route[];
  onAdd: () => void;
  onEdit: (bus: Route) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  viewFareTable: (id: string) => void;
}
export interface RouteFilters {
  status?: string,
  search?: string,
  code?: string,
  name?: string,
  limit?: number,
  offset?: number

}
interface ToStop {
  id: string;
  stop_name_si: string;
  stop_name_en: string;
  stop_name_tm: string;
  stop_code: string;
  sequence_number: number;
  distance_from_start_km: number;
}

export interface FareDetail {
  to_stop: ToStop;
  distance_km: number;
  categories: FareCategory[];
}
export interface StopFaresResponse {
  direction: {
    id: string;
    route_id: string;
    route_code: string;
    route_name: string;
    start_location: string;
    end_location: string;
    total_distance_km: number;
    estimated_duration_minutes: number;
  };
  from_stop: {
    id: string;
    stop_name_si: string;
    stop_name_en: string;
    stop_name_tm: string;
    stop_code: string;
    sequence_number: number;
    distance_from_start_km: number;
  };
  fares: FareDetail[];
  special_fares: any[];
  meta: {
    timestamp: number;
    request_id: string;
  };
}
export interface AvailableCategory {
  id: string,
  name: string
}
export interface CreateAssignmentPayload {
  bus_id: string;
  route_id: string;
  assigned_date: string;

}
