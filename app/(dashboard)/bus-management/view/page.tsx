'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bus, Calendar, Users, Settings, MapPin, Edit, Plus, Trash2, CheckCircle2, ArrowLeftRight, RockingChair, UserCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BusManagementCard } from '@/components/bus-management/bus-card';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { useNavbar } from "@/context/navbar-context"
import { useSearchParams } from 'next/navigation';
import { CreateAssignmentPayload } from '@/types/route';
import { User, CreateCrewAssignment } from '@/types/user';
import { MdOnDeviceTraining } from "react-icons/md";
import { Company } from '@/types/company';

interface Bus {
    id: string;
    company_id: string;
    registration_number: string;
    fleet_number: string;
    model: string;
    manufacturer: string;
    year_of_manufacture: number;
    seating_capacity: number;
    standing_capacity: number;
    status: string;
    created_at: string;
    updated_at: string;
    is_operational: boolean;
    is_in_maintenance: boolean;
    is_retired: boolean;
    is_decommissioned: boolean;
    total_capacity: number;
    age: number;
}

interface Route {
    id: string;
    code: string;
    name: string;
    status: string;
}

interface RouteAssignment {
    id: string;
    route: Route;
    route_code?: string;
    route_name?: string;
    assigned_date: string;
    removed_date?: string;
    status: string;
}
interface AllAssignment {
    bus: Bus,
    route_assignments: RouteAssignment
    crew_assignments: any[]
}

interface EditAssignmentPayload {
    assigned_date: string;
    removed_date: string;
    status: string;
    id: any
}
// interface User {
//     id: string;
//     name: string;
//     email: string;
//     user_type: 'driver' | 'conductor';
// }

interface CrewAssignment {
    id: string;
    user: User;
    bus_id: string,
    user_id: string,
    first_name: string,
    last_name: string,
    user_type: string
    assigned_date: string;
    status: string;
}


export const dynamic = 'force-dynamic';

