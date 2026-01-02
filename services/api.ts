import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import {
  AuthResponse,
  LoginCredentials,
  SignupData,
  User,
  DashboardStats,
  TicketDetails,
  PaginatedResponse,
  TripFilters,
  Trip,
  TripDetails,
  PaginatedResponseRoute,

} from '@/types';
import {
  Bus,
  BusFilters,
  BusFormData,
  BusFormProps,
  BusTableProps

} from '@/types/bus-management';
import {
  UserFilters,
  User as Users,
  CreateCrewAssignment

} from '@/types/user';
import {
  BusStops,
  BusStopFormData,
  BusStopFilters


} from '@/types/bus-stop';
import {
  Devices,
  DeviceFilters,
  CreateCompanyAssignmentPayload

} from '@/types/device';
import {
  DirectionsFormData

} from '@/types/direction';
import {
  Route,
  RouteAssignment,
  CreateAssignmentPayload,
  RouteFormData,
  RouteFilters,
  AllAssignment

} from '@/types/route';
import {
  CompanyFilters,
  Company

} from '@/types/company';
import {
  OrganisationFilters,
  Organisation

} from '@/types/organisations';
import {
  RoutePermit,
  RoutePermitFilters,
  RoutePermitFormData,
  RoutePermitProps

} from '@/types/route-permits';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_USER_SERVICE || 'http://34.14.181.212/user-service/api';
const API_BASE_URL_TICKET = process.env.NEXT_PUBLIC_API_URL_TICKET_SERVICE || 'http://34.93.201.175/api';

class ApiService {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Mock API - Replace with actual API calls
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔑 Logging in with API...');

