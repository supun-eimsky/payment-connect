"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { X } from "lucide-react"
import { Trip, TripFilters, TripDetails } from '@/types';

interface SessionViewFilterBarProps {
    onFilterSubmit: (filters: TripFilters) => void;
    isLoading?: boolean;
}
interface companyFilters {
    organisation_id?: string | null,
    company_id?: string | null,
    route_id?: string | null,
    limit?: number,
}
const userStr = localStorage.getItem("user")
let Organisation_ID: any = null;
let COMPANY_ID: any = null;
if (userStr) {
    const parsed = JSON.parse(userStr);
    Organisation_ID = parsed.organisation_id ? (parsed.organisation_id) : (null);
    COMPANY_ID = parsed.company_id ? (parsed.company_id) : (null)
}
const STATUS_LIST = [
    {
        name: "Completed",
        id: "completed"
    },
    {
        name: "Auto Completed",
        id: "auto_completed"
    },
    {
        name: "In Progress",
        id: "in_progress"
    },
    {
        name: "Cancelled",
        id: "cancelled"
    },
    { name: "Scheduled", id: "scheduled" }

];
export function SessionViewFilterBar({ onFilterSubmit, isLoading }: SessionViewFilterBarProps) {
    const [route, setRoute] = useState("")
    const [company, setCompany] = useState("")
    const [busNumber, setBusNumber] = useState("")
    const [status, setStatus] = useState("")
    const [conductor, setConductor] = useState("")
    const [routeList, setRouteList] = useState<any[]>([]);
    const [companiesList, setCompaniesList] = useState<any[]>([]);
    const [busesList, setBusedList] = useState<any[]>([]);
    const [date, setDate] = useState("")
    const { token } = useAuth();
    const [filters, setFilters] = useState<companyFilters>({
        company_id: COMPANY_ID,
        organisation_id: Organisation_ID,
        limit: 50,
    });
    const handleApply = () => {
        console.log({ route, busNumber, conductor, date })
        onFilterSubmit({
            route_id: route || undefined,
            bus_id: busNumber || undefined,
            conductor_id: conductor || undefined,
            start_date: date || undefined,
            company_id: company || undefined,
            status: status || undefined
        });
    }

    const handleReset = () => {
        location.reload()
        setRoute("");
        setBusNumber("");
        setStatus("");
        setConductor("");
        setDate("");
        setCompany("")
        onFilterSubmit({});
    }
    const clearStatus = () => {
        setStatus("");
    }
    const clearRoute = () => {
        setRoute("");
    }
    const clearCompany = () => {
        setCompany("");
    }
    const clearBusNumber = () => {
        setBusNumber("");
    }

    const clearConductor = () => {
        setConductor("");
    }

    const clearDate = () => {
        setDate("");
    }
    const fetchCompanies = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            filterData.limit = 100;
            //  setLoading(true)
            const data = await apiService.getCompaniesWithFilters(token, null, filterData);
            const busesArray = data || [];
            setCompaniesList(busesArray.data);
            console.log('Company Details Data:', busesArray);
            return
        } catch (err: any) {
            console.error('Company to fetch bus', err);
            //  setError(err.message);
        } finally {
            //  setLoading(false);
        }

    }
    const getRouteCompany = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            //    setLoading(true)
            const data = await apiService.getRouteCompany(token, filterData.company_id);
            const busesArray = data.routes;
            setRouteList(busesArray)
            return
            console.log('Route  dsssssss:', busesArray);
        } catch (err) {
            console.error('Route  d', err);
        } finally {
            // setLoading(false);
        }
    }
    const fetchRoute = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            //    setLoading(true)
            const data = await apiService.getRouteWithFilters(token, null, filterData);
            const busesArray = data.routes;
            setRouteList(busesArray)
            return
            console.log('Route  dsssssss:', busesArray);
        } catch (err) {
            console.error('Route  d', err);
        } finally {
            // setLoading(false);
        }

    }
    const fetchBuses = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            /// setLoading(true)
            filterData.limit = 100;
            console.log(filterData);
            console.log("filterDatafilterDatafilterData");
            const data = await apiService.getBusWithFilters(token, null, filterData);
            const busesArray = data || [];
            setBusedList(busesArray.data);
            // pagination.setTotal(busesArray.total);
            console.log('Bus Details Data:', busesArray);
        } catch (err) {
            console.error('Failed to fetch bus', err);
        } finally {
            //setLoading(false);
        }

    }

    useEffect(() => {
        fetchCompanies(filters)
        if (!COMPANY_ID) {
            fetchRoute(filters)
        } else {
            getRouteCompany(filters)
        }

        fetchBuses(filters)
    }, [filters]);

    return (
        <div className="w-full bg-[#1D8AF5] p-3 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
                {/* Route Select with Clear */}
                {COMPANY_ID ? null : (<div className="relative">
                    <Select value={company} onValueChange={(value) => {
                        if (value === "clear-selection") {
                            setCompany("");
                        } else {
                            setCompany(value);

                            filters.company_id = value;

                            getRouteCompany(filters)
                            fetchBuses(filters)
                        }
                    }}>
                        <SelectTrigger className="bg-white w-full text-black pr-8">
                            <SelectValue placeholder="Company  List " />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="clear-selection" className="text-gray-500 italic">
                                -- Clear Selection --
                            </SelectItem>
                            {companiesList.map((x, y) => (
                                <SelectItem key={x.id} value={x.id}>{x.code} {x.name}</SelectItem>
                            ))}
                            {/* <SelectItem value="1b1ddc53-ab3e-4265-9d81-513099f5eefb">138 Colombo - Galle</SelectItem> */}
                        </SelectContent>
                    </Select>
                    {company && (
                        <button
                            type="button"
                            onClick={clearCompany}
                            className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded z-10"
                            aria-label="Clear route"
                        >
                            <X className="h-3 w-3 text-gray-600" />
                        </button>
                    )}
                </div>)}


                <div className="relative">
                    <Select value={route} onValueChange={(value) => {
                        if (value === "clear-selection") {
                            setRoute("");
                        } else {
                            setRoute(value);

                            filters.route_id = value;

                            // fetchRoute(filters)
                            fetchBuses(filters)
                        }
                    }}>
                        <SelectTrigger className="bg-white w-full text-black pr-8">
                            <SelectValue placeholder="Route List " />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="clear-selection" className="text-gray-500 italic">
                                -- Clear Selection --
                            </SelectItem>
                            {routeList.map((x, y) => (
                                <SelectItem key={x.id} value={x.id}>{x.code} {x.name}</SelectItem>
                            ))}
                            {/* <SelectItem value="1b1ddc53-ab3e-4265-9d81-513099f5eefb">138 Colombo - Galle</SelectItem> */}
                        </SelectContent>
                    </Select>
                    {route && (
                        <button
                            type="button"
                            onClick={clearRoute}
                            className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded z-10"
                            aria-label="Clear route"
                        >
                            <X className="h-3 w-3 text-gray-600" />
                        </button>
                    )}
                </div>


                {/* Bus Number Select with Clear */}
                <div className="relative">
                    <Select value={busNumber} onValueChange={(value) => {
                        if (value === "clear-selection") {
                            setBusNumber("");
                        } else {
                            setBusNumber(value);
                        }
                    }}>
                        <SelectTrigger className="bg-white w-40 text-black pr-8">
                            <SelectValue placeholder="Bus Number" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="clear-selection" className="text-gray-500 italic">
                                -- Clear Selection --
                            </SelectItem>
                            {busesList.map((x, y) => (
                                <SelectItem key={x.id} value={x.id}>{x.registration_number}</SelectItem>
                            ))}


                        </SelectContent>
                    </Select>
                    {busNumber && (
                        <button
                            type="button"
                            onClick={clearBusNumber}
                            className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded z-10"
                            aria-label="Clear bus number"
                        >
                            <X className="h-3 w-3 text-gray-600" />
                        </button>
                    )}
                </div>
                <div className="relative">
                    <Select value={status} onValueChange={(value) => {
                        if (value === "clear-selection") {
                            setStatus("");
                        } else {
                            setStatus(value);
                        }
                    }}>
                        <SelectTrigger className="bg-white w-40 text-black pr-8">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="clear-selection" className="text-gray-500 italic">
                                -- Clear Selection --
                            </SelectItem>
                            {STATUS_LIST.map((x, y) => (
                                <SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>
                            ))}


                        </SelectContent>
                    </Select>
                    {busNumber && (
                        <button
                            type="button"
                            onClick={clearStatus}
                            className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded z-10"
                            aria-label="Clear bus number"
                        >
                            <X className="h-3 w-3 text-gray-600" />
                        </button>
                    )}
                </div>

                {/* Conductor Name Select with Clear */}


                {/* Date Input with Clear */}
                {/* <div className="relative">
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-white h-11 text-black pr-8"
                        placeholder="Select Date"
                    />
                    {date && (
                        <button
                            type="button"
                            onClick={clearDate}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded"
                            aria-label="Clear date"
                        >
                            <X className="h-3 w-3 text-gray-600" />
                        </button>
                    )}
                </div> */}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button
                    onClick={handleApply}
                    className="bg-blue-400 hover:bg-blue-600 text-white h-11 rounded-12 px-6"
                    disabled={isLoading}
                >
                    {isLoading ? 'Applying...' : 'Apply'}
                </Button>
                <Button
                    onClick={handleReset}
                    variant="outline"
                    className="bg-white hover:bg-gray-100 text-black h-11 rounded-12 px-6"
                    disabled={isLoading}
                >
                    Reset
                </Button>
            </div>
        </div>
    )
}