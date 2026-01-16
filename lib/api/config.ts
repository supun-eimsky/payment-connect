// API Service Types
export type ApiServiceType = 'ticketing' | 'user' | 'fare';

// Service Configuration
export interface ServiceConfig {
  name: string;
  baseURL: string;
  timeout: number;
}

// API Configuration
export const API_SERVICES: Record<ApiServiceType, ServiceConfig> = {
  ticketing: {
    name: 'Ticketing Service',
    baseURL: process.env.NEXT_PUBLIC_TICKETING_API_URL || 'http://34.14.181.212/ticketing-service',
    timeout: 30000,
  },
  user: {
    name: 'User Service',
    baseURL: process.env.NEXT_PUBLIC_USER_API_URL || 'http://34.14.181.212/user-service',
    timeout: 30000,
  },
  fare: {
    name: 'Fare Service',
    baseURL: process.env.NEXT_PUBLIC_FARE_API_URL || 'http://34.14.181.212/fare-service',
    timeout: 30000,
  },
};

// API Version
export const API_VERSION = 'v1';

// Endpoints organized by service
export const API_ENDPOINTS = {
  // User Service Endpoints
  user: {
    LOGIN: '/api/v1/auth/login',
    SIGNUP: '/api/v1/auth/signup',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH_TOKEN: '/api/v1/auth/refresh',
    USERS: '/api/v1/users',
    USER_BY_ID: (id: string) => `/api/v1/users/${id}`,
    PROFILE: '/api/v1/users/profile',
    USER: '/api/v1/users',
    CREATE_USER: '/api/v1/users',
    UPDATE_USER: (id: String) => `/api/v1/users/${id}`,
    DELETE_USER: (id: String) => `/api/v1/users/${id}`,

  },


  devices: {
    CRESTE_DEVICES: '/api/v1/devices',
    UPDATE_DEVICES:(id: String) => `/api/v1/devices/${id}`,
    CRESTE_DEVICES_ORGANISATION:(id: String) => `/api/v1/devices/organisation/${id}`,
    DEVICES_BY_ID: (id: String) => `/api/v1/devices/${id}`,
    ASSIGN_TO_ORGANISATION: (id: String) => `/api/v1/devices/organisation/${id}`,
    ASSIGN_TO_COMPANY: (id: String) => `/api/v1/devices/${id}/assign-to-company`,
    ASSIGN_TO_BUS: (id: String) => `/api/v1/devices/${id}/assign-to-bus`,
    GET_DEVICES: `/api/v1/devices`,
    GET_DEVICES_COMPANY: (id: String) => `/api/v1/devices/company/${id}/devices`,
  },

  // Ticketing Service Endpoints
  ticketing: {
    TICKETS: '/api/v1/tickets',
    TICKET_BY_ID: (id: number) => `/api/v1/tickets/${id}`,
    CREATE_TICKET: '/api/v1/tickets/create',
    CANCEL_TICKET: (id: number) => `/api/v1/tickets/${id}/cancel`,
    TRIPS: '/api/v1/trips',
    TRIP_BY_ID: (id: string) => `/api/v1/trips/${id}/enhanced`,
    SESSIONS: '/api/v1/sessions',
    SESSION_BY_ID: (id: number) => `/api/v1/sessions/${id}`,
    DASHBOARD_STATS: '/api/v1/dashboard/stats',
    TRIPS_SESSION: '/api/v1/trips/with-filters',
    CURRENT_USER: '/api/v1/auth/me',
  },


  directions: {
    CREATE_DIRECTIONS: `/api/v1/directions`,
    UPDATE_DIRECTIONS: (id: String) => `/api/v1/directions/${id}`,
    DIRECTION_STOPS: `/api/v1/direction-stops`,
    BOTH_DIRECTION_STOPS_CREATE: '/api/v1/direction-stops/bidirectional'
  },
  route: {
    CREATE_ROUTES: `/api/v1/routes`,
    UPDATE_ROUTES: (id: String) => `/api/v1/routes/${id}`,
    GET_ROUTES_COMPANY: (id: String) =>  `/api/v1/routes/company/${id}`,
    GET_ROUTES_ORGANISATION: (id: String) =>  `/api/v1/routes/organisation/${id}`,
    ROUTES_CATEGORIES: `/api/v1/categories`,
    ROUTES: `/api/v1/routes`,
    ROUTE_BY_ID: (id: String) => `/api/v1/routes/${id}`,
    GET_ROUTE_FLL: (id: string) => `/api/v1/routes/${id}/structure`,
    FARES_TO_BUS_STOP: (direction_id: String, from_stop_id: string) => `/api/v1/fares/direction/${direction_id}/from-stop/${from_stop_id}`,


  },

  trip: {
    TRIPS: `/api/v1/trips`,
  },
  permits: {
    ROUTE_PERMITS: `/api/v1/route-permits`,
    CREATE_ROUTE_PERMITS: `/api/v1/route-permits`,
    UPDATE_ROUTE_PERMITS: (id: String) => `/api/v1/route-permits/${id}`,
    DELETE_ROUTE_PERMITS: (id: String) => `/api/v1/route-permits/${id}`,

  },
  bus: {
    BUS: `/api/v1/buses`,
    CREATE_BUS: `/api/v1/buses`,
    BUS_BY_ID: (id: String) => `/api/v1/buses/${id}/with-device
 `,
    UPDATE_BUS: (id: String) => `/api/v1/buses/${id}`,
    DELETE_BUS: (id: String) => `/api/v1/buses/${id}`,
    BUS_ROUTE_ASSIGNMENTS: (id: String) => `/api/v1/bus-route-assignments/bus/${id}`,
    BUS_ALL_ASSIGNMENTS: (id: String) => `/api/v1/buses/${id}/assignments`,
    ROUTE_ASSIGNMENTS_UPDATE: (id: String) => `/api/v1/bus-route-assignments/${id}`,
    ROUTE_ASSIGNMENTS_TO_BUS: `/api/v1/bus-route-assignments`,
    BUS_CREW_ASSIGNMENTS: `/api/v1/bus-crew-assignments`,
    CREW_ASSIGNMENTS_UPDATE: (id: String) => `/api/v1/bus-crew-assignments/${id}`,



  },
  busStop: {
    CREATE_BUS_STOP: `/api/v1/stops`,
    UPDATE_BUS_STOP: (id: String) => `/api/v1/stops/${id}`,
    BUS_STOP_BY_ID: (id: String) => `/api/v1/stops/${id}`,
    DELETE_BUS_STOP: (id: String) => `/api/v1/stops/${id}`,
    BUS_STOPS: `/api/v1/stops/list`,
  },
  organisation: {
    ORGANISATIONS: `/api/v1/organisations`,
    CREATE_ORGANISATION: `/api/v1/organisations`,
    UPDATE_ORGANISATION: (id: String) => `/api/v1/organisations/${id}`,
    ORGANISATION_BY_ID: (id: String) => `/api/v1/organisations/${id}`,
    DELETE_ORGANISATION: (id: String) => `/api/v1/organisations/${id}`,
  },
  company: {
    COMPANIES: `/api/v1/companies`,
    CREATE_COMPANY: `/api/v1/companies`,
    COMPANY_BY_ID: (id: String) => `/api/v1/companies/${id}`,

    UPDATE_COMPANY: (id: String) => `/api/v1/companies/${id}`,
    DELETE_COMPANY: (id: String) => `/api/v1/companies/${id}`,
  },
  // Fare Service Endpoints
  fare: {
    FARES: '/api/v1/fares',
    FARES_CREATE: '/api/v1/fares/bidirectional/categories',
    FARES_UPDATE: (id: string) => `/api/v1/fares/bidirectional/categories/${id}`,
    FARE_BY_ID: (id: number) => `/api/fares/${id}`,
    CALCULATE_FARE: '/api/fares/calculate',
    ROUTES: '/api/routes',
    ROUTE_BY_ID: (id: number) => `/api/routes/${id}`,
    BUSES: '/api/buses',
    BUS_BY_ID: (id: number) => `/api/buses/${id}`,
    GET_FARE_FULL: (id: string) => `/api/v1/routes/${id}`,
    GET_FARE_FLL_CATEGORIES: (id: string) => `/api/v1/routes/${id}/full`,
  },
};

// Default Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Environment check
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Helper to get service base URL
export const getServiceBaseUrl = (service: ApiServiceType): string => {
  return API_SERVICES[service].baseURL;
};

// Helper to get service timeout
export const getServiceTimeout = (service: ApiServiceType): number => {
  return API_SERVICES[service].timeout;
};

// Helper to build full URL
export const getApiUrl = (service: ApiServiceType, endpoint: string): string => {
  return `${getServiceBaseUrl(service)}${endpoint}`;
};

// Export for backward compatibility
export const API_CONFIG = {
  BASE_URL: API_SERVICES.user.baseURL, // Default to user service
  TIMEOUT: 30000,
  VERSION: API_VERSION,
  ENDPOINTS: API_ENDPOINTS.user, // Default endpoints
  HEADERS: DEFAULT_HEADERS,
};