      // Real API call
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.user.LOGIN,
        credentials,
        { service: 'user' } // Explicitly specify service
      );

      console.log('✅ Login successful:', response);
      const data = response.data;
      return {
        access_token: data.access_token, // ✅ This format
        user: data.user,
        refresh_token: data.refresh_token

      };

    } catch (error: any) {
      console.error('❌ Login failed:', error);

      // Handle different error cases
      if (error.status === 401) {
        throw new Error('Email or password is incorrect. Please try again.');
      } else if (error.status === 0) {
        throw new Error('Unable to connect to server. Please try again later.');
      } else {
        throw new Error(error.message || 'An error occurred during login.');
      }
    }
  }


  async signup(data: SignupData): Promise<AuthResponse> {
    // await new Promise(resolve => setTimeout(resolve, 500));

    return {
      access_token: 'mock-jwt-token-' + Date.now(),
      refresh_token: 'mock-refresh-token-' + Date.now(),
      user: {
        id: "",
        name: data.name,
        email: data.email,
        role: 'user',
        status: 'active',
        user_type: 'regular'
      }
    };

    // Real API call:
    // const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    //   method: 'POST',
    //   headers: this.getHeaders(),
    //   body: JSON.stringify(data),
    // });
    // if (!response.ok) throw new Error('Signup failed');
    // return response.json();
  }

  async getDashboardStats(token: string): Promise<DashboardStats> {
    // await new Promise(resolve => setTimeout(resolve, 300));

    return {
      totalBookings: 1247,
      activeBuses: 45,
      totalRevenue: 125430,
      todayBookings: 89
    };

    // Real API call:
    // const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
    //   headers: this.getHeaders(token),
    // });
    // if (!response.ok) throw new Error('Failed to fetch stats');
    // return response.json();
  }
  async getTicketDetails(token: string, cursor?: string | null, filters?: any): Promise<TicketDetails> {
    

    // Build query parameters
    const params: Record<string, string | number | boolean> = {
      ...(cursor && { cursor }),
      ...filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
      )
    };

    const response = await apiClient.get<TicketDetails>(
      API_ENDPOINTS.ticketing.TICKETS,
      { token, params, service: 'ticketing' }
    );
    return response.data
  }
  async getTripDetails(token: string, id: string): Promise<TripDetails> {
    //await new Promise(resolve => setTimeout(resolve, 300));

    // Real API call:
    const response = await apiClient.get<TripDetails>(
      API_ENDPOINTS.ticketing.TRIP_BY_ID(id),
      { token, service: 'ticketing' }
    );
    return response.data;
  }
  async getTripsWithFilters(
    token: string,
    cursor?: string | null,
    filters?: TripFilters
  ): Promise<PaginatedResponse<Trip>> {

    // Real API call:
    // Build query parameters
    const params: Record<string, string | number | boolean> = {};

    if (cursor) {
      params.cursor = cursor;
    }

    if (filters) {
      if (filters.status) {
        params.status = filters.status;
      }
      if (filters.bus_id) {
        params.bus_id = filters.bus_id;
      }
      if (filters.company_id) {
        params.company_id = filters.company_id;
      }
      if (filters.conductor_id) {
        params.conductor_id = filters.conductor_id;
      }
      if (filters.driver_id) {
        params.driver_id = filters.driver_id;
      }
      if (filters.route_id) {
        params.route_id = filters.route_id;
      }

      if (filters.start_date) {
        params.start_date = filters.start_date;
      }
      if (filters.limit) {
        params.limit = filters.limit;
      }
      if (filters.end_date) {
        params.end_date = filters.end_date;
      }

    }

    const response = await apiClient.get<PaginatedResponse<Trip>>(
      API_ENDPOINTS.ticketing.TRIPS_SESSION,
      { token, params, service: 'ticketing' }
    );
    return response.data;
  }
  async getBusStopWithFilters(
    token: string,
    filters?: BusStopFilters
  ): Promise<any> {

    // Real API call:
    // Build query parameters
    const params: Record<string, string | number | boolean> = {};

  
    if (filters) {
      if (filters.status) {
        params.status = filters.status;
      }
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.stop_code) {
        params.stop_code = filters.stop_code;
      }
      if (filters.stop_name_en) {
        params.stop_name_en = filters.stop_name_en;
      }

      if (filters.offset) {
        params.offset = filters.offset;
      }


      if (filters.limit) {
        params.limit = filters.limit;
      }


    }

    const response = await apiClient.get<any>(
      API_ENDPOINTS.busStop.BUS_STOPS,
      { token, params, service: 'fare' }
    );
    console.log(response)
    const response2 = {
      data: {
        data: [
          {
            "id": "xcxcih343434354354edffsfdfd",
            "stop_code": "CMB001",
            "stop_name_en": "Fort Railway Station",
            "stop_name_si": "ෆෝට් දුම්රිය ස්ථානය",
            "stop_name_tm": "ஃபோர்ட் ரயில் நிலையம்",
            "latitude": 6.933664,
            "longitude": 79.849518,
            "status": "Active"
          }
        ],
        total: 1,
        limit: 10
      },
      status: 200,
      success: true
    };

    return response.data;
  }

  async getOrganisationsWithFilters(
    token: string,
    cursor?: string | null,
    filters?: OrganisationFilters
  ): Promise<PaginatedResponse<Organisation>> {


    // Build query parameters
    const params: Record<string, string | number | boolean> = {
      ...(cursor && { cursor }),
      ...filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
      )
    };


    const response = await apiClient.get<PaginatedResponse<Organisation>>(
      API_ENDPOINTS.organisation.ORGANISATIONS,
      { token, params, service: 'user' }
    );

    return response.data;
  }

  async createOrganisation(token: string, organisationFormData: Organisation): Promise<any> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.organisation.CREATE_ORGANISATION,
      organisationFormData,
      { token, service: 'user' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }
  async updateOrganisation(token: string, organisationFormData: Organisation): Promise<any> {
    const setdata = organisationFormData;
    const response = await apiClient.put<any>(

      API_ENDPOINTS.organisation.UPDATE_ORGANISATION(setdata.id),
      organisationFormData,
      { token, service: 'user' } // Explicitly specify service
    );
    console.log(response);
    return response;


  }
  async deleteOrganisation(token: string, id: string): Promise<any> {
    const response = await apiClient.delete<any>(

      API_ENDPOINTS.organisation.DELETE_ORGANISATION(id),
      { token, service: 'user' } // Explicitly specify service
    );
    console.log(response);
    return response;


  }
  async getOrganisationById(token: string, id: string): Promise<Organisation> {

    const response = await apiClient.get<any>(

      API_ENDPOINTS.organisation.ORGANISATION_BY_ID(id),
      { token, service: 'user' } // Explicitly specify service
    );
    console.log(response, "getOrganisationById Details");
    return response.data;


  }


  async getCompaniesWithFilters(
    token: string,
    cursor?: string | null,
    filters?: CompanyFilters
  ): Promise<PaginatedResponse<Company>> {

    // Real API call:
    // Build query parameters
    const params: Record<string, string | number | boolean> = {};

    if (cursor) {
      params.cursor = cursor;
    }

    if (filters) {
      if (filters.status) {
        params.status = filters.status;
      }
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.organisation_id) {
        params.organisation_id = filters.organisation_id;
      }
      if (filters.city) {
        params.city = filters.city;
      }
      if (filters.province) {
        params.province = filters.province;
      }
      if (filters.offset) {
        params.offset = filters.offset;
      }


      if (filters.limit) {
        params.limit = filters.limit;
      }


    }

    const response = await apiClient.get<PaginatedResponse<Company>>(
      API_ENDPOINTS.company.COMPANIES,
      { token, params, service: 'user' }
    );

    return response.data;
  }
  async createCompany(token: string, busFormData: Company): Promise<any> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.company.CREATE_COMPANY,
      busFormData,
      { token, service: 'user' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }
  async updateCompany(token: string, busFormData: Company): Promise<any> {
    const setdata = busFormData;
    const response = await apiClient.put<any>(

      API_ENDPOINTS.company.UPDATE_COMPANY(setdata.id),
      busFormData,
      { token, service: 'user' } // Explicitly specify service
    );
    console.log(response);
    return response;


  }
  async getCompanyById(token: string, id: string): Promise<Company> {

    const response = await apiClient.get<any>(

      API_ENDPOINTS.company.COMPANY_BY_ID(id),
      { token, service: 'user' } // Explicitly specify service
    );
    console.log(response, "getCompanyById Deails");
    return response.data;


  }
  async deleteCompany(token: string, id: string): Promise<any> {

    const response = await apiClient.delete<any>(

      API_ENDPOINTS.company.DELETE_COMPANY(id),
      { token, service: 'user' } // Explicitly specify service
    );
    console.log(response);
    return response;


  }
  async getUsersWithFilters(
    token: string,
    cursor?: string | null,
    filters?: UserFilters
  ): Promise<PaginatedResponse<Users>> {

    // Real API call:
    // Build query parameters
    const params: Record<string, string | number | boolean> = {
      ...(cursor && { cursor }),
      ...filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
      )
    };

    const response = await apiClient.get<PaginatedResponse<Users>>(
      API_ENDPOINTS.user.USERS,
      { token, params, service: 'user' }
    );

    return response.data;
  }
  async createUser(token: string, userFormData: Users): Promise<any> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.user.CREATE_USER,
      userFormData,
      { token, service: 'user' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }
  async updateUser(token: string, userFormData: Users): Promise<any> {
    const setdata = userFormData;
    const response = await apiClient.put<any>(

      API_ENDPOINTS.user.UPDATE_USER(setdata.id),
      userFormData,
      { token, service: 'user' } // Explicitly specify service
    );
    console.log(response);
    return response;


  }
  async getFareFullWithCategories(
    token: string,
    id: string,
    category_id?: string
  ): Promise<any> {

    const params: Record<string, string | number | boolean> = {};

    if (category_id) {
      params.category_id = category_id;
    }

    const response = await apiClient.get<any>(

      API_ENDPOINTS.fare.GET_FARE_FLL_CATEGORIES(id),
      { token, params, service: 'fare' } // Explicitly specify service
    );
    console.log(response, "Bus Deails");
    return response.data;


  }
  async getFareFull(
    token: string,
    id: string,
    category_id?: string
  ): Promise<any> {

    const params: Record<string, string | number | boolean> = {};

    if (category_id) {
      params.category_id = category_id;
    }

    const response = await apiClient.get<any>(

      API_ENDPOINTS.fare.GET_FARE_FULL(id),
      { token, params, service: 'fare' } // Explicitly specify service
    );
    console.log(response, "Bus Deails");
    return response.data;


  }
  async getDevicesWithFilters(
    token: string,
    cursor?: string | null,
    filters?: DeviceFilters
  ): Promise<any> {

    // Real API call:
    // Build query parameters
    // Real API call:
    // Build query parameters
    const params: Record<string, string | number | boolean> = {
      ...(cursor && { cursor }),
      ...filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
      )
    };

    const response = await apiClient.get<any>(
      API_ENDPOINTS.devices.GET_DEVICES,
      { token, params, service: 'ticketing' }
    );
    console.log(response.data, "getDevicesWithFilters")
    return response;
  }
  async getDevicesCompanyWithFilters(
    token: string,
    cursor?: string | null,
    filters?: DeviceFilters
  ): Promise<any> {

    // Real API call:
    // Build query parameters
    // Real API call:
    // Build query parameters
    const params: Record<string, string | number | boolean> = {
      ...(cursor && { cursor }),
      ...filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
      )
    };

    const response = await apiClient.get<any>(
      API_ENDPOINTS.devices.GET_DEVICES_COMPANY(filters?.company_id ? (filters?.company_id) : ("")),
      { token, service: 'ticketing' }
    );
    console.log(response.data, "getDevicesWithFilters")
    return response;
  }

  async createDevices(token: string, permitFormData: any): Promise<any> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.devices.CRESTE_DEVICES,
      permitFormData,
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }
  async createDevicesOrganisation(token: string, id: string, permitFormData: any): Promise<any> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.devices.CRESTE_DEVICES_ORGANISATION(id),
      permitFormData,
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }
  async updateDevicesOrganisation(token: string, permitFormData: any): Promise<any> {
    const setdata = permitFormData;
    const response = await apiClient.put<any>(

      API_ENDPOINTS.devices.UPDATE_DEVICES(setdata.id),
      permitFormData,
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response);
    return response;


  }
  async DevicesGetById(token: string, id: string): Promise<any> {
    const response = await apiClient.get<any>(

      API_ENDPOINTS.devices.DEVICES_BY_ID(id),
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response.data;
  }
  async DeviceAssignmentToCompany(token: string, id: string, formData: CreateCompanyAssignmentPayload): Promise<any> {

    const response = await apiClient.post<any>(

      API_ENDPOINTS.devices.ASSIGN_TO_COMPANY(id),
      formData,
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response, "ROUTE_ASSIGNMENTS");
    return response.data;
  }
  async deviceAssignmentToBus(token: string, id: string, formData: any): Promise<any> {

    const response = await apiClient.post<any>(

      API_ENDPOINTS.devices.ASSIGN_TO_BUS(id),
      formData,
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response, "ROUTE_ASSIGNMENTS");
    return response.data;
  }
  async asdignToOrganisation(token: string, id: string, dataSet: any): Promise<any> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.devices.ASSIGN_TO_ORGANISATION(id),
      dataSet,
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }

  async getBusWithFilters(
    token: string,
    cursor?: string | null,
    filters?: BusFilters
  ): Promise<PaginatedResponse<Bus>> {

    // Real API call:
    // Build query parameters
    // Real API call:
    // Build query parameters
    const params: Record<string, string | number | boolean> = {
      ...(cursor && { cursor }),
      ...filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
      )
    };

    const response = await apiClient.get<PaginatedResponse<Bus>>(
      API_ENDPOINTS.bus.BUS,
      { token, params, service: 'ticketing' }
    );

    return response.data;
  }
  async getBusById(token: string, id: string): Promise<Bus> {

    const response = await apiClient.get<any>(

      API_ENDPOINTS.bus.BUS_BY_ID(id),
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response, "Bus Deails");
    return response.data;


  }
  async getRouteCompany(token: string, companyId: string): Promise<any> {

    const response = await apiClient.get<any>(

      API_ENDPOINTS.route.GET_ROUTES_COMPANY(companyId),
      { token, service: 'fare' } // Explicitly specify service
    );
    console.log(response, "Bus ROUTES_CATEGORIES");
    return response.data;


  }

  async getRouteCategories(token: string): Promise<any> {

    const response = await apiClient.get<any>(

      API_ENDPOINTS.route.ROUTES_CATEGORIES,
      { token, service: 'fare' } // Explicitly specify service
    );
    console.log(response, "Bus ROUTES_CATEGORIES");
    return response.data;


  }
  async getBusRouteassignments(token: string, id: string): Promise<AllAssignment> {

    const response = await apiClient.get<any>(

      API_ENDPOINTS.bus.BUS_ALL_ASSIGNMENTS(id),
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response, "Bus BUS_ROUTE_ASSIGNMENTS");
    return response.data;


  }
  async routeAssignmentToBus(token: string, formData: CreateAssignmentPayload): Promise<any> {

    const response = await apiClient.post<any>(

      API_ENDPOINTS.bus.ROUTE_ASSIGNMENTS_TO_BUS,
      formData,
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response, "ROUTE_ASSIGNMENTS");
    return response.data;
  }
  async busCrewAssignments(token: string, formData: CreateCrewAssignment): Promise<any> {

    const response = await apiClient.post<any>(

      API_ENDPOINTS.bus.BUS_CREW_ASSIGNMENTS,
      formData,
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response, "ROUTE_ASSIGNMENTS");
    return response.data;
  }
  async updateCrewAssignment(token: string, formData: any): Promise<any> {

    const response = await apiClient.put<any>(

      API_ENDPOINTS.bus.CREW_ASSIGNMENTS_UPDATE(formData.id),
      formData,
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response, "ROUTE_ASSIGNMENTS");
    return response.data;
  }

  async updateRouteAssignment(token: string, formData: any): Promise<any> {

    const response = await apiClient.put<any>(

      API_ENDPOINTS.bus.ROUTE_ASSIGNMENTS_UPDATE(formData.id),
      formData,
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response, "ROUTE_ASSIGNMENTS");
    return response.data;
  }

  async createBus(token: string, busFormData: BusFormData): Promise<any> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.bus.CREATE_BUS,
      busFormData,
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }
  async updateBus(token: string, busFormData: BusFormData): Promise<any> {
    const setdata = busFormData;
    const response = await apiClient.put<any>(

      API_ENDPOINTS.bus.UPDATE_BUS(setdata.id),
      busFormData,
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response);
    return response;


  }
  async deleteBus(token: string, id: string): Promise<any> {

    const response = await apiClient.delete<any>(

      API_ENDPOINTS.bus.DELETE_BUS(id),
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response);
    return response;


  }

  async createBusStop(token: string, busStopFormData: BusStopFormData): Promise<any> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.busStop.CREATE_BUS_STOP,
      busStopFormData,
      { token, service: 'fare' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }
  async getRoutePermitsWithFilters(
    token: string,
    cursor?: string | null,
    filters?: RoutePermitFilters
  ): Promise<PaginatedResponse<RoutePermit>> {

    // Real API call:
    // Build query parameters
    const params: Record<string, string | number | boolean> = {};

    if (cursor) {
      params.cursor = cursor;
    }

    if (filters) {
      if (filters.status) {
        params.status = filters.status;
      }
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.company_id) {
        params.company_id = filters.company_id;
      }
      if (filters.expiring_soon) {
        params.expiring_soon = filters.expiring_soon;
      }
      if (filters.offset) {
        params.offset = filters.offset;
      }


      if (filters.limit) {
        params.limit = filters.limit;
      }


    }

    const response = await apiClient.get<PaginatedResponse<RoutePermit>>(
      API_ENDPOINTS.permits.ROUTE_PERMITS,
      { token, params, service: 'ticketing' }
    );
    // console.log(response)
    console.log(response, "sssssssssssyuyuyuyuyuyuyuyuy")
    return response.data;
  }

  async createRoutePermits(token: string, permitFormData: RoutePermitFormData): Promise<any> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.permits.CREATE_ROUTE_PERMITS,
      permitFormData,
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }
  async updateRoutePermit(token: string, permitFormData: RoutePermitFormData): Promise<any> {
    const setdata = permitFormData;
    const response = await apiClient.put<any>(

      API_ENDPOINTS.permits.UPDATE_ROUTE_PERMITS(setdata.id),
      permitFormData,
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response);
    return response;


  }
  async deleteRoutePermit(token: string, id: string): Promise<any> {

    const response = await apiClient.delete<any>(

      API_ENDPOINTS.permits.DELETE_ROUTE_PERMITS(id),
      { token, service: 'ticketing' } // Explicitly specify service
    );
    console.log(response);
    return response;


  }
  async createFares(token: string, permitFormData: any): Promise<any> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.fare.FARES_CREATE,
      permitFormData,
      { token, service: 'fare' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }
  async updateFares(token: string, permitFormData: any, category_id: string): Promise<any> {
    const response = await apiClient.put<any>(
      API_ENDPOINTS.fare.FARES_UPDATE(category_id),
      permitFormData,
      { token, service: 'fare' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }
  async getRouteById(token: string, id: string): Promise<any> {
    const params: Record<string, string | number | boolean> = {};
    params.category_id = "2b56c0bd-9208-416a-a03f-c869d06e47d9";
    const response = await apiClient.get<any>(

      API_ENDPOINTS.route.ROUTE_BY_ID(id),
      { token, params, service: 'fare', } // Explicitly specify service
    );
    console.log(response, "getRouteById Deails");
    return response.data;


  }
  async getRouteWithFilters(
    token: string,
    cursor?: string | null,
    filters?: RouteFilters
  ): Promise<PaginatedResponseRoute<Route>> {

    // Real API call:
    // Build query parameters
    const params: Record<string, string | number | boolean> = {
      ...(cursor && { cursor }),
      ...filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
      )
    };

    const response = await apiClient.get<PaginatedResponseRoute<Route>>(
      API_ENDPOINTS.route.ROUTES,
      { token, params, service: 'fare' }
    );
    console.log(response, "Route list")
    const response2 = {

      data: {
        data: [
          {
            id: "4d203fc0-1dea-4914-b8c4-5242946c80bf",
            name: "Colombo - Galle Expressway Service",
            code: "138",
            status: "active",
          },
          {
            id: "6a11e4e6-2094-4a67-82f6-0526ad116bc8",
            name: "Awissawella - Rathnapura",
            code: "159",
            status: "active",
          }
        ],
        total: 1,
        limit: 10
      },
      status: 200,
      success: true
    };

    return response.data
  }
  async createRoute(token: string, permitFormData: RouteFormData): Promise<any> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.route.CREATE_ROUTES,
      permitFormData,
      { token, service: 'fare' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }
  async updateRoute(token: string, permitFormData: RouteFormData): Promise<any> {
    const response = await apiClient.put<any>(
      API_ENDPOINTS.route.UPDATE_ROUTES(permitFormData.id),
      permitFormData,
      { token, service: 'fare' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }
  async createdirection(token: string, permitFormData: DirectionsFormData): Promise<any> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.directions.CREATE_DIRECTIONS,
      permitFormData,
      { token, service: 'fare' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }
  async getFaresToBusStop(token: string, directionId: string, stopId: string): Promise<any> {
    //await new Promise(resolve => setTimeout(resolve, 300));

    // Real API call:
    const response = await apiClient.get<PaginatedResponse<any>>(
      API_ENDPOINTS.route.FARES_TO_BUS_STOP(directionId, stopId),
      { token, service: 'fare' }
    );
    console.log(response)
    return response.data
  }
  async createDirectionStops(token: string, dataSet: any): Promise<any> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.directions.BOTH_DIRECTION_STOPS_CREATE,
      dataSet,
      { token, service: 'fare' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }
  async updateBothDirectionStops(token: string, dataSet: any): Promise<any> {
    const response = await apiClient.put<any>(
      API_ENDPOINTS.directions.BOTH_DIRECTION_STOPS_CREATE,
      dataSet,
      { token, service: 'fare' } // Explicitly specify service
    );
    console.log(response, "ioioioioioioi");

    return response;
  }
  async getRouteData(token: string, id: string): Promise<any> {
    //await new Promise(resolve => setTimeout(resolve, 300));

    // Real API call:
    const response = await apiClient.get<PaginatedResponse<Route>>(
      API_ENDPOINTS.route.GET_ROUTE_FLL(id),
      { token, service: 'fare' }
    );
    console.log(response, "opopopopopopopopopopopopopop")
    const dataSet = {
      "data": {
        "route": {
          "id": "1b1ddc53-ab3e-4265-9d81-513099f5eefb",
          "code": "138",
          "name": "Colombo - Galle Expressway Service",
          "status": "active"
        },
        "directions": [
          {
            "id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "start_location": "Colombo Fort",
            "end_location": "Galle",
            "total_distance_km": 116.8,
            "estimated_duration_minutes": 150,
            "status": "active",
            "stops": [
              {
                "id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
                "stop_name_si": "කොළඹ කොටුව",
                "stop_name_en": "Colombo Fort",
                "stop_name_tm": "கொழும்பு கோட்டை",
                "stop_code": "1",
                "sequence_number": 1,
                "distance_from_start_km": 0,
                "latitude": 6.9271,
                "longitude": 79.8612
              },
              {
                "id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
                "stop_name_si": "බම්බලපිටිය",
                "stop_name_en": "Bambalapitiya",
                "stop_name_tm": "பம்பலப்பிட்டி",
                "stop_code": "2",
                "sequence_number": 2,
                "distance_from_start_km": 6.2,
                "latitude": 6.8905,
                "longitude": 79.8567
              },
              {
                "id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
                "stop_name_si": "වැල්ලවත්ත",
                "stop_name_en": "Wellawatte",
                "stop_name_tm": "வெல்லவத்தை",
                "stop_code": "3",
                "sequence_number": 3,
                "distance_from_start_km": 8.5,
                "latitude": 6.8771,
                "longitude": 79.8585
              },
              {
                "id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
                "stop_name_si": "දෙහිවල",
                "stop_name_en": "Dehiwala",
                "stop_name_tm": "தெஹிவளை",
                "stop_code": "4",
                "sequence_number": 4,
                "distance_from_start_km": 11.3,
                "latitude": 6.8515,
                "longitude": 79.8652
              },
              {
                "id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
                "stop_name_si": "ගල්කිස්ස",
                "stop_name_en": "Mount Lavinia",
                "stop_name_tm": "மவுண்ட் லவீனியா",
                "stop_code": "5",
                "sequence_number": 5,
                "distance_from_start_km": 13.8,
                "latitude": 6.8382,
                "longitude": 79.8637
              },
              {
                "id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
                "stop_name_si": "මොරටුව",
                "stop_name_en": "Moratuwa",
                "stop_name_tm": "மொறட்டுவை",
                "stop_code": "6",
                "sequence_number": 6,
                "distance_from_start_km": 18.7,
                "latitude": 6.7729,
                "longitude": 79.8816
              },
              {
                "id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
                "stop_name_si": "පානදුර",
                "stop_name_en": "Panadura",
                "stop_name_tm": "பாணந்துறை",
                "stop_code": "7",
                "sequence_number": 7,
                "distance_from_start_km": 27.4,
                "latitude": 6.7133,
                "longitude": 79.9026
              },
              {
                "id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
                "stop_name_si": "කළුතර",
                "stop_name_en": "Kalutara",
                "stop_name_tm": "களுத்துறை",
                "stop_code": "8",
                "sequence_number": 8,
                "distance_from_start_km": 42.1,
                "latitude": 6.5854,
                "longitude": 79.9607
              },
              {
                "id": "877c681d-753f-4b45-88f4-401ef86c35bf",
                "stop_name_si": "අලුත්ගම",
                "stop_name_en": "Aluthgama",
                "stop_name_tm": "அலுத்கம",
                "stop_code": "9",
                "sequence_number": 9,
                "distance_from_start_km": 62.3,
                "latitude": 6.4281,
                "longitude": 80.0012
              },
              {
                "id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
                "stop_name_si": "බේන්තොට",
                "stop_name_en": "Bentota",
                "stop_name_tm": "பெந்தோட்ட",
                "stop_code": "10",
                "sequence_number": 10,
                "distance_from_start_km": 65,
                "latitude": 6.4258,
                "longitude": 80.0034
              },
              {
                "id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
                "stop_name_si": "හික්කඩුව",
                "stop_name_en": "Hikkaduwa",
                "stop_name_tm": "ஹிக்கடுவ",
                "stop_code": "11",
                "sequence_number": 11,
                "distance_from_start_km": 98.2,
                "latitude": 6.1408,
                "longitude": 80.1001
              },
              {
                "id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
                "stop_name_si": "ගාල්ල",
                "stop_name_en": "Galle",
                "stop_name_tm": "காலி",
                "stop_code": "12",
                "sequence_number": 12,
                "distance_from_start_km": 116.8,
                "latitude": 6.0535,
                "longitude": 80.221
              }
            ]
          },
          {
            "id": "912db840-d947-4a54-957c-cd6096a8321e",
            "start_location": "Galle",
            "end_location": "Colombo Fort",
            "total_distance_km": 116.8,
            "estimated_duration_minutes": 160,
            "status": "active",
            "stops": [
              {
                "id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
                "stop_name_si": "ගාල්ල",
                "stop_name_en": "Galle",
                "stop_name_tm": "காலி",
                "stop_code": "12",
                "sequence_number": 1,
                "distance_from_start_km": 0,
                "latitude": 6.0535,
                "longitude": 80.221
              },
              {
                "id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
                "stop_name_si": "හික්කඩුව",
                "stop_name_en": "Hikkaduwa",
                "stop_name_tm": "ஹிக்கடுவ",
                "stop_code": "11",
                "sequence_number": 2,
                "distance_from_start_km": 18.6,
                "latitude": 6.1408,
                "longitude": 80.1001
              },
              {
                "id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
                "stop_name_si": "බේන්තොට",
                "stop_name_en": "Bentota",
                "stop_name_tm": "பெந்தோட்ட",
                "stop_code": "10",
                "sequence_number": 3,
                "distance_from_start_km": 51.8,
                "latitude": 6.4258,
                "longitude": 80.0034
              },
              {
                "id": "877c681d-753f-4b45-88f4-401ef86c35bf",
                "stop_name_si": "අලුත්ගම",
                "stop_name_en": "Aluthgama",
                "stop_name_tm": "அலுத்கம",
                "stop_code": "9",
                "sequence_number": 4,
                "distance_from_start_km": 54.5,
                "latitude": 6.4281,
                "longitude": 80.0012
              },
              {
                "id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
                "stop_name_si": "කළුතර",
                "stop_name_en": "Kalutara",
                "stop_name_tm": "களுத்துறை",
                "stop_code": "8",
                "sequence_number": 5,
                "distance_from_start_km": 74.7,
                "latitude": 6.5854,
                "longitude": 79.9607
              },
              {
                "id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
                "stop_name_si": "පානදුර",
                "stop_name_en": "Panadura",
                "stop_name_tm": "பாணந்துறை",
                "stop_code": "7",
                "sequence_number": 6,
                "distance_from_start_km": 89.4,
                "latitude": 6.7133,
                "longitude": 79.9026
              },
              {
                "id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
                "stop_name_si": "මොරටුව",
                "stop_name_en": "Moratuwa",
                "stop_name_tm": "மொறட்டுவை",
                "stop_code": "6",
                "sequence_number": 7,
                "distance_from_start_km": 98.1,
                "latitude": 6.7729,
                "longitude": 79.8816
              },
              {
                "id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
                "stop_name_si": "ගල්කිස්ස",
                "stop_name_en": "Mount Lavinia",
                "stop_name_tm": "மவுண்ட் லவீனியா",
                "stop_code": "5",
                "sequence_number": 8,
                "distance_from_start_km": 103,
                "latitude": 6.8382,
                "longitude": 79.8637
              },
              {
                "id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
                "stop_name_si": "දෙහිවල",
                "stop_name_en": "Dehiwala",
                "stop_name_tm": "தெஹிவளை",
                "stop_code": "4",
                "sequence_number": 9,
                "distance_from_start_km": 105.5,
                "latitude": 6.8515,
                "longitude": 79.8652
              },
              {
                "id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
                "stop_name_si": "වැල්ලවත්ත",
                "stop_name_en": "Wellawatte",
                "stop_name_tm": "வெல்லவத்தை",
                "stop_code": "3",
                "sequence_number": 10,
                "distance_from_start_km": 108.3,
                "latitude": 6.8771,
                "longitude": 79.8585
              },
              {
                "id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
                "stop_name_si": "බම්බලපිටිය",
                "stop_name_en": "Bambalapitiya",
                "stop_name_tm": "பம்பலப்பிட்டி",
                "stop_code": "2",
                "sequence_number": 11,
                "distance_from_start_km": 110.6,
                "latitude": 6.8905,
                "longitude": 79.8567
              },
              {
                "id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
                "stop_name_si": "කොළඹ කොටුව",
                "stop_name_en": "Colombo Fort",
                "stop_name_tm": "கொழும்பு கோட்டை",
                "stop_code": "1",
                "sequence_number": 12,
                "distance_from_start_km": 116.8,
                "latitude": 6.9271,
                "longitude": 79.8612
              }
            ]
          }
        ],
        "fares": [
          {
            "id": "fare-fwd-001",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "from_stop_name_si": "කොළඹ කොටුව",
            "from_stop_name_en": "Colombo Fort",
            "from_stop_name_tm": "கொழும்பு கோட்டை",
            "from_sequence": 1,
            "to_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "to_stop_name_si": "බම්බලපිටිය",
            "to_stop_name_en": "Bambalapitiya",
            "to_stop_name_tm": "பம்பலப்பிட்டி",
            "to_sequence": 2,
            "full_amount_lkr": 45,
            "half_amount_lkr": 23,
            "distance_km": 6.2
          },
          {
            "id": "fare-fwd-002",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "from_stop_name_si": "කොළඹ කොටුව",
            "from_stop_name_en": "Colombo Fort",
            "from_stop_name_tm": "கொழும்பு கோட்டை",
            "from_sequence": 1,
            "to_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "to_stop_name_si": "වැල්ලවත්ත",
            "to_stop_name_en": "Wellawatte",
            "to_stop_name_tm": "வெல்லவத்தை",
            "to_sequence": 3,
            "full_amount_lkr": 55,
            "half_amount_lkr": 28,
            "distance_km": 8.5
          },
          {
            "id": "fare-fwd-003",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "from_stop_name_si": "කොළඹ කොටුව",
            "from_stop_name_en": "Colombo Fort",
            "from_stop_name_tm": "கொழும்பு கோட்டை",
            "from_sequence": 1,
            "to_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "to_stop_name_si": "දෙහිවල",
            "to_stop_name_en": "Dehiwala",
            "to_stop_name_tm": "தெஹிவளை",
            "to_sequence": 4,
            "full_amount_lkr": 60,
            "half_amount_lkr": 30,
            "distance_km": 11.3
          },
          {
            "id": "fare-fwd-004",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "from_stop_name_si": "කොළඹ කොටුව",
            "from_stop_name_en": "Colombo Fort",
            "from_stop_name_tm": "கொழும்பு கோட்டை",
            "from_sequence": 1,
            "to_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "to_stop_name_si": "ගල්කිස්ස",
            "to_stop_name_en": "Mount Lavinia",
            "to_stop_name_tm": "மவுண்ட் லவீனியா",
            "to_sequence": 5,
            "full_amount_lkr": 70,
            "half_amount_lkr": 35,
            "distance_km": 13.8
          },
          {
            "id": "fare-fwd-005",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "from_stop_name_si": "කොළඹ කොටුව",
            "from_stop_name_en": "Colombo Fort",
            "from_stop_name_tm": "கொழும்பு கோட்டை",
            "from_sequence": 1,
            "to_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "to_stop_name_si": "මොරටුව",
            "to_stop_name_en": "Moratuwa",
            "to_stop_name_tm": "மொறட்டுவை",
            "to_sequence": 6,
            "full_amount_lkr": 90,
            "half_amount_lkr": 45,
            "distance_km": 18.7
          },
          {
            "id": "fare-fwd-006",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "from_stop_name_si": "කොළඹ කොටුව",
            "from_stop_name_en": "Colombo Fort",
            "from_stop_name_tm": "கொழும்பு கோட்டை",
            "from_sequence": 1,
            "to_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "to_stop_name_si": "පානදුර",
            "to_stop_name_en": "Panadura",
            "to_stop_name_tm": "பாணந்துறை",
            "to_sequence": 7,
            "full_amount_lkr": 110,
            "half_amount_lkr": 55,
            "distance_km": 27.4
          },
          {
            "id": "fare-fwd-007",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "from_stop_name_si": "කොළඹ කොටුව",
            "from_stop_name_en": "Colombo Fort",
            "from_stop_name_tm": "கொழும்பு கோட்டை",
            "from_sequence": 1,
            "to_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "to_stop_name_si": "කළුතර",
            "to_stop_name_en": "Kalutara",
            "to_stop_name_tm": "களுத்துறை",
            "to_sequence": 8,
            "full_amount_lkr": 160,
            "half_amount_lkr": 80,
            "distance_km": 42.1
          },
          {
            "id": "fare-fwd-008",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "from_stop_name_si": "කොළඹ කොටුව",
            "from_stop_name_en": "Colombo Fort",
            "from_stop_name_tm": "கொழும்பு கோட்டை",
            "from_sequence": 1,
            "to_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "to_stop_name_si": "අලුත්ගම",
            "to_stop_name_en": "Aluthgama",
            "to_stop_name_tm": "அலுத்கம",
            "to_sequence": 9,
            "full_amount_lkr": 220,
            "half_amount_lkr": 110,
            "distance_km": 62.3
          },
          {
            "id": "fare-fwd-009",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "from_stop_name_si": "කොළඹ කොටුව",
            "from_stop_name_en": "Colombo Fort",
            "from_stop_name_tm": "கொழும்பு கோட்டை",
            "from_sequence": 1,
            "to_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "to_stop_name_si": "බේන්තොට",
            "to_stop_name_en": "Bentota",
            "to_stop_name_tm": "பெந்தோட்ட",
            "to_sequence": 10,
            "full_amount_lkr": 230,
            "half_amount_lkr": 115,
            "distance_km": 65
          },
          {
            "id": "fare-fwd-010",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "from_stop_name_si": "කොළඹ කොටුව",
            "from_stop_name_en": "Colombo Fort",
            "from_stop_name_tm": "கொழும்பு கோட்டை",
            "from_sequence": 1,
            "to_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "to_stop_name_si": "හික්කඩුව",
            "to_stop_name_en": "Hikkaduwa",
            "to_stop_name_tm": "ஹிக்கடுவ",
            "to_sequence": 11,
            "full_amount_lkr": 320,
            "half_amount_lkr": 160,
            "distance_km": 98.2
          },
          {
            "id": "fare-fwd-011",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "from_stop_name_si": "කොළඹ කොටුව",
            "from_stop_name_en": "Colombo Fort",
            "from_stop_name_tm": "கொழும்பு கோட்டை",
            "from_sequence": 1,
            "to_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "to_stop_name_si": "ගාල්ල",
            "to_stop_name_en": "Galle",
            "to_stop_name_tm": "காலி",
            "to_sequence": 12,
            "full_amount_lkr": 380,
            "half_amount_lkr": 190,
            "distance_km": 116.8
          },
          {
            "id": "fare-fwd-012",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "from_stop_name_si": "බම්බලපිටිය",
            "from_stop_name_en": "Bambalapitiya",
            "from_stop_name_tm": "பம்பலப்பிட்டி",
            "from_sequence": 2,
            "to_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "to_stop_name_si": "වැල්ලවත්ත",
            "to_stop_name_en": "Wellawatte",
            "to_stop_name_tm": "வெல்லவத்தை",
            "to_sequence": 3,
            "full_amount_lkr": 25,
            "half_amount_lkr": 13,
            "distance_km": 2.3
          },
          {
            "id": "fare-fwd-013",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "from_stop_name_si": "බම්බලපිටිය",
            "from_stop_name_en": "Bambalapitiya",
            "from_stop_name_tm": "பம்பலப்பிட்டி",
            "from_sequence": 2,
            "to_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "to_stop_name_si": "දෙහිවල",
            "to_stop_name_en": "Dehiwala",
            "to_stop_name_tm": "தெஹிவளை",
            "to_sequence": 4,
            "full_amount_lkr": 30,
            "half_amount_lkr": 15,
            "distance_km": 5.1
          },
          {
            "id": "fare-fwd-014",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "from_stop_name_si": "බම්බලපිටිය",
            "from_stop_name_en": "Bambalapitiya",
            "from_stop_name_tm": "பம்பலப்பிட்டி",
            "from_sequence": 2,
            "to_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "to_stop_name_si": "ගල්කිස්ස",
            "to_stop_name_en": "Mount Lavinia",
            "to_stop_name_tm": "மவுண்ட் லவீனியா",
            "to_sequence": 5,
            "full_amount_lkr": 40,
            "half_amount_lkr": 20,
            "distance_km": 7.6
          },
          {
            "id": "fare-fwd-015",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "from_stop_name_si": "බම්බලපිටිය",
            "from_stop_name_en": "Bambalapitiya",
            "from_stop_name_tm": "பம்பலப்பிட்டி",
            "from_sequence": 2,
            "to_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "to_stop_name_si": "මොරටුව",
            "to_stop_name_en": "Moratuwa",
            "to_stop_name_tm": "மொறட்டுவை",
            "to_sequence": 6,
            "full_amount_lkr": 55,
            "half_amount_lkr": 28,
            "distance_km": 12.5
          },
          {
            "id": "fare-fwd-016",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "from_stop_name_si": "බම්බලපිටිය",
            "from_stop_name_en": "Bambalapitiya",
            "from_stop_name_tm": "பம்பலப்பிட்டி",
            "from_sequence": 2,
            "to_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "to_stop_name_si": "පානදුර",
            "to_stop_name_en": "Panadura",
            "to_stop_name_tm": "பாணந்துறை",
            "to_sequence": 7,
            "full_amount_lkr": 85,
            "half_amount_lkr": 43,
            "distance_km": 21.2
          },
          {
            "id": "fare-fwd-017",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "from_stop_name_si": "බම්බලපිටිය",
            "from_stop_name_en": "Bambalapitiya",
            "from_stop_name_tm": "பம்பலப்பிட்டி",
            "from_sequence": 2,
            "to_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "to_stop_name_si": "කළුතර",
            "to_stop_name_en": "Kalutara",
            "to_stop_name_tm": "களுத்துறை",
            "to_sequence": 8,
            "full_amount_lkr": 135,
            "half_amount_lkr": 68,
            "distance_km": 35.9
          },
          {
            "id": "fare-fwd-018",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "from_stop_name_si": "බම්බලපිටිය",
            "from_stop_name_en": "Bambalapitiya",
            "from_stop_name_tm": "பம்பலப்பிட்டி",
            "from_sequence": 2,
            "to_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "to_stop_name_si": "අලුත්ගම",
            "to_stop_name_en": "Aluthgama",
            "to_stop_name_tm": "அலுத்கம",
            "to_sequence": 9,
            "full_amount_lkr": 195,
            "half_amount_lkr": 98,
            "distance_km": 56.1
          },
          {
            "id": "fare-fwd-019",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "from_stop_name_si": "බම්බලපිටිය",
            "from_stop_name_en": "Bambalapitiya",
            "from_stop_name_tm": "பம்பலப்பிட்டி",
            "from_sequence": 2,
            "to_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "to_stop_name_si": "බේන්තොට",
            "to_stop_name_en": "Bentota",
            "to_stop_name_tm": "பெந்தோட்ட",
            "to_sequence": 10,
            "full_amount_lkr": 205,
            "half_amount_lkr": 103,
            "distance_km": 58.8
          },
          {
            "id": "fare-fwd-020",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "from_stop_name_si": "බම්බලපිටිය",
            "from_stop_name_en": "Bambalapitiya",
            "from_stop_name_tm": "பம்பலப்பிட்டி",
            "from_sequence": 2,
            "to_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "to_stop_name_si": "හික්කඩුව",
            "to_stop_name_en": "Hikkaduwa",
            "to_stop_name_tm": "ஹிக்கடுவ",
            "to_sequence": 11,
            "full_amount_lkr": 295,
            "half_amount_lkr": 148,
            "distance_km": 92
          },
          {
            "id": "fare-fwd-021",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "from_stop_name_si": "බම්බලපිටිය",
            "from_stop_name_en": "Bambalapitiya",
            "from_stop_name_tm": "பம்பலப்பிட்டி",
            "from_sequence": 2,
            "to_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "to_stop_name_si": "ගාල්ල",
            "to_stop_name_en": "Galle",
            "to_stop_name_tm": "காலி",
            "to_sequence": 12,
            "full_amount_lkr": 355,
            "half_amount_lkr": 178,
            "distance_km": 110.6
          },
          {
            "id": "fare-fwd-022",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "from_stop_name_si": "වැල්ලවත්ත",
            "from_stop_name_en": "Wellawatte",
            "from_stop_name_tm": "வெல்லவத்தை",
            "from_sequence": 3,
            "to_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "to_stop_name_si": "දෙහිවල",
            "to_stop_name_en": "Dehiwala",
            "to_stop_name_tm": "தெஹிவளை",
            "to_sequence": 4,
            "full_amount_lkr": 20,
            "half_amount_lkr": 10,
            "distance_km": 2.8
          },
          {
            "id": "fare-fwd-023",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "from_stop_name_si": "වැල්ලවත්ත",
            "from_stop_name_en": "Wellawatte",
            "from_stop_name_tm": "வெல்லவத்தை",
            "from_sequence": 3,
            "to_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "to_stop_name_si": "ගල්කිස්ස",
            "to_stop_name_en": "Mount Lavinia",
            "to_stop_name_tm": "மவுண்ட் லவீனியா",
            "to_sequence": 5,
            "full_amount_lkr": 30,
            "half_amount_lkr": 15,
            "distance_km": 5.3
          },
          {
            "id": "fare-fwd-024",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "from_stop_name_si": "වැල්ලවත්ත",
            "from_stop_name_en": "Wellawatte",
            "from_stop_name_tm": "வெல்லவத்தை",
            "from_sequence": 3,
            "to_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "to_stop_name_si": "මොරටුව",
            "to_stop_name_en": "Moratuwa",
            "to_stop_name_tm": "மொறட்டுவை",
            "to_sequence": 6,
            "full_amount_lkr": 45,
            "half_amount_lkr": 23,
            "distance_km": 10.2
          },
          {
            "id": "fare-fwd-025",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "from_stop_name_si": "වැල්ලවත්ත",
            "from_stop_name_en": "Wellawatte",
            "from_stop_name_tm": "வெல்லவத்தை",
            "from_sequence": 3,
            "to_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "to_stop_name_si": "පානදුර",
            "to_stop_name_en": "Panadura",
            "to_stop_name_tm": "பாணந்துறை",
            "to_sequence": 7,
            "full_amount_lkr": 75,
            "half_amount_lkr": 38,
            "distance_km": 18.9
          },
          {
            "id": "fare-fwd-026",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "from_stop_name_si": "වැල්ලවත්ත",
            "from_stop_name_en": "Wellawatte",
            "from_stop_name_tm": "வெல்லவத்தை",
            "from_sequence": 3,
            "to_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "to_stop_name_si": "කළුතර",
            "to_stop_name_en": "Kalutara",
            "to_stop_name_tm": "களுத்துறை",
            "to_sequence": 8,
            "full_amount_lkr": 125,
            "half_amount_lkr": 63,
            "distance_km": 33.6
          },
          {
            "id": "fare-fwd-027",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "from_stop_name_si": "වැල්ලවත්ත",
            "from_stop_name_en": "Wellawatte",
            "from_stop_name_tm": "வெல்லவத்தை",
            "from_sequence": 3,
            "to_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "to_stop_name_si": "අලුත්ගම",
            "to_stop_name_en": "Aluthgama",
            "to_stop_name_tm": "அலுத்கம",
            "to_sequence": 9,
            "full_amount_lkr": 185,
            "half_amount_lkr": 93,
            "distance_km": 53.8
          },
          {
            "id": "fare-fwd-028",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "from_stop_name_si": "වැල්ලවත්ත",
            "from_stop_name_en": "Wellawatte",
            "from_stop_name_tm": "வெல்லவத்தை",
            "from_sequence": 3,
            "to_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "to_stop_name_si": "බේන්තොට",
            "to_stop_name_en": "Bentota",
            "to_stop_name_tm": "பெந்தோட்ட",
            "to_sequence": 10,
            "full_amount_lkr": 195,
            "half_amount_lkr": 98,
            "distance_km": 56.5
          },
          {
            "id": "fare-fwd-029",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "from_stop_name_si": "වැල්ලවත්ත",
            "from_stop_name_en": "Wellawatte",
            "from_stop_name_tm": "வெல்லவத்தை",
            "from_sequence": 3,
            "to_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "to_stop_name_si": "හික්කඩුව",
            "to_stop_name_en": "Hikkaduwa",
            "to_stop_name_tm": "ஹிக்கடுவ",
            "to_sequence": 11,
            "full_amount_lkr": 285,
            "half_amount_lkr": 143,
            "distance_km": 89.7
          },
          {
            "id": "fare-fwd-030",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "from_stop_name_si": "වැල්ලවත්ත",
            "from_stop_name_en": "Wellawatte",
            "from_stop_name_tm": "வெல்லவத்தை",
            "from_sequence": 3,
            "to_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "to_stop_name_si": "ගාල්ල",
            "to_stop_name_en": "Galle",
            "to_stop_name_tm": "காலி",
            "to_sequence": 12,
            "full_amount_lkr": 345,
            "half_amount_lkr": 173,
            "distance_km": 108.3
          },
          {
            "id": "fare-fwd-031",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "from_stop_name_si": "දෙහිවල",
            "from_stop_name_en": "Dehiwala",
            "from_stop_name_tm": "தெஹிவளை",
            "from_sequence": 4,
            "to_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "to_stop_name_si": "ගල්කිස්ස",
            "to_stop_name_en": "Mount Lavinia",
            "to_stop_name_tm": "மவுண்ட் லவீனியா",
            "to_sequence": 5,
            "full_amount_lkr": 20,
            "half_amount_lkr": 10,
            "distance_km": 2.5
          },
          {
            "id": "fare-fwd-032",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "from_stop_name_si": "දෙහිවල",
            "from_stop_name_en": "Dehiwala",
            "from_stop_name_tm": "தெஹிவளை",
            "from_sequence": 4,
            "to_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "to_stop_name_si": "මොරටුව",
            "to_stop_name_en": "Moratuwa",
            "to_stop_name_tm": "மொறட்டுவை",
            "to_sequence": 6,
            "full_amount_lkr": 35,
            "half_amount_lkr": 18,
            "distance_km": 7.4
          },
          {
            "id": "fare-fwd-033",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "from_stop_name_si": "දෙහිවල",
            "from_stop_name_en": "Dehiwala",
            "from_stop_name_tm": "தெஹிவளை",
            "from_sequence": 4,
            "to_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "to_stop_name_si": "පානදුර",
            "to_stop_name_en": "Panadura",
            "to_stop_name_tm": "பாணந்துறை",
            "to_sequence": 7,
            "full_amount_lkr": 65,
            "half_amount_lkr": 33,
            "distance_km": 16.1
          },
          {
            "id": "fare-fwd-034",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "from_stop_name_si": "දෙහිවල",
            "from_stop_name_en": "Dehiwala",
            "from_stop_name_tm": "தெஹிவளை",
            "from_sequence": 4,
            "to_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "to_stop_name_si": "කළුතර",
            "to_stop_name_en": "Kalutara",
            "to_stop_name_tm": "களுத்துறை",
            "to_sequence": 8,
            "full_amount_lkr": 115,
            "half_amount_lkr": 58,
            "distance_km": 30.8
          },
          {
            "id": "fare-fwd-035",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "from_stop_name_si": "දෙහිවල",
            "from_stop_name_en": "Dehiwala",
            "from_stop_name_tm": "தெஹிவளை",
            "from_sequence": 4,
            "to_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "to_stop_name_si": "අලුත්ගම",
            "to_stop_name_en": "Aluthgama",
            "to_stop_name_tm": "அலுத்கம",
            "to_sequence": 9,
            "full_amount_lkr": 175,
            "half_amount_lkr": 88,
            "distance_km": 51
          },
          {
            "id": "fare-fwd-036",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "from_stop_name_si": "දෙහිවල",
            "from_stop_name_en": "Dehiwala",
            "from_stop_name_tm": "தெஹிவளை",
            "from_sequence": 4,
            "to_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "to_stop_name_si": "බේන්තොට",
            "to_stop_name_en": "Bentota",
            "to_stop_name_tm": "பெந்தோட்ட",
            "to_sequence": 10,
            "full_amount_lkr": 185,
            "half_amount_lkr": 93,
            "distance_km": 53.7
          },
          {
            "id": "fare-fwd-037",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "from_stop_name_si": "දෙහිවල",
            "from_stop_name_en": "Dehiwala",
            "from_stop_name_tm": "தெஹிவளை",
            "from_sequence": 4,
            "to_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "to_stop_name_si": "හික්කඩුව",
            "to_stop_name_en": "Hikkaduwa",
            "to_stop_name_tm": "ஹிக்கடுவ",
            "to_sequence": 11,
            "full_amount_lkr": 275,
            "half_amount_lkr": 138,
            "distance_km": 86.9
          },
          {
            "id": "fare-fwd-038",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "from_stop_name_si": "දෙහිවල",
            "from_stop_name_en": "Dehiwala",
            "from_stop_name_tm": "தெஹிவளை",
            "from_sequence": 4,
            "to_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "to_stop_name_si": "ගාල්ල",
            "to_stop_name_en": "Galle",
            "to_stop_name_tm": "காலி",
            "to_sequence": 12,
            "full_amount_lkr": 335,
            "half_amount_lkr": 168,
            "distance_km": 105.5
          },
          {
            "id": "fare-fwd-039",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "from_stop_name_si": "ගල්කිස්ස",
            "from_stop_name_en": "Mount Lavinia",
            "from_stop_name_tm": "மவுண்ட் லவீனியா",
            "from_sequence": 5,
            "to_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "to_stop_name_si": "මොරටුව",
            "to_stop_name_en": "Moratuwa",
            "to_stop_name_tm": "மொறட்டுவை",
            "to_sequence": 6,
            "full_amount_lkr": 25,
            "half_amount_lkr": 13,
            "distance_km": 4.9
          },
          {
            "id": "fare-fwd-040",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "from_stop_name_si": "ගල්කිස්ස",
            "from_stop_name_en": "Mount Lavinia",
            "from_stop_name_tm": "மவுண்ட் லவீனியா",
            "from_sequence": 5,
            "to_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "to_stop_name_si": "පානදුර",
            "to_stop_name_en": "Panadura",
            "to_stop_name_tm": "பாணந்துறை",
            "to_sequence": 7,
            "full_amount_lkr": 55,
            "half_amount_lkr": 28,
            "distance_km": 13.6
          },
          {
            "id": "fare-fwd-041",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "from_stop_name_si": "ගල්කිස්ස",
            "from_stop_name_en": "Mount Lavinia",
            "from_stop_name_tm": "மவுண்ட் லவீனியா",
            "from_sequence": 5,
            "to_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "to_stop_name_si": "කළුතර",
            "to_stop_name_en": "Kalutara",
            "to_stop_name_tm": "களுத்துறை",
            "to_sequence": 8,
            "full_amount_lkr": 100,
            "half_amount_lkr": 50,
            "distance_km": 28.3
          },
          {
            "id": "fare-fwd-042",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "from_stop_name_si": "ගල්කිස්ස",
            "from_stop_name_en": "Mount Lavinia",
            "from_stop_name_tm": "மவுண்ட் லவீனியா",
            "from_sequence": 5,
            "to_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "to_stop_name_si": "අලුත්ගම",
            "to_stop_name_en": "Aluthgama",
            "to_stop_name_tm": "அலுத்கம",
            "to_sequence": 9,
            "full_amount_lkr": 160,
            "half_amount_lkr": 80,
            "distance_km": 48.5
          },
          {
            "id": "fare-fwd-043",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "from_stop_name_si": "ගල්කිස්ස",
            "from_stop_name_en": "Mount Lavinia",
            "from_stop_name_tm": "மவுண்ட் லவீனியா",
            "from_sequence": 5,
            "to_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "to_stop_name_si": "බේන්තොට",
            "to_stop_name_en": "Bentota",
            "to_stop_name_tm": "பெந்தோட்ட",
            "to_sequence": 10,
            "full_amount_lkr": 170,
            "half_amount_lkr": 85,
            "distance_km": 51.2
          },
          {
            "id": "fare-fwd-044",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "from_stop_name_si": "ගල්කිස්ස",
            "from_stop_name_en": "Mount Lavinia",
            "from_stop_name_tm": "மவுண்ட் லவீனியா",
            "from_sequence": 5,
            "to_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "to_stop_name_si": "හික්කඩුව",
            "to_stop_name_en": "Hikkaduwa",
            "to_stop_name_tm": "ஹிக்கடுவ",
            "to_sequence": 11,
            "full_amount_lkr": 260,
            "half_amount_lkr": 130,
            "distance_km": 84.4
          },
          {
            "id": "fare-fwd-045",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "from_stop_name_si": "ගල්කිස්ස",
            "from_stop_name_en": "Mount Lavinia",
            "from_stop_name_tm": "மவுண்ட் லவீனியா",
            "from_sequence": 5,
            "to_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "to_stop_name_si": "ගාල්ල",
            "to_stop_name_en": "Galle",
            "to_stop_name_tm": "காலி",
            "to_sequence": 12,
            "full_amount_lkr": 320,
            "half_amount_lkr": 160,
            "distance_km": 103
          },
          {
            "id": "fare-fwd-046",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "from_stop_name_si": "මොරටුව",
            "from_stop_name_en": "Moratuwa",
            "from_stop_name_tm": "மொறட்டுவை",
            "from_sequence": 6,
            "to_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "to_stop_name_si": "පානදුර",
            "to_stop_name_en": "Panadura",
            "to_stop_name_tm": "பாணந்துறை",
            "to_sequence": 7,
            "full_amount_lkr": 40,
            "half_amount_lkr": 20,
            "distance_km": 8.7
          },
          {
            "id": "fare-fwd-047",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "from_stop_name_si": "මොරටුව",
            "from_stop_name_en": "Moratuwa",
            "from_stop_name_tm": "மொறட்டுவை",
            "from_sequence": 6,
            "to_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "to_stop_name_si": "කළුතර",
            "to_stop_name_en": "Kalutara",
            "to_stop_name_tm": "களுத்துறை",
            "to_sequence": 8,
            "full_amount_lkr": 85,
            "half_amount_lkr": 43,
            "distance_km": 23.4
          },
          {
            "id": "fare-fwd-048",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "from_stop_name_si": "මොරටුව",
            "from_stop_name_en": "Moratuwa",
            "from_stop_name_tm": "மொறட்டுவை",
            "from_sequence": 6,
            "to_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "to_stop_name_si": "අලුත්ගම",
            "to_stop_name_en": "Aluthgama",
            "to_stop_name_tm": "அலுத்கம",
            "to_sequence": 9,
            "full_amount_lkr": 145,
            "half_amount_lkr": 73,
            "distance_km": 43.6
          },
          {
            "id": "fare-fwd-049",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "from_stop_name_si": "මොරටුව",
            "from_stop_name_en": "Moratuwa",
            "from_stop_name_tm": "மொறட்டுவை",
            "from_sequence": 6,
            "to_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "to_stop_name_si": "බේන්තොට",
            "to_stop_name_en": "Bentota",
            "to_stop_name_tm": "பெந்தோட்ட",
            "to_sequence": 10,
            "full_amount_lkr": 155,
            "half_amount_lkr": 78,
            "distance_km": 46.3
          },
          {
            "id": "fare-fwd-050",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "from_stop_name_si": "මොරටුව",
            "from_stop_name_en": "Moratuwa",
            "from_stop_name_tm": "மொறட்டுவை",
            "from_sequence": 6,
            "to_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "to_stop_name_si": "හික්කඩුව",
            "to_stop_name_en": "Hikkaduwa",
            "to_stop_name_tm": "ஹிக்கடுவ",
            "to_sequence": 11,
            "full_amount_lkr": 245,
            "half_amount_lkr": 123,
            "distance_km": 79.5
          },
          {
            "id": "fare-fwd-051",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "from_stop_name_si": "මොරටුව",
            "from_stop_name_en": "Moratuwa",
            "from_stop_name_tm": "மொறட்டுவை",
            "from_sequence": 6,
            "to_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "to_stop_name_si": "ගාල්ල",
            "to_stop_name_en": "Galle",
            "to_stop_name_tm": "காலி",
            "to_sequence": 12,
            "full_amount_lkr": 305,
            "half_amount_lkr": 153,
            "distance_km": 98.1
          },
          {
            "id": "fare-fwd-052",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "from_stop_name_si": "පානදුර",
            "from_stop_name_en": "Panadura",
            "from_stop_name_tm": "பாணந்துறை",
            "from_sequence": 7,
            "to_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "to_stop_name_si": "කළුතර",
            "to_stop_name_en": "Kalutara",
            "to_stop_name_tm": "களுத்துறை",
            "to_sequence": 8,
            "full_amount_lkr": 55,
            "half_amount_lkr": 28,
            "distance_km": 14.7
          },
          {
            "id": "fare-fwd-053",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "from_stop_name_si": "පානදුර",
            "from_stop_name_en": "Panadura",
            "from_stop_name_tm": "பாணந்துறை",
            "from_sequence": 7,
            "to_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "to_stop_name_si": "අලුත්ගම",
            "to_stop_name_en": "Aluthgama",
            "to_stop_name_tm": "அலுத்கம",
            "to_sequence": 9,
            "full_amount_lkr": 115,
            "half_amount_lkr": 58,
            "distance_km": 34.9
          },
          {
            "id": "fare-fwd-054",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "from_stop_name_si": "පානදුර",
            "from_stop_name_en": "Panadura",
            "from_stop_name_tm": "பாணந்துறை",
            "from_sequence": 7,
            "to_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "to_stop_name_si": "බේන්තොට",
            "to_stop_name_en": "Bentota",
            "to_stop_name_tm": "பெந்தோட்ட",
            "to_sequence": 10,
            "full_amount_lkr": 125,
            "half_amount_lkr": 63,
            "distance_km": 37.6
          },
          {
            "id": "fare-fwd-055",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "from_stop_name_si": "පානදුර",
            "from_stop_name_en": "Panadura",
            "from_stop_name_tm": "பாணந்துறை",
            "from_sequence": 7,
            "to_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "to_stop_name_si": "හික්කඩුව",
            "to_stop_name_en": "Hikkaduwa",
            "to_stop_name_tm": "ஹிக்கடுவ",
            "to_sequence": 11,
            "full_amount_lkr": 215,
            "half_amount_lkr": 108,
            "distance_km": 70.8
          },
          {
            "id": "fare-fwd-056",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "from_stop_name_si": "පානදුර",
            "from_stop_name_en": "Panadura",
            "from_stop_name_tm": "பாணந்துறை",
            "from_sequence": 7,
            "to_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "to_stop_name_si": "ගාල්ල",
            "to_stop_name_en": "Galle",
            "to_stop_name_tm": "காலி",
            "to_sequence": 12,
            "full_amount_lkr": 275,
            "half_amount_lkr": 138,
            "distance_km": 89.4
          },
          {
            "id": "fare-fwd-057",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "from_stop_name_si": "කළුතර",
            "from_stop_name_en": "Kalutara",
            "from_stop_name_tm": "களுத்துறை",
            "from_sequence": 8,
            "to_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "to_stop_name_si": "අලුත්ගම",
            "to_stop_name_en": "Aluthgama",
            "to_stop_name_tm": "அலுத்கம",
            "to_sequence": 9,
            "full_amount_lkr": 70,
            "half_amount_lkr": 35,
            "distance_km": 20.2
          },
          {
            "id": "fare-fwd-058",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "from_stop_name_si": "කළුතර",
            "from_stop_name_en": "Kalutara",
            "from_stop_name_tm": "களுத்துறை",
            "from_sequence": 8,
            "to_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "to_stop_name_si": "බේන්තොට",
            "to_stop_name_en": "Bentota",
            "to_stop_name_tm": "பெந்தோட்ட",
            "to_sequence": 10,
            "full_amount_lkr": 80,
            "half_amount_lkr": 40,
            "distance_km": 22.9
          },
          {
            "id": "fare-fwd-059",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "from_stop_name_si": "කළුතර",
            "from_stop_name_en": "Kalutara",
            "from_stop_name_tm": "களுத்துறை",
            "from_sequence": 8,
            "to_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "to_stop_name_si": "හික්කඩුව",
            "to_stop_name_en": "Hikkaduwa",
            "to_stop_name_tm": "ஹிக்கடுவ",
            "to_sequence": 11,
            "full_amount_lkr": 180,
            "half_amount_lkr": 90,
            "distance_km": 56.1
          },
          {
            "id": "fare-fwd-060",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "from_stop_name_si": "කළුතර",
            "from_stop_name_en": "Kalutara",
            "from_stop_name_tm": "களுத்துறை",
            "from_sequence": 8,
            "to_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "to_stop_name_si": "ගාල්ල",
            "to_stop_name_en": "Galle",
            "to_stop_name_tm": "காலி",
            "to_sequence": 12,
            "full_amount_lkr": 240,
            "half_amount_lkr": 120,
            "distance_km": 74.7
          },
          {
            "id": "fare-fwd-061",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "from_stop_name_si": "අලුත්ගම",
            "from_stop_name_en": "Aluthgama",
            "from_stop_name_tm": "அலுத்கம",
            "from_sequence": 9,
            "to_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "to_stop_name_si": "බේන්තොට",
            "to_stop_name_en": "Bentota",
            "to_stop_name_tm": "பெந்தோட்ட",
            "to_sequence": 10,
            "full_amount_lkr": 20,
            "half_amount_lkr": 10,
            "distance_km": 2.7
          },
          {
            "id": "fare-fwd-062",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "from_stop_name_si": "අලුත්ගම",
            "from_stop_name_en": "Aluthgama",
            "from_stop_name_tm": "அலுத்கம",
            "from_sequence": 9,
            "to_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "to_stop_name_si": "හික්කඩුව",
            "to_stop_name_en": "Hikkaduwa",
            "to_stop_name_tm": "ஹிக்கடுவ",
            "to_sequence": 11,
            "full_amount_lkr": 120,
            "half_amount_lkr": 60,
            "distance_km": 35.9
          },
          {
            "id": "fare-fwd-063",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "from_stop_name_si": "අලුත්ගම",
            "from_stop_name_en": "Aluthgama",
            "from_stop_name_tm": "அலுத்கம",
            "from_sequence": 9,
            "to_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "to_stop_name_si": "ගාල්ල",
            "to_stop_name_en": "Galle",
            "to_stop_name_tm": "காலி",
            "to_sequence": 12,
            "full_amount_lkr": 180,
            "half_amount_lkr": 90,
            "distance_km": 54.5
          },
          {
            "id": "fare-fwd-064",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "from_stop_name_si": "බේන්තොට",
            "from_stop_name_en": "Bentota",
            "from_stop_name_tm": "பெந்தோட்ட",
            "from_sequence": 10,
            "to_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "to_stop_name_si": "හික්කඩුව",
            "to_stop_name_en": "Hikkaduwa",
            "to_stop_name_tm": "ஹிக்கடுவ",
            "to_sequence": 11,
            "full_amount_lkr": 110,
            "half_amount_lkr": 55,
            "distance_km": 33.2
          },
          {
            "id": "fare-fwd-065",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "from_stop_name_si": "බේන්තොට",
            "from_stop_name_en": "Bentota",
            "from_stop_name_tm": "பெந்தோட்ட",
            "from_sequence": 10,
            "to_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "to_stop_name_si": "ගාල්ල",
            "to_stop_name_en": "Galle",
            "to_stop_name_tm": "காலி",
            "to_sequence": 12,
            "full_amount_lkr": 170,
            "half_amount_lkr": 85,
            "distance_km": 51.8
          },
          {
            "id": "fare-fwd-066",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "from_stop_name_si": "හික්කඩුව",
            "from_stop_name_en": "Hikkaduwa",
            "from_stop_name_tm": "ஹிக்கடுவ",
            "from_sequence": 11,
            "to_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "to_stop_name_si": "ගාල්ල",
            "to_stop_name_en": "Galle",
            "to_stop_name_tm": "காலி",
            "to_sequence": 12,
            "full_amount_lkr": 75,
            "half_amount_lkr": 38,
            "distance_km": 18.6
          },
          {
            "id": "fare-ret-001",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "from_stop_name_si": "ගාල්ල",
            "from_stop_name_en": "Galle",
            "from_stop_name_tm": "காலி",
            "from_sequence": 1,
            "to_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "to_stop_name_si": "හික්කඩුව",
            "to_stop_name_en": "Hikkaduwa",
            "to_stop_name_tm": "ஹிக்கடுவ",
            "to_sequence": 2,
            "full_amount_lkr": 80,
            "half_amount_lkr": 40,
            "distance_km": 18.6
          },
          {
            "id": "fare-ret-002",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "from_stop_name_si": "ගාල්ල",
            "from_stop_name_en": "Galle",
            "from_stop_name_tm": "காலி",
            "from_sequence": 1,
            "to_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "to_stop_name_si": "බේන්තොට",
            "to_stop_name_en": "Bentota",
            "to_stop_name_tm": "பெந்தோட்ட",
            "to_sequence": 3,
            "full_amount_lkr": 210,
            "half_amount_lkr": 105,
            "distance_km": 51.8
          },
          {
            "id": "fare-ret-003",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "from_stop_name_si": "ගාල්ල",
            "from_stop_name_en": "Galle",
            "from_stop_name_tm": "காலி",
            "from_sequence": 1,
            "to_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "to_stop_name_si": "අලුත්ගම",
            "to_stop_name_en": "Aluthgama",
            "to_stop_name_tm": "அலுத்கம",
            "to_sequence": 4,
            "full_amount_lkr": 220,
            "half_amount_lkr": 110,
            "distance_km": 54.5
          },
          {
            "id": "fare-ret-004",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "from_stop_name_si": "ගාල්ල",
            "from_stop_name_en": "Galle",
            "from_stop_name_tm": "காலி",
            "from_sequence": 1,
            "to_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "to_stop_name_si": "කළුතර",
            "to_stop_name_en": "Kalutara",
            "to_stop_name_tm": "களுத்துறை",
            "to_sequence": 5,
            "full_amount_lkr": 290,
            "half_amount_lkr": 145,
            "distance_km": 74.7
          },
          {
            "id": "fare-ret-005",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "from_stop_name_si": "ගාල්ල",
            "from_stop_name_en": "Galle",
            "from_stop_name_tm": "காலி",
            "from_sequence": 1,
            "to_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "to_stop_name_si": "පානදුර",
            "to_stop_name_en": "Panadura",
            "to_stop_name_tm": "பாணந்துறை",
            "to_sequence": 6,
            "full_amount_lkr": 345,
            "half_amount_lkr": 173,
            "distance_km": 89.4
          },
          {
            "id": "fare-ret-006",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "from_stop_name_si": "ගාල්ල",
            "from_stop_name_en": "Galle",
            "from_stop_name_tm": "காலி",
            "from_sequence": 1,
            "to_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "to_stop_name_si": "මොරටුව",
            "to_stop_name_en": "Moratuwa",
            "to_stop_name_tm": "மொறட்டுவை",
            "to_sequence": 7,
            "full_amount_lkr": 380,
            "half_amount_lkr": 190,
            "distance_km": 98.1
          },
          {
            "id": "fare-ret-007",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "from_stop_name_si": "ගාල්ල",
            "from_stop_name_en": "Galle",
            "from_stop_name_tm": "காலி",
            "from_sequence": 1,
            "to_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "to_stop_name_si": "ගල්කිස්ස",
            "to_stop_name_en": "Mount Lavinia",
            "to_stop_name_tm": "மவுண்ட் லவீனியா",
            "to_sequence": 8,
            "full_amount_lkr": 400,
            "half_amount_lkr": 200,
            "distance_km": 103
          },
          {
            "id": "fare-ret-008",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "from_stop_name_si": "ගාල්ල",
            "from_stop_name_en": "Galle",
            "from_stop_name_tm": "காலி",
            "from_sequence": 1,
            "to_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "to_stop_name_si": "දෙහිවල",
            "to_stop_name_en": "Dehiwala",
            "to_stop_name_tm": "தெஹிவளை",
            "to_sequence": 9,
            "full_amount_lkr": 410,
            "half_amount_lkr": 205,
            "distance_km": 105.5
          },
          {
            "id": "fare-ret-009",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "from_stop_name_si": "ගාල්ල",
            "from_stop_name_en": "Galle",
            "from_stop_name_tm": "காலி",
            "from_sequence": 1,
            "to_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "to_stop_name_si": "වැල්ලවත්ත",
            "to_stop_name_en": "Wellawatte",
            "to_stop_name_tm": "வெல்லவத்தை",
            "to_sequence": 10,
            "full_amount_lkr": 415,
            "half_amount_lkr": 208,
            "distance_km": 108.3
          },
          {
            "id": "fare-ret-010",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "from_stop_name_si": "ගාල්ල",
            "from_stop_name_en": "Galle",
            "from_stop_name_tm": "காலி",
            "from_sequence": 1,
            "to_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "to_stop_name_si": "බම්බලපිටිය",
            "to_stop_name_en": "Bambalapitiya",
            "to_stop_name_tm": "பம்பலப்பிட்டி",
            "to_sequence": 11,
            "full_amount_lkr": 418,
            "half_amount_lkr": 209,
            "distance_km": 110.6
          },
          {
            "id": "fare-ret-011",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "from_stop_name_si": "ගාල්ල",
            "from_stop_name_en": "Galle",
            "from_stop_name_tm": "காலி",
            "from_sequence": 1,
            "to_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "to_stop_name_si": "කොළඹ කොටුව",
            "to_stop_name_en": "Colombo Fort",
            "to_stop_name_tm": "கொழும்பு கோட்டை",
            "to_sequence": 12,
            "full_amount_lkr": 420,
            "half_amount_lkr": 210,
            "distance_km": 116.8
          },
          {
            "id": "fare-ret-012",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "from_stop_name_si": "හික්කඩුව",
            "from_stop_name_en": "Hikkaduwa",
            "from_stop_name_tm": "ஹிக்கடுவ",
            "from_sequence": 2,
            "to_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "to_stop_name_si": "බේන්තොට",
            "to_stop_name_en": "Bentota",
            "to_stop_name_tm": "பெந்தோட்ட",
            "to_sequence": 3,
            "full_amount_lkr": 135,
            "half_amount_lkr": 68,
            "distance_km": 33.2
          },
          {
            "id": "fare-ret-013",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "from_stop_name_si": "හික්කඩුව",
            "from_stop_name_en": "Hikkaduwa",
            "from_stop_name_tm": "ஹிக்கடுவ",
            "from_sequence": 2,
            "to_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "to_stop_name_si": "අලුත්ගම",
            "to_stop_name_en": "Aluthgama",
            "to_stop_name_tm": "அலுத்கம",
            "to_sequence": 4,
            "full_amount_lkr": 145,
            "half_amount_lkr": 73,
            "distance_km": 35.9
          },
          {
            "id": "fare-ret-014",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "from_stop_name_si": "හික්කඩුව",
            "from_stop_name_en": "Hikkaduwa",
            "from_stop_name_tm": "ஹிக்கடுவ",
            "from_sequence": 2,
            "to_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "to_stop_name_si": "කළුතර",
            "to_stop_name_en": "Kalutara",
            "to_stop_name_tm": "களுத்துறை",
            "to_sequence": 5,
            "full_amount_lkr": 190,
            "half_amount_lkr": 95,
            "distance_km": 56.1
          },
          {
            "id": "fare-ret-015",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "from_stop_name_si": "හික්කඩුව",
            "from_stop_name_en": "Hikkaduwa",
            "from_stop_name_tm": "ஹிக்கடுவ",
            "from_sequence": 2,
            "to_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "to_stop_name_si": "පානදුර",
            "to_stop_name_en": "Panadura",
            "to_stop_name_tm": "பாணந்துறை",
            "to_sequence": 6,
            "full_amount_lkr": 245,
            "half_amount_lkr": 123,
            "distance_km": 70.8
          },
          {
            "id": "fare-ret-016",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "from_stop_name_si": "හික්කඩුව",
            "from_stop_name_en": "Hikkaduwa",
            "from_stop_name_tm": "ஹிக்கடுவ",
            "from_sequence": 2,
            "to_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "to_stop_name_si": "මොරටුව",
            "to_stop_name_en": "Moratuwa",
            "to_stop_name_tm": "மொறட்டுவை",
            "to_sequence": 7,
            "full_amount_lkr": 280,
            "half_amount_lkr": 140,
            "distance_km": 79.5
          },
          {
            "id": "fare-ret-017",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "from_stop_name_si": "හික්කඩුව",
            "from_stop_name_en": "Hikkaduwa",
            "from_stop_name_tm": "ஹிக்கடுவ",
            "from_sequence": 2,
            "to_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "to_stop_name_si": "ගල්කිස්ස",
            "to_stop_name_en": "Mount Lavinia",
            "to_stop_name_tm": "மவுண்ட் லவீனியா",
            "to_sequence": 8,
            "full_amount_lkr": 300,
            "half_amount_lkr": 150,
            "distance_km": 84.4
          },
          {
            "id": "fare-ret-018",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "from_stop_name_si": "හික්කඩුව",
            "from_stop_name_en": "Hikkaduwa",
            "from_stop_name_tm": "ஹிக்கடுவ",
            "from_sequence": 2,
            "to_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "to_stop_name_si": "දෙහිවල",
            "to_stop_name_en": "Dehiwala",
            "to_stop_name_tm": "தெஹிவளை",
            "to_sequence": 9,
            "full_amount_lkr": 310,
            "half_amount_lkr": 155,
            "distance_km": 86.9
          },
          {
            "id": "fare-ret-019",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "from_stop_name_si": "හික්කඩුව",
            "from_stop_name_en": "Hikkaduwa",
            "from_stop_name_tm": "ஹிக்கடுவ",
            "from_sequence": 2,
            "to_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "to_stop_name_si": "වැල්ලවත්ත",
            "to_stop_name_en": "Wellawatte",
            "to_stop_name_tm": "வெல்லவத்தை",
            "to_sequence": 10,
            "full_amount_lkr": 315,
            "half_amount_lkr": 158,
            "distance_km": 89.7
          },
          {
            "id": "fare-ret-020",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "from_stop_name_si": "හික්කඩුව",
            "from_stop_name_en": "Hikkaduwa",
            "from_stop_name_tm": "ஹிக்கடுவ",
            "from_sequence": 2,
            "to_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "to_stop_name_si": "බම්බලපිටිය",
            "to_stop_name_en": "Bambalapitiya",
            "to_stop_name_tm": "பம்பலப்பிட்டி",
            "to_sequence": 11,
            "full_amount_lkr": 318,
            "half_amount_lkr": 159,
            "distance_km": 92
          },
          {
            "id": "fare-ret-021",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "de0d28eb-9d01-4fb2-a978-944ad93e252c",
            "from_stop_name_si": "හික්කඩුව",
            "from_stop_name_en": "Hikkaduwa",
            "from_stop_name_tm": "ஹிக்கடுவ",
            "from_sequence": 2,
            "to_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "to_stop_name_si": "කොළඹ කොටුව",
            "to_stop_name_en": "Colombo Fort",
            "to_stop_name_tm": "கொழும்பு கோட்டை",
            "to_sequence": 12,
            "full_amount_lkr": 320,
            "half_amount_lkr": 160,
            "distance_km": 98.2
          },
          {
            "id": "fare-ret-022",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "from_stop_name_si": "බේන්තොට",
            "from_stop_name_en": "Bentota",
            "from_stop_name_tm": "பெந்தோட்ட",
            "from_sequence": 3,
            "to_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "to_stop_name_si": "අලුත්ගම",
            "to_stop_name_en": "Aluthgama",
            "to_stop_name_tm": "அலுத்கம",
            "to_sequence": 4,
            "full_amount_lkr": 20,
            "half_amount_lkr": 10,
            "distance_km": 2.7
          },
          {
            "id": "fare-ret-023",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "from_stop_name_si": "බේන්තොට",
            "from_stop_name_en": "Bentota",
            "from_stop_name_tm": "பெந்தோட்ட",
            "from_sequence": 3,
            "to_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "to_stop_name_si": "කළුතර",
            "to_stop_name_en": "Kalutara",
            "to_stop_name_tm": "களுத்துறை",
            "to_sequence": 5,
            "full_amount_lkr": 80,
            "half_amount_lkr": 40,
            "distance_km": 22.9
          },
          {
            "id": "fare-ret-024",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "from_stop_name_si": "බේන්තොට",
            "from_stop_name_en": "Bentota",
            "from_stop_name_tm": "பெந்தோட்ட",
            "from_sequence": 3,
            "to_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "to_stop_name_si": "පානදුර",
            "to_stop_name_en": "Panadura",
            "to_stop_name_tm": "பாணந்துறை",
            "to_sequence": 6,
            "full_amount_lkr": 125,
            "half_amount_lkr": 63,
            "distance_km": 37.6
          },
          {
            "id": "fare-ret-025",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "from_stop_name_si": "බේන්තොට",
            "from_stop_name_en": "Bentota",
            "from_stop_name_tm": "பெந்தோட்ட",
            "from_sequence": 3,
            "to_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "to_stop_name_si": "මොරටුව",
            "to_stop_name_en": "Moratuwa",
            "to_stop_name_tm": "மொறட்டுவை",
            "to_sequence": 7,
            "full_amount_lkr": 160,
            "half_amount_lkr": 80,
            "distance_km": 46.3
          },
          {
            "id": "fare-ret-026",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "from_stop_name_si": "බේන්තොට",
            "from_stop_name_en": "Bentota",
            "from_stop_name_tm": "பெந்தோட்ட",
            "from_sequence": 3,
            "to_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "to_stop_name_si": "ගල්කිස්ස",
            "to_stop_name_en": "Mount Lavinia",
            "to_stop_name_tm": "மவுண்ட் லவீனியா",
            "to_sequence": 8,
            "full_amount_lkr": 180,
            "half_amount_lkr": 90,
            "distance_km": 51.2
          },
          {
            "id": "fare-ret-027",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "from_stop_name_si": "බේන්තොට",
            "from_stop_name_en": "Bentota",
            "from_stop_name_tm": "பெந்தோட்ட",
            "from_sequence": 3,
            "to_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "to_stop_name_si": "දෙහිවල",
            "to_stop_name_en": "Dehiwala",
            "to_stop_name_tm": "தெஹிவளை",
            "to_sequence": 9,
            "full_amount_lkr": 190,
            "half_amount_lkr": 95,
            "distance_km": 53.7
          },
          {
            "id": "fare-ret-028",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "from_stop_name_si": "බේන්තොට",
            "from_stop_name_en": "Bentota",
            "from_stop_name_tm": "பெந்தோட்ட",
            "from_sequence": 3,
            "to_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "to_stop_name_si": "වැල්ලවත්ත",
            "to_stop_name_en": "Wellawatte",
            "to_stop_name_tm": "வெல்லவத்தை",
            "to_sequence": 10,
            "full_amount_lkr": 195,
            "half_amount_lkr": 98,
            "distance_km": 56.5
          },
          {
            "id": "fare-ret-029",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "from_stop_name_si": "බේන්තොට",
            "from_stop_name_en": "Bentota",
            "from_stop_name_tm": "பெந்தோட்ட",
            "from_sequence": 3,
            "to_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "to_stop_name_si": "බම්බලපිටිය",
            "to_stop_name_en": "Bambalapitiya",
            "to_stop_name_tm": "பம்பலப்பிட்டி",
            "to_sequence": 11,
            "full_amount_lkr": 198,
            "half_amount_lkr": 99,
            "distance_km": 58.8
          },
          {
            "id": "fare-ret-030",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "from_stop_name_si": "බේන්තොට",
            "from_stop_name_en": "Bentota",
            "from_stop_name_tm": "பெந்தோட்ட",
            "from_sequence": 3,
            "to_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "to_stop_name_si": "කොළඹ කොටුව",
            "to_stop_name_en": "Colombo Fort",
            "to_stop_name_tm": "கொழும்பு கோட்டை",
            "to_sequence": 12,
            "full_amount_lkr": 200,
            "half_amount_lkr": 100,
            "distance_km": 65
          },
          {
            "id": "fare-ret-031",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "from_stop_name_si": "අලුත්ගම",
            "from_stop_name_en": "Aluthgama",
            "from_stop_name_tm": "அலுத்கம",
            "from_sequence": 4,
            "to_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "to_stop_name_si": "කළුතර",
            "to_stop_name_en": "Kalutara",
            "to_stop_name_tm": "களுத்துறை",
            "to_sequence": 5,
            "full_amount_lkr": 70,
            "half_amount_lkr": 35,
            "distance_km": 20.2
          },
          {
            "id": "fare-ret-032",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "from_stop_name_si": "අලුත්ගම",
            "from_stop_name_en": "Aluthgama",
            "from_stop_name_tm": "அலுத்கம",
            "from_sequence": 4,
            "to_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "to_stop_name_si": "පානදුර",
            "to_stop_name_en": "Panadura",
            "to_stop_name_tm": "பாணந்துறை",
            "to_sequence": 6,
            "full_amount_lkr": 115,
            "half_amount_lkr": 58,
            "distance_km": 34.9
          },
          {
            "id": "fare-ret-033",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "from_stop_name_si": "අලුත්ගම",
            "from_stop_name_en": "Aluthgama",
            "from_stop_name_tm": "அலுத்கம",
            "from_sequence": 4,
            "to_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "to_stop_name_si": "මොරටුව",
            "to_stop_name_en": "Moratuwa",
            "to_stop_name_tm": "மொறட்டுவை",
            "to_sequence": 7,
            "full_amount_lkr": 150,
            "half_amount_lkr": 75,
            "distance_km": 43.6
          },
          {
            "id": "fare-ret-034",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "from_stop_name_si": "අලුත්ගම",
            "from_stop_name_en": "Aluthgama",
            "from_stop_name_tm": "அலுத்கம",
            "from_sequence": 4,
            "to_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "to_stop_name_si": "ගල්කිස්ස",
            "to_stop_name_en": "Mount Lavinia",
            "to_stop_name_tm": "மவுண்ட் லவீனியா",
            "to_sequence": 8,
            "full_amount_lkr": 170,
            "half_amount_lkr": 85,
            "distance_km": 48.5
          },
          {
            "id": "fare-ret-035",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "from_stop_name_si": "අලුත්ගම",
            "from_stop_name_en": "Aluthgama",
            "from_stop_name_tm": "அலுத்கம",
            "from_sequence": 4,
            "to_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "to_stop_name_si": "දෙහිවල",
            "to_stop_name_en": "Dehiwala",
            "to_stop_name_tm": "தெஹிவளை",
            "to_sequence": 9,
            "full_amount_lkr": 180,
            "half_amount_lkr": 90,
            "distance_km": 51
          },
          {
            "id": "fare-ret-036",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "from_stop_name_si": "අලුත්ගම",
            "from_stop_name_en": "Aluthgama",
            "from_stop_name_tm": "அலுத்கம",
            "from_sequence": 4,
            "to_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "to_stop_name_si": "වැල්ලවත්ත",
            "to_stop_name_en": "Wellawatte",
            "to_stop_name_tm": "வெல்லவத்தை",
            "to_sequence": 10,
            "full_amount_lkr": 185,
            "half_amount_lkr": 93,
            "distance_km": 53.8
          },
          {
            "id": "fare-ret-037",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "from_stop_name_si": "අලුත්ගම",
            "from_stop_name_en": "Aluthgama",
            "from_stop_name_tm": "அலுத்கம",
            "from_sequence": 4,
            "to_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "to_stop_name_si": "බම්බලපිටිය",
            "to_stop_name_en": "Bambalapitiya",
            "to_stop_name_tm": "பம்பலப்பிட்டி",
            "to_sequence": 11,
            "full_amount_lkr": 188,
            "half_amount_lkr": 94,
            "distance_km": 56.1
          },
          {
            "id": "fare-ret-038",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "877c681d-753f-4b45-88f4-401ef86c35bf",
            "from_stop_name_si": "අලුත්ගම",
            "from_stop_name_en": "Aluthgama",
            "from_stop_name_tm": "அலுத்கம",
            "from_sequence": 4,
            "to_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "to_stop_name_si": "කොළඹ කොටුව",
            "to_stop_name_en": "Colombo Fort",
            "to_stop_name_tm": "கொழும்பு கோட்டை",
            "to_sequence": 12,
            "full_amount_lkr": 190,
            "half_amount_lkr": 95,
            "distance_km": 62.3
          },
          {
            "id": "fare-ret-039",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "from_stop_name_si": "කළුතර",
            "from_stop_name_en": "Kalutara",
            "from_stop_name_tm": "களுத்துறை",
            "from_sequence": 5,
            "to_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "to_stop_name_si": "පානදුර",
            "to_stop_name_en": "Panadura",
            "to_stop_name_tm": "பாணந்துறை",
            "to_sequence": 6,
            "full_amount_lkr": 55,
            "half_amount_lkr": 28,
            "distance_km": 14.7
          },
          {
            "id": "fare-ret-040",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "from_stop_name_si": "කළුතර",
            "from_stop_name_en": "Kalutara",
            "from_stop_name_tm": "களுத்துறை",
            "from_sequence": 5,
            "to_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "to_stop_name_si": "මොරටුව",
            "to_stop_name_en": "Moratuwa",
            "to_stop_name_tm": "மொறட்டுவை",
            "to_sequence": 7,
            "full_amount_lkr": 90,
            "half_amount_lkr": 45,
            "distance_km": 23.4
          },
          {
            "id": "fare-ret-041",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "from_stop_name_si": "කළුතර",
            "from_stop_name_en": "Kalutara",
            "from_stop_name_tm": "களுத்துறை",
            "from_sequence": 5,
            "to_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "to_stop_name_si": "ගල්කිස්ස",
            "to_stop_name_en": "Mount Lavinia",
            "to_stop_name_tm": "மவுண்ட் லவீனியா",
            "to_sequence": 8,
            "full_amount_lkr": 110,
            "half_amount_lkr": 55,
            "distance_km": 28.3
          },
          {
            "id": "fare-ret-042",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "from_stop_name_si": "කළුතර",
            "from_stop_name_en": "Kalutara",
            "from_stop_name_tm": "களுத்துறை",
            "from_sequence": 5,
            "to_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "to_stop_name_si": "දෙහිවල",
            "to_stop_name_en": "Dehiwala",
            "to_stop_name_tm": "தெஹிவளை",
            "to_sequence": 9,
            "full_amount_lkr": 120,
            "half_amount_lkr": 60,
            "distance_km": 30.8
          },
          {
            "id": "fare-ret-043",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "from_stop_name_si": "කළුතර",
            "from_stop_name_en": "Kalutara",
            "from_stop_name_tm": "களுத்துறை",
            "from_sequence": 5,
            "to_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "to_stop_name_si": "වැල්ලවත්ත",
            "to_stop_name_en": "Wellawatte",
            "to_stop_name_tm": "வெல்லவத்தை",
            "to_sequence": 10,
            "full_amount_lkr": 125,
            "half_amount_lkr": 63,
            "distance_km": 33.6
          },
          {
            "id": "fare-ret-044",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "from_stop_name_si": "කළුතර",
            "from_stop_name_en": "Kalutara",
            "from_stop_name_tm": "களுத்துறை",
            "from_sequence": 5,
            "to_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "to_stop_name_si": "බම්බලපිටිය",
            "to_stop_name_en": "Bambalapitiya",
            "to_stop_name_tm": "பம்பலப்பிட்டி",
            "to_sequence": 11,
            "full_amount_lkr": 128,
            "half_amount_lkr": 64,
            "distance_km": 35.9
          },
          {
            "id": "fare-ret-045",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "b88bdf90-94a3-4aaa-861a-100d0ae16a92",
            "from_stop_name_si": "කළුතර",
            "from_stop_name_en": "Kalutara",
            "from_stop_name_tm": "களுத்துறை",
            "from_sequence": 5,
            "to_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "to_stop_name_si": "කොළඹ කොටුව",
            "to_stop_name_en": "Colombo Fort",
            "to_stop_name_tm": "கொழும்பு கோட்டை",
            "to_sequence": 12,
            "full_amount_lkr": 130,
            "half_amount_lkr": 65,
            "distance_km": 42.1
          },
          {
            "id": "fare-ret-046",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "from_stop_name_si": "පානදුර",
            "from_stop_name_en": "Panadura",
            "from_stop_name_tm": "பாணந்துறை",
            "from_sequence": 6,
            "to_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "to_stop_name_si": "මොරටුව",
            "to_stop_name_en": "Moratuwa",
            "to_stop_name_tm": "மொறட்டுவை",
            "to_sequence": 7,
            "full_amount_lkr": 40,
            "half_amount_lkr": 20,
            "distance_km": 8.7
          },
          {
            "id": "fare-ret-047",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "from_stop_name_si": "පානදුර",
            "from_stop_name_en": "Panadura",
            "from_stop_name_tm": "பாணந்துறை",
            "from_sequence": 6,
            "to_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "to_stop_name_si": "ගල්කිස්ස",
            "to_stop_name_en": "Mount Lavinia",
            "to_stop_name_tm": "மவுண்ட் லவீனியா",
            "to_sequence": 8,
            "full_amount_lkr": 60,
            "half_amount_lkr": 30,
            "distance_km": 13.6
          },
          {
            "id": "fare-ret-048",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "from_stop_name_si": "පානදුර",
            "from_stop_name_en": "Panadura",
            "from_stop_name_tm": "பாணந்துறை",
            "from_sequence": 6,
            "to_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "to_stop_name_si": "දෙහිවල",
            "to_stop_name_en": "Dehiwala",
            "to_stop_name_tm": "தெஹிவளை",
            "to_sequence": 9,
            "full_amount_lkr": 70,
            "half_amount_lkr": 35,
            "distance_km": 16.1
          },
          {
            "id": "fare-ret-049",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "from_stop_name_si": "පානදුර",
            "from_stop_name_en": "Panadura",
            "from_stop_name_tm": "பாணந்துறை",
            "from_sequence": 6,
            "to_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "to_stop_name_si": "වැල්ලවත්ත",
            "to_stop_name_en": "Wellawatte",
            "to_stop_name_tm": "வெல்லவத்தை",
            "to_sequence": 10,
            "full_amount_lkr": 75,
            "half_amount_lkr": 38,
            "distance_km": 18.9
          },
          {
            "id": "fare-ret-050",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "from_stop_name_si": "පානදුර",
            "from_stop_name_en": "Panadura",
            "from_stop_name_tm": "பாணந்துறை",
            "from_sequence": 6,
            "to_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "to_stop_name_si": "බම්බලපිටිය",
            "to_stop_name_en": "Bambalapitiya",
            "to_stop_name_tm": "பம்பலப்பிட்டி",
            "to_sequence": 11,
            "full_amount_lkr": 78,
            "half_amount_lkr": 39,
            "distance_km": 21.2
          },
          {
            "id": "fare-ret-051",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "575bbc55-d106-45b0-b278-6f4e587d3d65",
            "from_stop_name_si": "පානදුර",
            "from_stop_name_en": "Panadura",
            "from_stop_name_tm": "பாணந்துறை",
            "from_sequence": 6,
            "to_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "to_stop_name_si": "කොළඹ කොටුව",
            "to_stop_name_en": "Colombo Fort",
            "to_stop_name_tm": "கொழும்பு கோட்டை",
            "to_sequence": 12,
            "full_amount_lkr": 80,
            "half_amount_lkr": 40,
            "distance_km": 27.4
          },
          {
            "id": "fare-ret-052",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "from_stop_name_si": "මොරටුව",
            "from_stop_name_en": "Moratuwa",
            "from_stop_name_tm": "மொறட்டுவை",
            "from_sequence": 7,
            "to_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "to_stop_name_si": "ගල්කිස්ස",
            "to_stop_name_en": "Mount Lavinia",
            "to_stop_name_tm": "மவுண்ட் லவீனியா",
            "to_sequence": 8,
            "full_amount_lkr": 25,
            "half_amount_lkr": 13,
            "distance_km": 4.9
          },
          {
            "id": "fare-ret-053",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "from_stop_name_si": "මොරටුව",
            "from_stop_name_en": "Moratuwa",
            "from_stop_name_tm": "மொறட்டுவை",
            "from_sequence": 7,
            "to_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "to_stop_name_si": "දෙහිවල",
            "to_stop_name_en": "Dehiwala",
            "to_stop_name_tm": "தெஹிவளை",
            "to_sequence": 9,
            "full_amount_lkr": 35,
            "half_amount_lkr": 18,
            "distance_km": 7.4
          },
          {
            "id": "fare-ret-054",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "from_stop_name_si": "මොරටුව",
            "from_stop_name_en": "Moratuwa",
            "from_stop_name_tm": "மொறட்டுவை",
            "from_sequence": 7,
            "to_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "to_stop_name_si": "වැල්ලවත්ත",
            "to_stop_name_en": "Wellawatte",
            "to_stop_name_tm": "வெல்லவத்தை",
            "to_sequence": 10,
            "full_amount_lkr": 45,
            "half_amount_lkr": 23,
            "distance_km": 10.2
          },
          {
            "id": "fare-ret-055",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "from_stop_name_si": "මොරටුව",
            "from_stop_name_en": "Moratuwa",
            "from_stop_name_tm": "மொறட்டுவை",
            "from_sequence": 7,
            "to_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "to_stop_name_si": "බම්බලපිටිය",
            "to_stop_name_en": "Bambalapitiya",
            "to_stop_name_tm": "பம்பலப்பிட்டி",
            "to_sequence": 11,
            "full_amount_lkr": 48,
            "half_amount_lkr": 24,
            "distance_km": 12.5
          },
          {
            "id": "fare-ret-056",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "b55d9f96-855e-4437-bb6b-37b6199ac145",
            "from_stop_name_si": "මොරටුව",
            "from_stop_name_en": "Moratuwa",
            "from_stop_name_tm": "மொறட்டுவை",
            "from_sequence": 7,
            "to_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "to_stop_name_si": "කොළඹ කොටුව",
            "to_stop_name_en": "Colombo Fort",
            "to_stop_name_tm": "கொழும்பு கோட்டை",
            "to_sequence": 12,
            "full_amount_lkr": 50,
            "half_amount_lkr": 25,
            "distance_km": 18.7
          },
          {
            "id": "fare-ret-057",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "from_stop_name_si": "ගල්කිස්ස",
            "from_stop_name_en": "Mount Lavinia",
            "from_stop_name_tm": "மவுண்ட் லவீனியா",
            "from_sequence": 8,
            "to_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "to_stop_name_si": "දෙහිවල",
            "to_stop_name_en": "Dehiwala",
            "to_stop_name_tm": "தெஹிவளை",
            "to_sequence": 9,
            "full_amount_lkr": 20,
            "half_amount_lkr": 10,
            "distance_km": 2.5
          },
          {
            "id": "fare-ret-058",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "from_stop_name_si": "ගල්කිස්ස",
            "from_stop_name_en": "Mount Lavinia",
            "from_stop_name_tm": "மவுண்ட் லவீனியா",
            "from_sequence": 8,
            "to_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "to_stop_name_si": "වැල්ලවත්ත",
            "to_stop_name_en": "Wellawatte",
            "to_stop_name_tm": "வெல்லவத்தை",
            "to_sequence": 10,
            "full_amount_lkr": 30,
            "half_amount_lkr": 15,
            "distance_km": 5.3
          },
          {
            "id": "fare-ret-059",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "from_stop_name_si": "ගල්කිස්ස",
            "from_stop_name_en": "Mount Lavinia",
            "from_stop_name_tm": "மவுண்ட் லவீனியா",
            "from_sequence": 8,
            "to_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "to_stop_name_si": "බම්බලපිටිය",
            "to_stop_name_en": "Bambalapitiya",
            "to_stop_name_tm": "பம்பலப்பிட்டி",
            "to_sequence": 11,
            "full_amount_lkr": 35,
            "half_amount_lkr": 18,
            "distance_km": 7.6
          },
          {
            "id": "fare-ret-060",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "6ab6fcb3-f41c-444c-87d2-5c271dd2bd4c",
            "from_stop_name_si": "ගල්කිස්ස",
            "from_stop_name_en": "Mount Lavinia",
            "from_stop_name_tm": "மவுண்ட் லவீனியா",
            "from_sequence": 8,
            "to_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "to_stop_name_si": "කොළඹ කොටුව",
            "to_stop_name_en": "Colombo Fort",
            "to_stop_name_tm": "கொழும்பு கோட்டை",
            "to_sequence": 12,
            "full_amount_lkr": 75,
            "half_amount_lkr": 38,
            "distance_km": 13.8
          },
          {
            "id": "fare-ret-061",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "from_stop_name_si": "දෙහිවල",
            "from_stop_name_en": "Dehiwala",
            "from_stop_name_tm": "தெஹிவளை",
            "from_sequence": 9,
            "to_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "to_stop_name_si": "වැල්ලවත්ත",
            "to_stop_name_en": "Wellawatte",
            "to_stop_name_tm": "வெல்லவத்தை",
            "to_sequence": 10,
            "full_amount_lkr": 20,
            "half_amount_lkr": 10,
            "distance_km": 2.8
          },
          {
            "id": "fare-ret-062",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "from_stop_name_si": "දෙහිවල",
            "from_stop_name_en": "Dehiwala",
            "from_stop_name_tm": "தெஹிவளை",
            "from_sequence": 9,
            "to_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "to_stop_name_si": "බම්බලපිටිය",
            "to_stop_name_en": "Bambalapitiya",
            "to_stop_name_tm": "பம்பலப்பிட்டி",
            "to_sequence": 11,
            "full_amount_lkr": 25,
            "half_amount_lkr": 13,
            "distance_km": 5.1
          },
          {
            "id": "fare-ret-063",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "6c96a496-4242-4709-ad5b-7df0488dc89d",
            "from_stop_name_si": "දෙහිවල",
            "from_stop_name_en": "Dehiwala",
            "from_stop_name_tm": "தெஹிவளை",
            "from_sequence": 9,
            "to_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "to_stop_name_si": "කොළඹ කොටුව",
            "to_stop_name_en": "Colombo Fort",
            "to_stop_name_tm": "கொழும்பு கோட்டை",
            "to_sequence": 12,
            "full_amount_lkr": 60,
            "half_amount_lkr": 30,
            "distance_km": 11.3
          },
          {
            "id": "fare-ret-064",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "from_stop_name_si": "වැල්ලවත්ත",
            "from_stop_name_en": "Wellawatte",
            "from_stop_name_tm": "வெல்லவத்தை",
            "from_sequence": 10,
            "to_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "to_stop_name_si": "බම්බලපිටිය",
            "to_stop_name_en": "Bambalapitiya",
            "to_stop_name_tm": "பம்பலப்பிட்டி",
            "to_sequence": 11,
            "full_amount_lkr": 20,
            "half_amount_lkr": 10,
            "distance_km": 2.3
          },
          {
            "id": "fare-ret-065",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
            "from_stop_name_si": "වැල්ලවත්ත",
            "from_stop_name_en": "Wellawatte",
            "from_stop_name_tm": "வெல்லவத்தை",
            "from_sequence": 10,
            "to_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "to_stop_name_si": "කොළඹ කොටුව",
            "to_stop_name_en": "Colombo Fort",
            "to_stop_name_tm": "கொழும்பு கோட்டை",
            "to_sequence": 12,
            "full_amount_lkr": 50,
            "half_amount_lkr": 25,
            "distance_km": 8.5
          },
          {
            "id": "fare-ret-066",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            "from_stop_name_si": "බම්බලපිටිය",
            "from_stop_name_en": "Bambalapitiya",
            "from_stop_name_tm": "பம்பலப்பிட்டி",
            "from_sequence": 11,
            "to_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "to_stop_name_si": "කොළඹ කොටුව",
            "to_stop_name_en": "Colombo Fort",
            "to_stop_name_tm": "கொழும்பு கோட்டை",
            "to_sequence": 12,
            "full_amount_lkr": 40,
            "half_amount_lkr": 20,
            "distance_km": 6.2
          }
        ],
        "special_fares": [
          {
            "id": "special-fare-fwd-001",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "from_stop_name_si": "කොළඹ කොටුව",
            "from_stop_name_en": "Colombo Fort",
            "from_stop_name_tm": "கொழும்பு கோட்டை",
            "from_sequence": 1,
            "to_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "to_stop_name_si": "ගාල්ල",
            "to_stop_name_en": "Galle",
            "to_stop_name_tm": "காலி",
            "to_sequence": 12,
            "full_amount_lkr": 450,
            "half_amount_lkr": 225,
            "distance_km": 116.8,
            "start_date": "2025-04-13",
            "end_date": "2025-04-15",
            "description": "Sinhala & Tamil New Year Special Pricing",
            "is_active": false
          },
          {
            "id": "special-fare-fwd-002",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "from_stop_name_si": "කොළඹ කොටුව",
            "from_stop_name_en": "Colombo Fort",
            "from_stop_name_tm": "கொழும்பு கோட்டை",
            "from_sequence": 1,
            "to_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "to_stop_name_si": "බේන්තොට",
            "to_stop_name_en": "Bentota",
            "to_stop_name_tm": "பெந்தோட்ட",
            "to_sequence": 10,
            "full_amount_lkr": 280,
            "half_amount_lkr": 140,
            "distance_km": 65,
            "start_date": "2025-12-20",
            "end_date": "2026-01-05",
            "description": "Christmas & New Year Holiday Surcharge",
            "is_active": false
          },
          {
            "id": "special-fare-fwd-003",
            "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
            "from_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "from_stop_name_si": "කොළඹ කොටුව",
            "from_stop_name_en": "Colombo Fort",
            "from_stop_name_tm": "கொழும்பு கோட்டை",
            "from_sequence": 1,
            "to_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "to_stop_name_si": "ගාල්ල",
            "to_stop_name_en": "Galle",
            "to_stop_name_tm": "காலி",
            "to_sequence": 12,
            "full_amount_lkr": 320,
            "half_amount_lkr": 160,
            "distance_km": 116.8,
            "start_date": "2025-10-15",
            "end_date": "2025-11-15",
            "description": "Off-Season Discount - October/November",
            "is_active": true
          },
          {
            "id": "special-fare-ret-001",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            "from_stop_name_si": "ගාල්ල",
            "from_stop_name_en": "Galle",
            "from_stop_name_tm": "காலி",
            "from_sequence": 1,
            "to_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "to_stop_name_si": "කොළඹ කොටුව",
            "to_stop_name_en": "Colombo Fort",
            "to_stop_name_tm": "கொழும்பு கோட்டை",
            "to_sequence": 12,
            "full_amount_lkr": 350,
            "half_amount_lkr": 175,
            "distance_km": 116.8,
            "start_date": "2025-10-15",
            "end_date": "2025-11-15",
            "description": "Off-Season Return Discount - October/November",
            "is_active": true
          },
          {
            "id": "special-fare-ret-002",
            "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
            "from_stop_id": "38d0899c-e1c9-43a1-944d-5b31cef4bad8",
            "from_stop_name_si": "බේන්තොට",
            "from_stop_name_en": "Bentota",
            "from_stop_name_tm": "பெந்தோட்ட",
            "from_sequence": 3,
            "to_stop_id": "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            "to_stop_name_si": "කොළඹ කොටුව",
            "to_stop_name_en": "Colombo Fort",
            "to_stop_name_tm": "கொழும்பு கோட்டை",
            "to_sequence": 12,
            "full_amount_lkr": 200,
            "half_amount_lkr": 100,
            "distance_km": 65,
            "start_date": "2025-05-01",
            "end_date": "2025-09-30",
            "description": "Monsoon Season Discount - May to September",
            "is_active": false
          }
        ],
        "special_fare_date_ranges": [
          {
            "start_date": "2025-04-13",
            "end_date": "2025-04-15",
            "description": "Sinhala & Tamil New Year Special Pricing",
            "is_active": false
          },
          {
            "start_date": "2025-05-01",
            "end_date": "2025-09-30",
            "description": "Monsoon Season Discount - May to September",
            "is_active": false
          },
          {
            "start_date": "2025-10-15",
            "end_date": "2025-11-15",
            "description": "Off-Season Discount - October/November",
            "is_active": true
          },
          {
            "start_date": "2025-12-20",
            "end_date": "2026-01-05",
            "description": "Christmas & New Year Holiday Surcharge",
            "is_active": false
          }
        ],
        "metadata": {
          "total_directions": 2,
          "total_fares": 132,
          "total_special_fares": 5,
          "direction_summaries": [
            {
              "direction_id": "4e18a51e-d67a-499f-a30a-3535d99ff469",
              "start_location": "Colombo Fort",
              "end_location": "Galle",
              "total_stops": 12,
              "total_fares": 66,
              "total_special_fares": 3,
              "active_special_fares": 1
            },
            {
              "direction_id": "912db840-d947-4a54-957c-cd6096a8321e",
              "start_location": "Galle",
              "end_location": "Colombo Fort",
              "total_stops": 12,
              "total_fares": 66,
              "total_special_fares": 2,
              "active_special_fares": 1
            }
          ],
          "has_active_special_fares": true,
          "retrieved_at": "2025-11-03T14:35:22Z"
        }
      },
      "meta": {
        "timestamp": 1730643322,
        "request_id": "46d58ee1-d00b-4eb1-9d3d-f4e0771bc6ec"
      }
    }
    return response.data;
  }




  // async createUser(token: string, userData: Omit<User, 'id' | 'status'>): Promise<User> {
  //   // await new Promise(resolve => setTimeout(resolve, 500));

  //   return {
  //     id: Date.now(),
  //     ...userData,
  //     status: 'active'
  //   };

  //   // Real API call:
  //   // const response = await fetch(`${API_BASE_URL}/users`, {
  //   //   method: 'POST',
  //   //   headers: this.getHeaders(token),
  //   //   body: JSON.stringify(userData),
  //   // });
  //   // if (!response.ok) throw new Error('Failed to create user');
  //   // return response.json();
  // }

  // async updateUser(token: string, id: number, userData: Partial<User>): Promise<User> {
  //   // await new Promise(resolve => setTimeout(resolve, 500));

  //   return {
  //     ...userData as User,
  //     id
  //   };

  //   // Real API call:
  //   // const response = await fetch(`${API_BASE_URL}/users/${id}`, {
  //   //   method: 'PUT',
  //   //   headers: this.getHeaders(token),
  //   //   body: JSON.stringify(userData),
  //   // });
  //   // if (!response.ok) throw new Error('Failed to update user');
  //   // return response.json();
  // }

  async deleteUser(token: string, id: number): Promise<void> {
    // await new Promise(resolve => setTimeout(resolve, 500));

    // Real API call:
    // const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    //   method: 'DELETE',
    //   headers: this.getHeaders(token),
    // });
    // if (!response.ok) throw new Error('Failed to delete user');
  }
}

export const apiService = new ApiService();