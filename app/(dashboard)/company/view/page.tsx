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
import { CompanyCard } from '@/components/company/company-card';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { useNavbar } from "@/context/navbar-context"
import { useSearchParams } from 'next/navigation';
import { CreateAssignmentPayload } from '@/types/route';
import { User, CreateCrewAssignment } from '@/types/user';

import { Company } from '@/types/company';
import { Devices, CreateCompanyAssignmentPayload } from '@/types/device';
import { BsDeviceSsdFill } from "react-icons/bs";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { MdContactPhone } from "react-icons/md";
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


interface companyAssignment {
    id: string;
    device_code: string;
    model?: string;

    mac_address?: string;
    manufacturer: string
    warranty_expiry?: string
    status: string;
}
interface AllAssignment {
    bus: Bus,
    route_assignments: companyAssignment
    crew_assignments: any[]
}

interface EditAssignmentPayload {
    assigned_date?: string;
    assignment_reason: string;
    company_id: string;
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



const userStr = localStorage.getItem("user")
let Organisation_ID: any = null;
let COMPANY_ID: any = null;
if (userStr) {
    const parsed = JSON.parse(userStr);
    Organisation_ID = parsed.organisation_id ? (parsed.organisation_id) : (null);
    COMPANY_ID = parsed.company_id ? (parsed.company_id) : (null)
}

const CompanyDetailsView: React.FC = () => {
    // Mock data


    // const availableRoutes: Route[] = [
    //     { id: "a3924555-16dc-4ae8-9982-4237c6ac3eca", code: "R001", name: "Colombo - Negombo Express", status: "active" },
    //     { id: "route-2", code: "R002", name: "Negombo - Katunayake", status: "active" },
    //     { id: "route-3", code: "R003", name: "Colombo - Kandy Highway", status: "active" },
    //     { id: "route-4", code: "R004", name: "Galle - Matara Coastal", status: "active" }
    // ];

    const [assignments, setAssignments] = useState<companyAssignment[]>([]);
    const { token } = useAuth();
    const [errorRouteAssing, setErrorRouteAssing] = useState('');
    const [errorCrewAssing, setErrorCrewAssing] = useState('');
    const { setNavbarData } = useNavbar();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isEditCrewOpen, setIsEditCrewOpen] = useState(false);
    const [companyData, setCompanyData] = useState<Company | null>(null);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<companyAssignment | null>(null);
    const [selectedCrewAssignment, setSelectedCrewAssignment] = useState<CrewAssignment | null>(null);
    const [isAssignCrewOpen, setIsAssignCrewOpen] = useState(false);
    const [editCrewForm, setEditCrewForm] = useState({ id: "", assigned_date: "", status: "active" });
    const [crewAssignments, setCrewAssignments] = useState<CrewAssignment[]>([]);
    const [availableRoutes, setAvailableRoutes] = useState<any[]>([]);
    const [devices, setDevices] = useState<Devices[]>([]);
    const [busesList, setBusesList] = useState<Bus[]>([]);
    const [availableUsers, setavailableUsers] = useState<any[]>([]);

    const [editForm, setEditForm] = useState<EditAssignmentPayload>({
        id: "",
        assigned_date: "",
        company_id: "",
        assignment_reason: "",

        status: "active"
    });
    const [filters, setFilters] = useState<any>({
        company_id: COMPANY_ID,
        offset: 0,
        limit: 10,

    });
    const [filtersCompany, setFiltersCompany] = useState<any>({
        company_id: COMPANY_ID,
        organisation_id: Organisation_ID

    });
    const [filtersDevices, setFiltersDevices] = useState<any>({
        company_id: COMPANY_ID

    });
    const [filtersBus, setFiltersBus] = useState<any>({
        company_id: COMPANY_ID,
        organisation_id: Organisation_ID

    });
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [assignForm, setAssignForm] = useState<CreateCompanyAssignmentPayload>({
        company_id: "",
        // assignment_reason: "",
        //  assigned_date: new Date().toISOString().split('T')[0]
    });

    const [assignCrewForm, setAssignCrewForm] = useState({
        bus_id: "",
    });
    useEffect(() => {
        setNavbarData("Company Management", "Company Management/ View");
        fetchCompanyGetById(id ?? "")

        fetchAllDevices(filtersCompany)
        fetchBuses(filtersBus)
        // fetchStats();

    }, [token, setNavbarData]);