const BusDetailsView: React.FC = () => {
    // Mock data


    // const availableRoutes: Route[] = [
    //     { id: "a3924555-16dc-4ae8-9982-4237c6ac3eca", code: "R001", name: "Colombo - Negombo Express", status: "active" },
    //     { id: "route-2", code: "R002", name: "Negombo - Katunayake", status: "active" },
    //     { id: "route-3", code: "R003", name: "Colombo - Kandy Highway", status: "active" },
    //     { id: "route-4", code: "R004", name: "Galle - Matara Coastal", status: "active" }
    // ];
    const [Organisation_ID, setOrganisationId] = useState<string | null>(null);
    const [COMPANY_ID, setCompanyId] = useState<string | null>(null);

    const [assignments, setAssignments] = useState<RouteAssignment[]>([]);
    const { token } = useAuth();
    const [companyData, setCompanyData] = useState<Company | null>(null);
    const [errorRouteAssing, setErrorRouteAssing] = useState('');
    const [errorCrewAssing, setErrorCrewAssing] = useState('');
    const [errorDevicesAssing, setErrorDevicesAssing] = useState('');
    const { setNavbarData } = useNavbar();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isEditCrewOpen, setIsEditCrewOpen] = useState(false);
    const [busData, setBusData] = useState<Bus | null>(null);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<RouteAssignment | null>(null);
    const [selectedCrewAssignment, setSelectedCrewAssignment] = useState<CrewAssignment | null>(null);
    const [isAssignCrewOpen, setIsAssignCrewOpen] = useState(false);
    const [isAssignCompanyOpen, setIsAssignCompanyOpen] = useState(false);
    const [editCrewForm, setEditCrewForm] = useState({ id: "", assigned_date: "", status: "active" });
    const [busCompany, setBusCompany] = useState('');
    const [crewAssignments, setCrewAssignments] = useState<CrewAssignment[]>([]);
    const [comapanyAssignments, setComapanyAssignments] = useState<CrewAssignment[]>([]);
    const [devicesAssignments, setDevicesAssignments] = useState<any>(null);
    const [availableRoutes, setAvailableRoutes] = useState<any[]>([]);
    const [availableUsers, setavailableUsers] = useState<any[]>([]);
    const [availableDevices, setAvailableDevices] = useState<any[]>([]);
    const [editForm, setEditForm] = useState<EditAssignmentPayload>({
        id: "",
        assigned_date: "",
        removed_date: "",
        status: "active"
    });
    const [filters, setFilters] = useState<any>({
        company_id: COMPANY_ID,

    });
    const [companyFilters, setCompanyFilters] = useState<any>({
        company_id: COMPANY_ID,

    });
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [assignForm, setAssignForm] = useState<CreateAssignmentPayload>({
        bus_id: busData ? (id ?? "") : (""),
        route_id: "",
        assigned_date: new Date().toISOString().split('T')[0]
    });

    const [assignCrewForm, setAssignCrewForm] = useState({
        bus_id: busData ? (id ?? "") : (""),
        user_id: "",
        assigned_date: new Date().toISOString().split('T')[0]
    });
    const [assignDevicesForm, setAssignDevicesForm] = useState({
        bus_id: busData ? (id ?? "") : (""),
    });
   useEffect(() => {
    // Skip during build
    if (typeof window === 'undefined') return;
    
    setNavbarData("Bus Management", "Bus Management/ View");
    
    const searchId = id ?? "";
    if (searchId) {
        fetchBusById(searchId);
        fetchBusAllAssimnet(searchId);
    }
    
    setErrorCrewAssing('');
    
    try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const parsed = JSON.parse(userStr);
            const orgId = parsed.organisation_id || null;
            const compId = parsed.company_id || null;
            
            setOrganisationId(orgId);
            setCompanyId(compId);
            
            setFilters((prev: any) => ({ ...prev, company_id: compId }));
            setCompanyFilters((prev: any) => ({ ...prev, company_id: compId }));
        }
    } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
    }
}, [id, token, setNavbarData]);


    const fetchUsers = async (filterData: any) => {
        if (!token) return;

        try {

            const data = await apiService.getUsersWithFilters(token, null, filterData);
            const busesArray = data || [];
            setavailableUsers(busesArray.data)

        } catch (err) {
            console.error('Failed to fetch bus', err);
        } finally {
            // setLoading(false);
        }

    }
    const fetchDevices = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            //setLoading(true)
            const data = await apiService.getDevicesCompanyWithFilters(token, null, filterData);
            const busesArray = data || [];
            setAvailableDevices(busesArray.data);
        } catch (err) {
            console.error('Failed to fetch bus', err);
        } finally {
            //setLoading(false);
        }

    }
    const fetchRoute = async (filterData: any) => {
        if (!token) return;
        try {


            const data = await apiService.getRouteWithFilters(token, null, filterData);
            const busesArray = data.routes;
            setAvailableRoutes(busesArray)
        } catch (err) {
            console.error('Route  d', err);
        } finally {
            //  setLoading(false);
        }

    }
    const fetchBusById = async (id: string) => {
        if (!token) return;
        try {
            const data = await apiService.getBusById(token, id);
            setBusCompany(data.company_id)
            setBusData(data)
            filters.company_id = data.company_id
            filters.limit=100

            fetchRoute(filters);
            fetchUsers(filters);
            fetchDevices(filters)
            fetchCompanyGetById(data.company_id);
            setDevicesAssignments(data.device)

        } catch (err) {
            console.error('Failed to fetch bus', err);
        } finally {

        }
    }
    const fetchCompanyGetById = async (id: string) => {
        if (!token) return;
        try {
            const data = await apiService.getCompanyById(token, id);
            setCompanyData(data);

        } catch (err) {
            console.error('Failed to fetch bus', err);
        } finally {

        }
    }
    const fetchBusAllAssimnet = async (id: string) => {
        if (!token) return;
        try {
            const data = await apiService.getBusRouteassignments(token, id);
            setAssignments(data.route_assignments)
            setCrewAssignments(data.crew_assignments)

        } catch (err) {
            console.error('Failed to fetch bus', err);
        } finally {

        }
    }
    const handleAssignDevices = async () => {
        console.log(assignDevicesForm, "assignDevicesFormassignDevicesForm")

        const createFormData: any = {
            bus_id: id
        }
        if (!token) return;

        try {
            const data = await apiService.deviceAssignmentToBus(token, assignDevicesForm.bus_id ?? "", createFormData);

        } catch (err: any) {
            console.error('Failed to fetch bus', err);
            setErrorDevicesAssing(err.message)
        } finally {

        }
        console.log(createFormData)
        setIsAssignCompanyOpen(false);
        setAssignCrewForm({ bus_id: busData?.id ?? "", user_id: "", assigned_date: new Date().toISOString().split('T')[0] });


    };
    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            operational: "bg-green-100 text-green-800 border-green-200",
            maintenance: "bg-yellow-100 text-yellow-800 border-yellow-200",
            retired: "bg-gray-100 text-gray-800 border-gray-200",
            active: "bg-green-600 text-white border-green-200",
            inactive: "bg-gray-100 text-gray-800 border-gray-200",
            suspended: "bg-red-100 text-red-800 border-red-200"
        };
        return variants[status] || "bg-gray-100 text-gray-800 border-gray-200";
    };
    const getUserTypeBadge = (userType: string) => {
        const variants: Record<string, string> = {
            driver: "bg-blue-600 text-blue-800",
            conductor: "bg-purple-600 text-purple-800"
        };
        return variants[userType] || "bg-gray-100 text-gray-800";
    };

    const activeAssignment = assignments.find(a => a.status === 'active');
    const hasActiveAssignment = !!activeAssignment;

    const handleEditAssignment = async () => {
        if (!selectedAssignment) return;

        // If changing to active, deactivate all other assignments
        if (editForm.status === 'active') {
            setAssignments(assignments.map(a => ({
                ...a,
                status: a.id === selectedAssignment.id ? 'active' : 'inactive'
            })));
        }



        console.log("Edit assignment:", editForm);
        if (!token) return;
        try {
            const data = await apiService.updateRouteAssignment(token, editForm);
            //setBusData(data)
            console.log(data, "updateRouteAssignment")
            fetchBusAllAssimnet(id ?? "")
             setIsEditOpen(false);
             setErrorRouteAssing('')
        } catch (err: any) {
            console.error('Failed to fetch bus', err);
            setErrorRouteAssing(err.message);
        } finally {

        }
       
        setSelectedAssignment(null);
    };

    const handleAssignRoute = async () => {
        const selectedRoute = availableRoutes.find(r => r.id === assignForm.route_id);
        if (!selectedRoute) return;

        const newAssignment: RouteAssignment = {
            id: `assign-${Date.now()}`,
            route: selectedRoute,
            assigned_date: assignForm.assigned_date,
            status: hasActiveAssignment ? 'inactive' : 'active'
        };

        // If this is the first assignment or no active assignment exists, make it active
        // Otherwise, deactivate all others if this should be active
        // if (!hasActiveAssignment) {
        //     setAssignments([...assignments, newAssignment]);
        // } else {
        //     setAssignments([...assignments, newAssignment]);
        // }

        console.log("Assign route:", assignForm);
        assignForm.bus_id = busData?.id ?? "";
        if (!token) return;
        try {
            const data = await apiService.routeAssignmentToBus(token, assignForm);
            //setBusData(data)
            console.log(data, "sTyTyTytytYtYtyTyTYtYtYTY")
            fetchBusAllAssimnet(id ?? "")
            setIsAssignOpen(false);
            setErrorRouteAssing('')
        } catch (err: any) {
            console.error('Failed to fetch bus', err);
            setErrorRouteAssing(err.message);
        } finally {

        }
        
        setAssignForm({
            bus_id: busData?.id ?? "",
            route_id: "",
            assigned_date: new Date().toISOString().split('T')[0]
        });
    };

    const handleRemoveAssignment = (assignmentId: string) => {
        setAssignments(assignments.filter(a => a.id !== assignmentId));
    };

    const openEditDialog = (assignment: RouteAssignment) => {
        setSelectedAssignment(assignment);
        setEditForm({
            id: assignment.id,
            assigned_date: assignment.assigned_date,
            removed_date: assignment.removed_date || "",
            status: assignment.status
        });
        setIsEditOpen(true);
    };

    const openEditCrewDialog = (assignment: CrewAssignment) => {
        setSelectedCrewAssignment(assignment);
        setEditCrewForm({ id: assignment.id, assigned_date: assignment.assigned_date, status: assignment.status });
        setIsEditCrewOpen(true);
    };

    // Sort assignments: active first, then by assigned date descending
    const sortedAssignments = [...assignments].sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return new Date(b.assigned_date).getTime() - new Date(a.assigned_date).getTime();
    });
    const sortedCrewAssignments = [...crewAssignments].sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return new Date(b.assigned_date).getTime() - new Date(a.assigned_date).getTime();
    });
    const handleEditCrewAssignment = async () => {
        if (!selectedCrewAssignment) return;



        console.log("Edit crew assignment:", editCrewForm);
        if (!token) return;
        try {
            const data = await apiService.updateCrewAssignment(token, editCrewForm);
            //setBusData(data)
            console.log(data, "updateRouteAssignment")
            setErrorCrewAssing('')
            fetchBusAllAssimnet(id ?? "")
            setIsEditCrewOpen(false);
        } catch (err: any) {
            console.error('Failed to fetch bus', err);
            setErrorCrewAssing(err.message)
        } finally {

        }

    };

    const handleAssignCrew = async () => {
        const selectedUser = availableUsers.find(u => u.id === assignCrewForm.user_id);
        if (!selectedUser) return;



        const createFormData: CreateCrewAssignment = {
            bus_id: busData?.id ?? "",
            user_id: selectedUser.id,
            assigned_date: assignCrewForm.assigned_date,
            status: 'active'
        }
        if (!token) return;
        try {
            const data = await apiService.busCrewAssignments(token, createFormData);
            //setBusData(data)
            console.log(data, "sTyTyTytytYtYtyTyTYtYtYTY")
            fetchBusAllAssimnet(id ?? "")
            setIsAssignCrewOpen(false);
        } catch (err: any) {
            console.error('Failed to fetch bus', err);
            setErrorCrewAssing(err.message)
        } finally {

        }
        console.log(createFormData)


        fetchBusAllAssimnet(id ?? "")

        setAssignCrewForm({ bus_id: busData?.id ?? "", user_id: "", assigned_date: new Date().toISOString().split('T')[0] });
    };

    const handleRemoveCrewAssignment = (assignmentId: string) => {
        setCrewAssignments(crewAssignments.filter(a => a.id !== assignmentId));
    };
    const activeDrivers = crewAssignments.filter(a => a.status === 'active' && a.user_type === 'driver');
    const activeConductors = crewAssignments.filter(a => a.status === 'active' && a.user_type === 'conductor');
    return (
        <div className="flex flex-col flex-1">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-3 md:py-5">
                    <div className="px-1 lg:px-3">
                        <BusManagementCard bus={busData} />
                    </div>


                    <div className="px-1 lg:px-3 ">
                        <div className="flex gap-4">
                            {/* Bus Information Card */}
                            <div className="flex-1">
                                <Card >
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <img src="/icons/bus_infor.svg" />
                                            <span className='text-[20px] font-semibold'>Bus Information </span>
                                        </CardTitle>
                                        <CardDescription>Vehicle specifications and details</CardDescription>
                                    </CardHeader>
                                    <CardContent className=''>
                                        <div className="space-y-2">

                                            <div

                                                className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                            >
                                                <span className="text-[13px] font-normal text-gray-900">
                                                    Registration Number
                                                </span>
                                                <span className="text-[15px] font-semibold text-gray-900">
                                                    {busData?.registration_number}
                                                </span>
                                            </div>
                                            <div

                                                className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                            >
                                                <span className="text-[13px] font-normal text-gray-900">
                                                    Fleet Number
                                                </span>
                                                <span className="text-[15px] font-semibold text-gray-900">
                                                    {busData?.fleet_number}
                                                </span>
                                            </div>
                                            <div

                                                className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                            >
                                                <span className="text-[13px] font-normal text-gray-900">
                                                    Manufacturer
                                                </span>
                                                <span className="text-[15px] font-semibold text-gray-900">
                                                    {busData?.manufacturer}
                                                </span>
                                            </div>
                                            <div

                                                className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                            >
                                                <span className="text-[13px] font-normal text-gray-900">
                                                    Model
                                                </span>
                                                <span className="text-[15px] font-semibold text-gray-900">
                                                    {busData?.model}
                                                </span>
                                            </div>
                                            <div

                                                className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                            >
                                                <span className="text-[13px] font-normal text-gray-900">
                                                    Year of Manufacture
                                                </span>
                                                <span className="text-[15px] font-semibold text-gray-900">
                                                    {busData?.year_of_manufacture}
                                                </span>
                                            </div>
                                            <div

                                                className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                            >
                                                <span className="text-[13px] font-normal text-gray-900">
                                                    Age
                                                </span>
                                                <span className="text-[15px] font-semibold text-gray-900">
                                                    {busData?.age}
                                                </span>
                                            </div>
                                            <div

                                                className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                            >
                                                <span className="text-[13px] font-normal text-gray-900">
                                                    Company
                                                </span>
                                                <span className="text-[15px] font-semibold text-gray-900">
                                                    {companyData?.name}
                                                </span>
                                            </div>
                                        </div>


                                        <div className="mt-6 pt-6 border-t">
                                            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                                                <img src="/icons/capacity.svg" />
                                                <span className='text-[20px] font-semibold'>Capacity Information</span>
                                            </h3>
                                            <div className="space-y-2">

                                                <div

                                                    className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                                >
                                                    <span className="text-[13px] font-normal text-gray-900">
                                                        Seating Capacity
                                                    </span>
                                                    <span className="text-[15px] font-semibold text-gray-900">
                                                        {busData?.seating_capacity}
                                                    </span>
                                                </div>
                                                <div

                                                    className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                                >
                                                    <span className="text-[13px] font-normal text-gray-900">
                                                        Standing Capacity
                                                    </span>
                                                    <span className="text-[15px] font-semibold text-gray-900">
                                                        {busData?.standing_capacity}
                                                    </span>
                                                </div>
                                                <div

                                                    className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                                >
                                                    <span className="text-[13px] font-normal text-gray-900">
                                                        Total Capacity
                                                    </span>
                                                    <span className="text-[15px] font-semibold text-gray-900">
                                                        {busData?.total_capacity}
                                                    </span>
                                                </div>



                                            </div>

                                        </div>


                                    </CardContent>
                                </Card>
                            </div>
                            {/* Route Assignments Card */}

                            <div className="flex-1">
                                <div className=" grid grid-cols gap-1  @xl/main:grid-cols-2 @5xl/main:grid-cols-1">



                                    <Card>

                                        <CardHeader>

                                            <CardTitle className="flex items-center gap-2">
                                                <img src="/icons/route_assignment.svg" />
                                                <span className='text-[20px] font-semibold'> Route Assignment</span>

                                            </CardTitle>
                                            <CardAction>
                                                <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button className="flex items-center gap-2 
                                                        text-white font-medium
                                                        rounded-[14px]
                                                        px-5 py-2
                                                        bg-gradient-to-r from-[#0F90EE] to-[#276CCC]
                                                        hover:opacity-90
                                                        shadow-md">
                                                            <Plus className="h-4 w-4" />
                                                            Assign Route
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Assign Route to Bus</DialogTitle>
                                                            <DialogDescription>
                                                                Select a route and assign it to this bus
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        {hasActiveAssignment && (
                                                            <Alert>
                                                                <AlertDescription className="text-sm">
                                                                    This bus already has an active route assignment. The new assignment will be created as inactive.
                                                                </AlertDescription>
                                                            </Alert>
                                                        )}
                                                        <div className="space-y-4 py-4">
                                                            <div>
                                                                <Label htmlFor="route" className='py-3'>Route</Label>
                                                                <Select
                                                                    value={assignForm.route_id}
                                                                    onValueChange={(value) => setAssignForm({ ...assignForm, route_id: value })}
                                                                >
                                                                    <SelectTrigger id="route" className='w-full'>
                                                                        <SelectValue placeholder="Select a route" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {availableRoutes.map((route) => (
                                                                            <SelectItem key={route.id} value={route.id}>
                                                                                {route.code} - {route.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="assign-date" className='py-3'>Assigned Date</Label>
                                                                <Input
                                                                    id="assign-date"
                                                                    type="date"
                                                                    value={assignForm.assigned_date}
                                                                    onChange={(e) => setAssignForm({ ...assignForm, assigned_date: e.target.value })}
                                                                />
                                                            </div>
                                                            {errorRouteAssing && (
                                                                <Alert variant="destructive" className="border-red-500">
                                                                    <AlertCircle className="h-4 w-4" />
                                                                    <AlertDescription className="ml-2">
                                                                        {errorRouteAssing}
                                                                    </AlertDescription>
                                                                </Alert>
                                                            )}
                                                        </div>
                                                        <DialogFooter>
                                                            <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
                                                            <Button onClick={handleAssignRoute} disabled={!assignForm.route_id} className="flex items-center gap-2 
                                                        text-white font-medium
                                                        rounded-[14px]
                                                        px-5 py-2
                                                        bg-gradient-to-r from-[#0F90EE] to-[#276CCC]
                                                        hover:opacity-90
                                                        shadow-md">
                                                                Assign Route
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </CardAction>
                                            <CardDescription>
                                                {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
                                                {hasActiveAssignment ? ' • 1 active' : ' • No active assignment'}
                                            </CardDescription>



                                        </CardHeader>
                                        <CardContent>
                                            {assignments.length > 0 ? (
                                                <div className="space-y-3">
                                                    {sortedAssignments.map((assignment) => (
                                                        <div
                                                            key={assignment.id}
                                                            className={`flex items-start justify-between p-4 border rounded-lg transition-colors ${assignment.status === 'active'
                                                                ? 'bg-green-50/50 border-green-200'
                                                                : 'bg-gray-50/50 border-gray-200'
                                                                }`}
                                                        >
                                                            <div className="space-y-2 flex-1">
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Label className="text-sm font-normal text-gray-800">Route</Label>

                                                                        </div>
                                                                        <p className="text-[15px] font-semibold ">
                                                                            {assignment?.route_code ?? "138"} - {assignment?.route_name ?? "L1-L2"}
                                                                        </p>
                                                                    </div>

                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">

                                                                            <span className='text-[13px]'>  Assigned Date  </span> :<span> <p className="text-[13px] font-normal">{assignment.assigned_date}</p></span>
                                                                        </Label>

                                                                    </div>
                                                                    {assignment.removed_date && (
                                                                        <div>
                                                                            <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                                                                <span className='text-[13px]'>Removal Date</span>: <span>  <p className="text-sm font-medium">{assignment.removed_date}</p></span>

                                                                            </Label>

                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="gird gap-4 flex flex-col items-center">
                                                                <div className='flex gap-2 '>
                                                                    <Button className="bg-[#F28603] rounded-[49px] w-[28px] h-[28px] hover:text-red-700 hover:bg-red-800" variant="ghost" size="icon" onClick={() => openEditDialog(assignment)}>
                                                                        <img src="/icons/Edit.svg"></img>
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleRemoveAssignment(assignment.id)}
                                                                        className="bg-[#FF0000] rounded-[49px] w-[28px] h-[28px] hover:text-red-700 hover:bg-red-800 "
                                                                    >
                                                                        <img src="/icons/trash.svg"></img>
                                                                    </Button>

                                                                </div>
                                                                <div>
                                                                    <Badge className={getStatusBadge(assignment.status)}>
                                                                        <span className='p-1'>{assignment.status.toUpperCase()} </span>
                                                                    </Badge>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 text-gray-500">
                                                    <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                                    <p className="text-lg font-medium">No Route Assignments</p>
                                                    <p className="text-sm mt-1">This bus has no route assignments yet</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card>

                                        <CardHeader>

                                            <CardTitle className="flex items-center gap-2">
                                                <img src="/icons/crew_assignment.svg" />
                                                <span className='text-[20px] font-semibold'>Crew Assignments</span>


                                            </CardTitle>
                                            <CardAction>
                                                <Dialog open={isAssignCrewOpen} onOpenChange={setIsAssignCrewOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button className="flex items-center gap-2 
                                                        text-white font-medium
                                                        rounded-[14px]
                                                        px-5 py-2
                                                        bg-gradient-to-r from-[#0F90EE] to-[#276CCC]
                                                        hover:opacity-90
                                                        shadow-md">
                                                            <Plus className="h-4 w-4" />
                                                            Assign Crew
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Assign Crew Member to Bus</DialogTitle>
                                                            <DialogDescription>Select a driver or conductor</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4 py-4">
                                                            <div>
                                                                <Label htmlFor="user" className='py-3'>Crew Member</Label>
                                                                <Select value={assignCrewForm.user_id} onValueChange={(value) => setAssignCrewForm({ ...assignCrewForm, user_id: value })}>
                                                                    <SelectTrigger id="user" className='w-full'>
                                                                        <SelectValue placeholder="Select a crew member" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {availableUsers.map((user) => (
                                                                            <SelectItem key={user.id} value={user.id}>{user.full_name} ({user.user_type})</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="crew-date" className='py-3'>Assigned Date</Label>
                                                                <Input
                                                                    id="crew-date"
                                                                    type="date"
                                                                    value={assignCrewForm.assigned_date}
                                                                    onChange={(e) => setAssignCrewForm({ ...assignCrewForm, assigned_date: e.target.value })}
                                                                />
                                                            </div>
                                                            {errorCrewAssing && (
                                                                <Alert variant="destructive" className="border-red-500">
                                                                    <AlertCircle className="h-4 w-4" />
                                                                    <AlertDescription className="ml-2">
                                                                        {errorCrewAssing}
                                                                    </AlertDescription>
                                                                </Alert>
                                                            )}
                                                        </div>
                                                        <DialogFooter>
                                                            <Button variant="outline" onClick={() => setIsAssignCrewOpen(false)}>Cancel</Button>
                                                            <Button onClick={handleAssignCrew} disabled={!assignCrewForm.user_id} className="flex items-center gap-2 
                                                        text-white font-medium
                                                        rounded-[14px]
                                                        px-5 py-2
                                                        bg-gradient-to-r from-[#0F90EE] to-[#276CCC]
                                                        hover:opacity-90
                                                        shadow-md">Assign Crew</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </CardAction>
                                            <CardDescription>
                                                {crewAssignments.length} assignments • {activeDrivers.length} drivers • {activeConductors.length} conductors
                                            </CardDescription>



                                        </CardHeader>
                                        <CardContent>


                                            {crewAssignments.length > 0 ? (
                                                <div className="space-y-3">
                                                    {sortedCrewAssignments.map((assignment) => (
                                                        <div
                                                            key={assignment.id}
                                                            className={`flex items-start justify-between p-4 border rounded-lg ${assignment.status === 'active' ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50/50 border-gray-200'
                                                                }`}
                                                        >
                                                            <div className="space-y-3 flex-1">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-1">

                                                                            <div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <Label className="text-sm font-normal text-gray-800">Crew Member</Label>

                                                                                </div>
                                                                                <p className="text-[15px] font-semibold ">
                                                                                    {assignment?.first_name} {assignment?.last_name}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div>
                                                                                <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">

                                                                                    <span className='text-[13px]'>  Assigned Date  </span> :<span> <p className="text-[13px] font-normal">{assignment.assigned_date}</p></span>
                                                                                </Label>

                                                                            </div>

                                                                        </div>


                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="gird gap-4 flex flex-col items-end">
                                                                <div className='flex gap-2 '>


                                                                    <Button className="bg-[#F28603] rounded-[49px] w-[28px] h-[28px] hover:text-red-700 hover:bg-red-800" variant="ghost" size="icon" onClick={() => openEditCrewDialog(assignment)}>
                                                                        <img src="/icons/Edit.svg"></img>
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleRemoveCrewAssignment(assignment.id)}
                                                                        className="bg-[#FF0000] rounded-[49px] w-[28px] h-[28px] hover:text-red-700 hover:bg-red-800 "
                                                                    >
                                                                        <img src="/icons/trash.svg"></img>
                                                                    </Button>


                                                                </div>
                                                                <div className='flex gap-2 '>
                                                                    <Badge className={getUserTypeBadge(assignment?.user_type ?? "")}>
                                                                        <span className='p-1 text-white'> {assignment.user_type ? (assignment.user_type.toUpperCase()) : ("")}</span>
                                                                    </Badge>
                                                                    <Badge className={getStatusBadge(assignment.status)}>
                                                                        <span className='p-1 '>{assignment.status.toUpperCase()} </span>
                                                                    </Badge>
                                                                </div>

                                                            </div>

                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 text-gray-500">
                                                    <UserCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                                    <p className="text-lg font-medium">No Crew Assignments</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        {errorDevicesAssing && (
                                            <Alert variant="destructive" className="border-red-500">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription className="ml-2">
                                                    {errorDevicesAssing}
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        <CardHeader>

                                            <CardTitle className="flex items-center gap-2">
                                                <img src="/icons/crew_assignment.svg" />
                                                <span className='text-[20px] font-semibold'> Devices Assignments</span>


                                            </CardTitle>
                                            <CardAction>
                                                <Dialog open={isAssignCompanyOpen} onOpenChange={setIsAssignCompanyOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button className="flex items-center gap-2 
                                                        text-white font-medium
                                                        rounded-[14px]
                                                        px-5 py-2
                                                        bg-gradient-to-r from-[#0F90EE] to-[#276CCC]
                                                        hover:opacity-90
                                                        shadow-md">
                                                            <Plus className="h-4 w-4" />
                                                            Assign devices
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Assign devices Member to Bus</DialogTitle>
                                                            <DialogDescription>Select a devices</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4 py-4">
                                                            <div>
                                                                <Label htmlFor="user" className='py-3'>Devices</Label>
                                                                <Select value={assignDevicesForm.bus_id} onValueChange={(value) => setAssignDevicesForm({ ...assignDevicesForm, bus_id: value })}>
                                                                    <SelectTrigger id="user" className='w-full'>
                                                                        <SelectValue placeholder="Select a devices" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {availableDevices.map((user) => (
                                                                            <SelectItem key={user.id} value={user.id}>{user.device_code} ({user.model})</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button variant="outline" onClick={() => setIsAssignCrewOpen(false)}>Cancel</Button>
                                                            <Button onClick={handleAssignDevices} disabled={!assignDevicesForm.bus_id} className="flex items-center gap-2 
                                                        text-white font-medium
                                                        rounded-[14px]
                                                        px-5 py-2
                                                        bg-gradient-to-r from-[#0F90EE] to-[#276CCC]
                                                        hover:opacity-90
                                                        shadow-md">Assign Devices</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </CardAction>
                                            <CardDescription>

                                            </CardDescription>



                                        </CardHeader>
                                        <CardContent>


                                            {devicesAssignments ? (
                                                <div className="space-y-3">

                                                    <div
                                                        key={devicesAssignments.id}
                                                        className={`flex items-start justify-between p-4 border rounded-lg ${devicesAssignments.status === 'active' ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50/50 border-gray-200'
                                                            }`}
                                                    >
                                                        <div className="space-y-3 flex-1">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Label className="text-sm font-normal text-gray-800">Device Code</Label>

                                                                        </div>
                                                                        <p className="text-[15px] font-semibold ">
                                                                            {devicesAssignments?.device_code}
                                                                        </p>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">

                                                                                <span className='text-[13px]'> Model  </span> :<span> <p className="text-[13px] font-normal">{devicesAssignments?.model}</p></span>
                                                                            </Label>

                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="gird gap-4 flex flex-col items-end">
                                                            <div className='flex gap-2 '>


                                                                <Button className="bg-[#F28603] rounded-[49px] w-[28px] h-[28px] hover:text-red-700 hover:bg-red-800" variant="ghost" size="icon" onClick={() => openEditCrewDialog(devicesAssignments)}>
                                                                    <img src="/icons/Edit.svg"></img>
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleRemoveCrewAssignment(devicesAssignments.id)}
                                                                    className="bg-[#FF0000] rounded-[49px] w-[28px] h-[28px] hover:text-red-700 hover:bg-red-800 "
                                                                >
                                                                    <img src="/icons/trash.svg"></img>
                                                                </Button>


                                                            </div>
                                                            <div className='flex gap-2 '>
                                                                <Badge className={getUserTypeBadge(devicesAssignments?.user_type ?? "")}>
                                                                    <span className='p-1 text-white'> {devicesAssignments.user_type ? (devicesAssignments.user_type.toUpperCase()) : ("")}</span>
                                                                </Badge>
                                                                <Badge className={getStatusBadge(devicesAssignments.status)}>
                                                                    <span className='p-1 '>{devicesAssignments.status.toUpperCase()} </span>
                                                                </Badge>
                                                            </div>

                                                        </div>

                                                        {/* <div className="flex gap-2 ml-4">
                                                            <Button variant="outline" size="sm" onClick={() => openEditCrewDialog(devicesAssignments)}>
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleRemoveCrewAssignment(devicesAssignments.id)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div> */}
                                                    </div>

                                                </div>
                                            ) : (
                                                <div className="text-center py-12 text-gray-500">
                                                    <MdOnDeviceTraining className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                                    <p className="text-lg font-medium">No Devices Assignments</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                            {/* Edit Assignment Dialog */}
                            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Route Assignment</DialogTitle>
                                        <DialogDescription>
                                            Update assignment dates and status
                                        </DialogDescription>
                                    </DialogHeader>
                                    {editForm.status === 'active' && hasActiveAssignment &&
                                        selectedAssignment?.status !== 'active' && (
                                            <Alert>
                                                <AlertDescription className="text-sm">
                                                    Setting this assignment as active will deactivate the current active assignment.
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    <div className="space-y-4 py-4">
                                        <div>
                                            <Label htmlFor="edit-assigned" className='py-3'>Assigned Date</Label>
                                            <Input
                                                id="edit-assigned"
                                                type="date"
                                                value={editForm.assigned_date}
                                                onChange={(e) => setEditForm({ ...editForm, assigned_date: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="edit-removed" className='py-3'>Removed Date</Label>
                                            <Input
                                                id="edit-removed"
                                                type="date"
                                                value={editForm.removed_date}
                                                onChange={(e) => setEditForm({ ...editForm, removed_date: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="edit-status" className='py-3'>Status</Label>
                                            <Select
                                                value={editForm.status}
                                                onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                                            >
                                                <SelectTrigger id="edit-status">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                    <SelectItem value="suspended">Suspended</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                         {errorRouteAssing && (
                                            <Alert variant="destructive" className="border-red-500">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription className="ml-2">
                                                    {errorRouteAssing}
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                                        <Button onClick={handleEditAssignment} className='flex items-center gap-2 
                                                        text-white font-medium
                                                        rounded-[14px]
                                                        px-5 py-2
                                                        bg-gradient-to-r from-[#0F90EE] to-[#276CCC]
                                                        hover:opacity-90
                                                        shadow-md'>Save Changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Dialog open={isEditCrewOpen} onOpenChange={setIsEditCrewOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Crew Assignment</DialogTitle>
                                        <DialogDescription>Update assignment dates and status</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div>
                                            <Label htmlFor="edit-crew-assigned" className='py-3'>Assigned Date</Label>
                                            <Input
                                                id="edit-crew-assigned"
                                                type="date"
                                                value={editCrewForm.assigned_date}
                                                onChange={(e) => setEditCrewForm({ ...editCrewForm, assigned_date: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="edit-crew-status" className='py-3'>Status</Label>
                                            <Select value={editCrewForm.status} onValueChange={(value) => setEditCrewForm({ ...editCrewForm, status: value })}>
                                                <SelectTrigger id="edit-crew-status">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                    <SelectItem value="suspended">Suspended</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    {errorCrewAssing && (
                                        <Alert variant="destructive" className="border-red-500">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription className="ml-2">
                                                {errorCrewAssing}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditCrewOpen(false)}>Cancel</Button>
                                        <Button onClick={handleEditCrewAssignment}>Save Changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            {/* Metadata */}
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle>System Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <Label className="text-gray-500">Created At</Label>
                                            <p className="font-medium">{new Date(busData.created_at).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <Label className="text-gray-500">Last Updated</Label>
                                            <p className="font-medium">{new Date(busData.updated_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default BusDetailsView;