    const fetchBuses = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            //setLoading(true)
            const data = await apiService.getBusWithFilters(token, null, filterData);
            const busesArray = data || [];
            setBusesList(busesArray.data);
            // pagination.setTotal(busesArray.total);
           // console.log('Bus Details Data:', busesArray);
        } catch (err) {
            console.error('Failed to fetch bus', err);
        } finally {
            //setLoading(false);
        }

    }
    const fetchUsers = async (filterData: any) => {
        if (!token) return;

        try {



            // Call with filter
            // setLoading(true)
            const data = await apiService.getUsersWithFilters(token, null, filterData);
            const busesArray = data || [];
            setavailableUsers(busesArray.data)
            //  setBusesList(busesArray.data);
            //  pagination.setTotal(busesArray.total);
           // console.log('User Details Data:', busesArray);
        } catch (err) {
            console.error('Failed to fetch bus', err);
        } finally {
            // setLoading(false);
        }

    }
    const fetchAllDevices = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            //  setLoading(true)
            const data = await apiService.getDevicesWithFilters(token, null, filterData);
            const busesArray = data || [];
            setDevices(busesArray.data.data);
        } catch (err: any) {
            console.error('Company to fetch bus', err);
            //  setError(err.message);
        } finally {
            //  setLoading(false);
        }

    }
    const fetchCompanyGetById = async (id: string) => {
        console.log(id, "Company IDssssssssssssssssssss")
        if (!token) return;
        try {
            const data = await apiService.getCompanyById(token, id);
            setCompanyData(data)
            filters.company_id = id

            fetchDevices(filters)


        } catch (err) {
            console.error('Failed to fetch bus', err);
        } finally {

        }
    }
    const fetchDevices = async (filterData: any) => {
         filters.company_id = id
       console.log(filterData, "filterDatafilterDatafilterData")
        if (!token) return;
        try {

            // Call with filter
            //setLoading(true)
            const data = await apiService.getDevicesCompanyWithFilters(token, null, filterData);
            const busesArray = data || [];
            setAssignments(busesArray.data)
            // setBusesList(busesArray.data);
            // pagination.setTotal(busesArray.total);
           // console.log('Company Device data', busesArray);
        } catch (err) {
            console.error('Failed to fetch bus', err);
        } finally {
            //setLoading(false);
        }

    }
    const fetchBusAllAssimnet = async (id: string) => {
        if (!token) return;
        try {
            const data = await apiService.getBusRouteassignments(token, id);
            // setAssignments(data.route_assignments)
            setCrewAssignments(data.crew_assignments)
           // console.log(data, "sTyTyTytytYtYtyTyTYtYtYTY")

        } catch (err) {
            console.error('Failed to fetch bus', err);
        } finally {

        }
    }
    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            operational: "bg-green-100 text-green-800 border-green-200",
            maintenance: "bg-yellow-100 text-yellow-800 border-yellow-200",
            retired: "bg-gray-100 text-gray-800 border-gray-200",
            active: "bg-green-600 text-white border-green-200",

            assigned: "bg-green-600 text-white border-green-200",
            inactive: "bg-gray-100 text-gray-800 border-gray-200",
            suspended: "bg-red-100 text-red-800 border-red-200"
        };
        return variants[status] || "bg-gray-100 text-gray-800 border-gray-200";
    };
    const getUserTypeBadge = (userType: string) => {
        const variants: Record<string, string> = {
            driver: "bg-blue-100 text-blue-800",
            conductor: "bg-purple-100 text-purple-800"
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
          //  console.log(data, "updateRouteAssignment")
            fetchBusAllAssimnet(id ?? "")
        } catch (err: any) {
            console.error('Failed to fetch bus', err);
            setErrorRouteAssing(err.message);
        } finally {

        }
        setIsEditOpen(false);
        setSelectedAssignment(null);
    };

    const handleAssignCompany = async () => {
       // console.log(assignForm)
        const selectedRoute = devices.find(r => r.id === assignForm.company_id);
       // console.log(selectedRoute, "sssssssssssssdlklk")
        if (!selectedRoute) return;

        const newAssignment: companyAssignment = {
            id: `assign-${Date.now()}`,
            device_code: "",
            manufacturer: "",
            model: "",
            mac_address: "",
            warranty_expiry: "",
            status: hasActiveAssignment ? 'inactive' : 'active'

        };

        // If this is the first assignment or no active assignment exists, make it active
        // Otherwise, deactivate all others if this should be active
        if (!hasActiveAssignment) {
            setAssignments([...assignments, newAssignment]);
        } else {
            setAssignments([...assignments, newAssignment]);
        }

       // console.log("Assign route:", assignForm);
        const setNewAssignForm: any = {
            company_id: id,
            assignment_reason: assignForm.assignment_reason
        }
        if (!token) return;
        try {
            const data = await apiService.DeviceAssignmentToCompany(token, assignForm.company_id ?? "", setNewAssignForm);
            //setBusData(data)
          //  console.log(data, "sTyTyTytytYtYtyTyTYtYtYTY")
            fetchDevices(filters)
        } catch (err: any) {
            console.error('Failed to fetch bus', err);
            setErrorRouteAssing(err.message);
        } finally {

        }
        setIsAssignOpen(false);
        setAssignForm({
            company_id: "",
            assignment_reason: "",
            assigned_date: new Date().toISOString().split('T')[0]
        });
    };

    const handleRemoveAssignment = (assignmentId: string) => {
        setAssignments(assignments.filter(a => a.id !== assignmentId));
    };

    const openEditDialog = (assignment: companyAssignment) => {
        setSelectedAssignment(assignment);
        setEditForm({
            id: assignment.id,
            assigned_date: "",
            company_id: "",
            assignment_reason: "",
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
    const sortedAssignments = assignments
    const sortedCrewAssignments = [...crewAssignments].sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return new Date(b.assigned_date).getTime() - new Date(a.assigned_date).getTime();
    });
    const handleEditCrewAssignment = async () => {
        if (!selectedCrewAssignment) return;



      //  console.log("Edit crew assignment:", editCrewForm);
        if (!token) return;
        try {
            const data = await apiService.updateCrewAssignment(token, editCrewForm);
            //setBusData(data)
          //  console.log(data, "updateRouteAssignment")
            fetchBusAllAssimnet(id ?? "")
        } catch (err: any) {
            console.error('Failed to fetch bus', err);
            setErrorCrewAssing(err.message)
        } finally {

        }
        setIsEditCrewOpen(false);
    };

    const handleAssignCrew = async () => {
        console.log()
        const selectedBus = busesList.find(u => u.id === assignCrewForm.bus_id);
       // console.log(selectedBus)
        if (!selectedBus) return;

       // console.log(selectedBus)

        const createFormData: any = {
            bus_id: selectedBus.id
        }
        if (!token) return;

        try {
            const data = await apiService.deviceAssignmentToBus(token, id ?? "", createFormData);
            //setBusData(data)
            fetchBusAllAssimnet(id ?? "")
        } catch (err: any) {
            console.error('Failed to fetch bus', err);
            setErrorCrewAssing(err.message)
        } finally {

        }
      //  console.log(createFormData)


        fetchBusAllAssimnet(id ?? "")
        setIsAssignCrewOpen(false);
        setAssignCrewForm({ bus_id: "" });
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
                        <CompanyCard bus={companyData} />
                    </div>


                    <div className="px-1 lg:px-3 ">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                {/* Bus Information Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <img src="/icons/bus_infor.svg" />
                                            <span className='text-[20px] font-semibold'>Company Information</span>


                                        </CardTitle>
                                        <CardDescription>Devices specifications and details</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">

                                            <div

                                                className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                            >
                                                <span className="text-[13px] font-normal text-gray-900">
                                                    Name
                                                </span>
                                                <span className="text-[15px] font-semibold text-gray-900">
                                                    {companyData?.name}
                                                </span>
                                            </div>
                                            <div

                                                className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                            >
                                                <span className="text-[13px] font-normal text-gray-900">
                                                    Registration Number
                                                </span>
                                                <span className="text-[15px] font-semibold text-gray-900">
                                                    {companyData?.registration_number}
                                                </span>
                                            </div>
                                            <div

                                                className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                            >
                                                <span className="text-[13px] font-normal text-gray-900">
                                                    Address
                                                </span>
                                                <span className="text-[15px] font-semibold text-gray-900">
                                                    {companyData?.address}
                                                </span>
                                            </div>
                                            <div

                                                className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                            >
                                                <span className="text-[13px] font-normal text-gray-900">
                                                    Province
                                                </span>
                                                <span className="text-[15px] font-semibold text-gray-900">
                                                    {companyData?.province}
                                                </span>
                                            </div>
                                            <div

                                                className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                            >
                                                <span className="text-[13px] font-normal text-gray-900">
                                                    City
                                                </span>
                                                <span className="text-[15px] font-semibold text-gray-900">
                                                    {companyData?.city}
                                                </span>
                                            </div>

                                        </div>


                                        <div className="mt-6 pt-6 border-t">
                                            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                                                <img src="/icons/bus_infor.svg" />
                                                <span className='text-[20px] font-semibold'>Contact Information</span>

                                            </h3>
                                            <div className="space-y-2">

                                                <div

                                                    className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                                >
                                                    <span className="text-[13px] font-normal text-gray-900">
                                                        Phone
                                                    </span>
                                                    <span className="text-[15px] font-semibold text-gray-900">
                                                        {companyData?.phone}
                                                    </span>
                                                </div>
                                                <div

                                                    className="flex items-center justify-between bg-[#EDEDED] rounded-2xl px-4 py-3"
                                                >
                                                    <span className="text-[13px] font-normal text-gray-900">
                                                        Email
                                                    </span>
                                                    <span className="text-[15px] font-semibold text-gray-900">
                                                        {companyData?.email}
                                                    </span>
                                                </div>




                                            </div>

                                        </div>


                                    </CardContent>
                                </Card>
                            </div>

                            {/* Route Assignments Card */}
                            <div className="flex-1">
                                <div className="grid grid-cols gap-1  @xl/main:grid-cols-2 @5xl/main:grid-cols-1">



                                    <Card>
                                        {errorRouteAssing && (
                                            <Alert variant="destructive" className="border-red-500">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription className="ml-2">
                                                    {errorRouteAssing}
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        <CardHeader>

                                            <CardTitle className="flex items-center gap-2">
                                                <img src="/icons/bus_infor.svg" />
                                                <span className='text-[20px] font-semibold'>Devices Assignment</span>

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
                                                            Assign Devices
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Assign Devices to Company</DialogTitle>
                                                            <DialogDescription>
                                                                Select a Company and assign it to this Devices
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        {hasActiveAssignment && (
                                                            <Alert>
                                                                <AlertDescription className="text-sm">
                                                                    This Devices already has an active on Company. The new assignment will be created as inactive.
                                                                </AlertDescription>
                                                            </Alert>
                                                        )}
                                                        <div className="space-y-4 py-1">
                                                            <div>
                                                                <Label htmlFor="route" className='py-3'>Devices </Label>
                                                                <Select
                                                                    value={assignForm.company_id}
                                                                    onValueChange={(value) => setAssignForm({ ...assignForm, company_id: value })}
                                                                >
                                                                    <SelectTrigger id="route" className='w-full'>
                                                                        <SelectValue placeholder="Select a Devices" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {devices.map((route) => (
                                                                            <SelectItem key={route.id} value={route.id}>
                                                                                {route.device_code} - ({route.serial_number} )
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div>
                                                                <Label htmlFor="assign-date" className='py-3'>Assignment Reason</Label>
                                                                <Input
                                                                    id="assign-Reason"
                                                                    value={assignForm.assignment_reason}
                                                                    onChange={(e) => setAssignForm({ ...assignForm, assignment_reason: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
                                                            <Button onClick={handleAssignCompany} disabled={!assignForm.company_id} className="flex items-center gap-2 
                                                        text-white font-medium
                                                        rounded-[14px]
                                                        px-5 py-2
                                                        bg-gradient-to-r from-[#0F90EE] to-[#276CCC]
                                                        hover:opacity-90
                                                        shadow-md">
                                                                Assign Devices
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </CardAction>
                                            <CardDescription>
                                                {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
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
                                                                            <Label className="text-sm font-medium text-gray-500">Devices</Label>

                                                                        </div>
                                                                        <p className="text-[15px] font-semibold ">
                                                                            {assignment?.device_code ?? ""}
                                                                        </p>
                                                                    </div>

                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">

                                                                            <span className='text-[13px]'>Warranty Expiry</span> :<span> <p className="text-[13px] font-normal">{assignment.warranty_expiry}</p></span>
                                                                        </Label>

                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">

                                                                            <span className='text-[13px]'>Model</span> :<span> <p className="text-[13px] font-normal">{assignment?.model ?? ""}</p></span>
                                                                        </Label>

                                                                    </div>
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
                                                    <p className="text-lg font-medium">No Devices Assignments</p>
                                                    <p className="text-sm mt-1">This Devices has not assign to Company</p>
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
                                            <p className="font-medium">{new Date(companyData.created_at).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <Label className="text-gray-500">Last Updated</Label>
                                            <p className="font-medium">{new Date(companyData.updated_at).toLocaleString()}</p>
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

export default CompanyDetailsView;