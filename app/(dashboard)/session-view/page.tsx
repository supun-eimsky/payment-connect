'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bus, Clock, MapPin, User, Users, DollarSign, Ticket, Loader2, ArrowRight } from 'lucide-react';
import { Trip, TripFilters, TripDetails } from '@/types';
import { SessionViewFilterBar } from '@/components/session-view-filter-bar';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { useNavbar } from "@/context/navbar-context"
import { useRouter } from 'next/navigation';

import Image from "next/image"
const userStr = localStorage.getItem("user")
let Organisation_ID: any = null;
let COMPANY_ID: any = null;
let role: any = null;
if (userStr) {
    const parsed = JSON.parse(userStr);
    Organisation_ID = parsed.organisation_id ? (parsed.organisation_id) : (null);
    COMPANY_ID = parsed.company_id ? (parsed.company_id) : (null)
    role = parsed.user_type ? (parsed.user_type) : (null)
}


export default function TripsPage() {
    const [selectedTrip, setSelectedTrip] = useState<TripDetails | null>(null);
        const [companiesList, setCompaniesList] = useState<any[]>([]);
    
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [tripDetailsEmpty, setTripDetailsEmpty] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const router = useRouter();

    const [cursor, setCursor] = useState<string | null>(null);
    const [totalDuration, setTotalDuration] = useState<number>(0);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState<TripFilters>({
        company_id: COMPANY_ID,
        limit: 10,
        sort_order: 'desc'
    });
    const { token } = useAuth();
    const { setNavbarData } = useNavbar();
    const observerTarget = useRef<HTMLDivElement>(null);
    useEffect(() => {
        setNavbarData("Session View", "Session View / Session View");
        // fetchStats()
        if(role==="organisation_admin"){
            filters.organisation_id=Organisation_ID,
            fetchCompanies(filters)
        }else{
              fetchTrips(filters)
        }
      
    }, [token]);
    useEffect(() => {
        // Select first trip by default
        if (trips.length > 0 && !selectedTrip) {
            getFullTripDetails(trips[0].id);

        } else {
            setTripDetailsEmpty(true)
        }


    }, [trips, selectedTrip]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    loadMoreTrips(filters);
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loadingMore, cursor]);
    const fetchCompanies = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            filterData.limit = 100;
            //  setLoading(true)
            const data = await apiService.getCompaniesWithFilters(token, null, filterData);
            const busesArray = data || [];
            setCompaniesList(busesArray.data);
            filters.company_id = busesArray.data && busesArray.data.length > 0 ? busesArray.data[0].id : "";
            fetchTrips(filters)
            //  console.log('Company Details Data:', busesArray);
            return
        } catch (err: any) {
            console.error('Company to fetch bus', err);
            //  setError(err.message);
        } finally {
            //  setLoading(false);
        }

    }
    const getFullTripDetails = async (id: string) => {
        if (!token) return;
        setLoading(false);
        setDetailsLoading(true)
        ///setSelectedTrip(null)


        try {
            const data = await apiService.getTripDetails(token, id);
            const tripsArray = data || [];
            setSelectedTrip(tripsArray || null);
            if (tripsArray.sessions.length > 0) {

                const totalDuration = tripsArray.sessions.reduce((sum: number, item: any) => {
                    return sum + (item.duration_minutes ?? 0);
                }, 0);
                // console.log(totalDuration,"Pagination sdfsj")
                setTotalDuration(totalDuration)
            }
            // console.log('Trip Details Data:', tripsArray);
        } catch (err) {
            console.error('Failed to fetch stats', err);
        } finally {
            setLoading(false);
            setDetailsLoading(false)

        }
    };
    const fetchTrips = async (filterData: any) => {
        if (!token) return;

        try {

            // Call with filter
            setLoading(true);
            setSelectedTrip(null)
            setTrips([]);

            const data = await apiService.getTripsWithFilters(token, null, filterData);
            const tripsArray = data || [];

            if (trips.length == 0) {
                setTripDetailsEmpty(true)

            }
            setTrips(tripsArray.data);
            setCursor(tripsArray.next_cursor ?? "");
            setHasMore(tripsArray.has_more ?? false);
            // console.log('Trip Details Data:', tripsArray.has_more);
        } catch (err) {
            console.error('Failed to fetch trips', err);
        } finally {
            setLoading(false);
        }
    };
    const loadMoreTrips = async (filterData: any) => {
        if (!token || !cursor || loadingMore) return;

        try {
            setLoadingMore(true);
            const response = await apiService.getTripsWithFilters(token, cursor, filterData);
            setTrips((prev) => [...prev, ...response.data]);
            setCursor(response.next_cursor ?? "");
            setHasMore(response.has_more ?? false);
        } catch (err) {
            console.error('Failed to load more trips', err);
        } finally {
            setLoadingMore(false);
        }
    };
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in_progress':
                return 'bg-yellow-500 text-white';
            case 'completed':
                return 'bg-green-500 text-white';
            case 'cancelled':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };
    const handleFilterSubmit = (filterData: any) => {
        // console.log('Received filters:', filterData);

        // Update filters state
        setFilters({
            ...filters,
            ...filterData // Merge with filter data from child
        });


        // Fetch trips with new filters
        fetchTrips({
            ...filters,
            ...filterData
        });
    };

    const getStatusText = (status: string) => {
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };
    const convertMinutesToHours = (minutes: number) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs} h ${mins} m`;

    };
    const formatDate = (iso: string): string => {


        if (iso) {
            const [datePart, timePart] = iso.split("T");
            const [hourStr, minute, second] = timePart.replace("Z", "").split(":");

            let hours = parseInt(hourStr, 10);
            const ampm = hours >= 12 ? "pm" : "am";

            hours = hours % 12 || 12; // convert 0 to 12
            const formattedHours = String(hours).padStart(2, "0");
            const formattedSeconds = second.split(".")[0]; // remove milliseconds

            return `${datePart} ${formattedHours}:${minute}:${formattedSeconds} ${ampm}`;
        } else {
            return "";
        }

    }
    const handleItemView = (bus: any) => {
        // console.log(bus)
        router.push('/ticket-details')
        // setSelectedItem(bus);
    };

    return (
        <div>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-5">
                        <div className="px-1 lg:px-3">
                            <SessionViewFilterBar onFilterSubmit={handleFilterSubmit}
                                isLoading={loading} />

                        </div>
                        <div className="px-1 lg:px-3">

                            <div className="flex gap-4 ">
                                {/* Left Side - Trip List */}
                                <div className="w-[450px] flex-shrink-0 h-[calc(100vh-10px)]">
                                    <Card className="h-full flex border-0 shadow-none flex-col gap-0">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Trip Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                                            {loading ? (
                                                <div className="flex items-center justify-center h-64">
                                                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                                </div>
                                            ) : trips.length === 0 ? (
                                                <div className="flex items-center justify-center h-64">
                                                    <p className="text-gray-500">No trips found</p>
                                                </div>
                                            ) : (
                                                <>
                                                    {trips.map((trip) => (
                                                        <div
                                                            key={trip.id}
                                                            onClick={() => getFullTripDetails(trip.id)}
                                                            className={`cursor-pointer rounded-lg border-2 p-2 transition-all ${selectedTrip?.id === trip.id
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                                                                    <Badge className="bg-blue-100 text-white px-1 py-1 text-xs font-medium rounded-md w-[60px] h-[60px]">
                                                                        <img
                                                                            src="icons/session-view-bus-icon2.svg"
                                                                            alt="Bus"
                                                                            className="rounded-lg object-cover w-16 ml-2"
                                                                        />
                                                                    </Badge>

                                                                </div>

                                                                <CardContent className="flex flex-col w-full p-0">
                                                                    <div className="flex items-start justify-between">
                                                                        <div>
                                                                            <h3 className="text-[17px] font-semibold text-[#2D2D2D]">
                                                                                {trip.route_code} {trip.route_name}
                                                                            </h3>
                                                                        </div>

                                                                        {/* <Badge className="bg-blue-600 text-white px-1 py-1 text-[10px] font-medium rounded-md">
                                                                            {trip.code}
                                                                        </Badge> */}
                                                                    </div>

                                                                    <div className="flex items-center justify-between font-medium text-sm">
                                                                        <div>
                                                                            <p className="text-[#2D2D2D] font-semibold">Start Time</p>
                                                                            <p className="text-xs font-normal">{formatDate(trip.started_at) || 'N/A'}</p>
                                                                        </div>
                                                                        <div className="flex items-center justify-center flex-col pr-[3px]">
                                                                            {trip.completed_at !== null ? (<img src="/icons/line-session-view.svg" alt="Arrow Right" className="h-4 w-13 mb-1" />) : (<></>)}
                                                                        </div>
                                                                        <div>
                                                                            {trip.completed_at !== null ? (<> <p className="font-medium">End Time</p>
                                                                                <p className="text-xs font-normal">{trip.status == "in_progress" ? ('N/A') : (formatDate(trip.completed_at) || 'N/A')}</p></>) : ("")}

                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-end justify-between">
                                                                        <div className="mt-1 text-[15px] font-semibold text-gray-900">
                                                                            {trip.bus_registration_number}
                                                                        </div>
                                                                        <Badge className={`${getStatusColor(trip.status)} text-white text-xs font-medium px-3 py-1 rounded-md h-[30px] flex items-center`}>
                                                                            {getStatusText(trip.status)}
                                                                        </Badge>
                                                                        {/* <Badge className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-md h-[30px] flex items-center">
                                                                            {trip.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                                                                        </Badge> */}
                                                                    </div>
                                                                </CardContent>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* Loading More Indicator */}
                                                    {loadingMore && (
                                                        <div className="flex items-center justify-center py-4">
                                                            <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                                                            <span className="text-sm text-gray-600">Loading more trips...</span>
                                                        </div>
                                                    )}

                                                    {/* Intersection Observer Target */}
                                                    {hasMore && !loadingMore && (
                                                        <div ref={observerTarget} className="h-4" />
                                                    )}

                                                    {/* No More Trips Message */}
                                                    {!hasMore && trips.length > 0 && (
                                                        <div className="flex items-center justify-center py-4">
                                                            <span className="text-sm text-gray-500">No more trips to load</span>
                                                        </div>
                                                    )}
                                                </>
                                            )}


                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Right Side - Trip Details */}
                                <div className="flex-1 ">
                                    {selectedTrip && !detailsLoading ? (
                                        <div className="space-y-6">
                                            <Card className="h-full flex flex-col gap-0 py-0 p-0 border-0 shadow-none">

                                                <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                                                    {/* Header Stats */}
                                                    <Card className="h-full flex flex-col gap-0 py-2">
                                                        <CardHeader>
                                                            <div className="flex items-start justify-between">
                                                                <CardTitle className="text-lg">Trip Details</CardTitle>

                                                                <Badge variant="outline" className="text-sm px-4 py-2 rounded-[8px] bg-black text-white font-bold">
                                                                    {selectedTrip.code}
                                                                </Badge>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className='px-6'>
                                                            <div className="grid grid-cols-4 gap-3 text-center">
                                                                <div className="bg-blue-500 text-white rounded-lg p-4">
                                                                    <div className="text-base opacity-90">Total Revenue</div>
                                                                    <div className="text-2xl font-bold">Rs.{selectedTrip.metrics.total_revenue.toLocaleString()}</div>
                                                                </div>
                                                                <div className="bg-blue-500 text-white rounded-lg p-4">
                                                                    <div className="text-base opacity-90">Total Tickets</div>
                                                                    <div className="text-2xl font-bold">{selectedTrip.metrics.total_tickets.toLocaleString()}</div>

                                                                </div>
                                                                <div className="bg-blue-500 text-white rounded-lg p-4">
                                                                    <div className="text-base opacity-90">Full Tickets</div>
                                                                    <div className="text-2xl font-bold">{selectedTrip.metrics.full_tickets.toLocaleString()}</div>

                                                                </div>
                                                                <div className="bg-blue-500 text-white rounded-lg p-4">
                                                                    <div className="text-base opacity-90">Half Tickets</div>
                                                                    <div className="text-2xl font-bold">{selectedTrip.metrics.half_tickets.toLocaleString()}</div>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3 py-2 text-center">
                                                                <Card className="bg-blue-500 text-white py-3">
                                                                    <CardContent className="p-0">
                                                                        <p className="text-lg opacity-90">Total Revenue</p>
                                                                        <div className="grid grid-cols-3 gap-0 text-center">
                                                                            <div className="grid grid-cols-1 gap-0 text-center text-base"><span>Cash</span><span className='font-bold' >Rs.{selectedTrip.metrics.cash_revenue.toLocaleString()}</span></div>
                                                                            <div className="grid grid-cols-1 gap-0 text-center text-base"><span>Card</span><span className='font-bold'>Rs.{selectedTrip.metrics.card_revenue.toLocaleString()}</span></div>
                                                                            <div className="grid grid-cols-1 gap-0 text-cente text-base"><span>QR</span><span className='font-bold'>Rs.0</span></div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                                <Card className="bg-blue-500 text-white py-3">
                                                                    <CardContent className="p-0">
                                                                        <p className="text-lg opacity-90">Total Tickets</p>
                                                                        <div className="grid grid-cols-3 gap-0 text-center">
                                                                            <div className="grid grid-cols-1 gap-0 text-center text-base"><span>Cash</span><span className='font-bold'>0</span></div>
                                                                            <div className="grid grid-cols-1 gap-0 text-center text-base"><span>Card</span><span className='font-bold'>0</span></div>
                                                                            <div className="grid grid-cols-1 gap-0 text-cente text-base"><span>QR</span><span className='font-bold'>0</span></div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>

                                                            </div>

                                                            {/* Trip Information */}
                                                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
                                                                <div>
                                                                    <span className="text-sm text-gray-500 font-semibold">Bus Number: <span className="font-normal text-gray-800">{selectedTrip.bus_registration_number}</span></span>

                                                                </div>
                                                                <div>
                                                                    <span className="text-sm text-gray-500 font-semibold">Route Name:  <span className="font-normal text-gray-800">{selectedTrip.route_code} {selectedTrip.route_name}</span></span>

                                                                </div>
                                                                <div>
                                                                    <span className="text-sm text-gray-500 font-semibold">Started at: <span className="font-normal text-gray-800">{formatDate(selectedTrip.started_at)}</span></span>

                                                                </div>
                                                                <div>
                                                                    <span className="text-sm text-gray-500 font-semibold">Ended at: <span className="font-normal text-gray-800">{selectedTrip.completed_at !== null ? (formatDate(selectedTrip.completed_at)) : ("N/A")}</span></span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-sm text-gray-500 font-semibold">Started Location: <span className="font-normal text-gray-800">{selectedTrip.sessions.length > 0 ? (selectedTrip.sessions[0].start_stop_name) : ("")}</span></span>

                                                                </div>
                                                                <div>
                                                                    <span className="text-sm text-gray-500 font-semibold">Ended Location: <span className="font-normal text-gray-800">{selectedTrip.sessions.length > 0 ? (selectedTrip.sessions[0].end_stop_name) : ("")}</span></span>
                                                                </div>

                                                                <div>
                                                                    <span className="text-sm text-gray-500 font-semibold">Conductor Name: <span className="font-normal text-gray-800">{selectedTrip.sessions.length > 0 ? (selectedTrip.sessions[0].conductor_full_name) : ("")}</span></span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-sm text-gray-500 font-semibold">Total Duration: <span className="font-medium font-normal text-gray-800">{selectedTrip.sessions.length > 0 ? (convertMinutesToHours(totalDuration)) : ("")}</span></span>

                                                                </div>
                                                                <div>
                                                                    <span className="text-sm text-gray-500 font-semibold">Status:</span>
                                                                    <Badge className={`${getStatusColor(selectedTrip.status)} ml-2 h-[30px]`}>
                                                                        {getStatusText(selectedTrip.status)}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>

                                                    {/* Session Details */}
                                                    {selectedTrip.sessions.length > 0 && (
                                                        <Card className='py-2 gap-3'>
                                                            <CardHeader className="flex flex-row items-center justify-between">
                                                                <CardTitle className="text-lg"> Session Details</CardTitle>
                                                                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={handleItemView}>
                                                                    Ticket Table →
                                                                </Button>
                                                            </CardHeader>
                                                            <CardContent className="space-y-4">
                                                                {selectedTrip.sessions.map((session: any) => (
                                                                    <div key={session.id} className="border rounded-lg p-4">
                                                                        {/* Session Header */}
                                                                        <div className="flex items-center justify-between mb-4">
                                                                            <div className="flex items-center gap-4">
                                                                                <div className=" text-[#0F61AE] rounded-lg px-2 py-2 flex items-center justify-between">
                                                                                    <div className="flex items-start gap-2">

                                                                                        <div>
                                                                                            <div className="text-base font-medium text-red">{session.start_stop_name}</div>
                                                                                            <div className="text-[13px] opacity-80">{formatDate(session.started_at)}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1 pl-2 pr-3">

                                                                                        <div>
                                                                                            <img src="/icons/session-view-line.svg" alt="Arrow Right" className="h-4 w-13 mb-1" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-start gap-2">

                                                                                        <div>
                                                                                            <div className="text-base font-medium">{session.end_stop_name}</div>
                                                                                            <div className="text-[13px] opacity-80">{session.completed_at !== null ? (formatDate(session.completed_at)) : ("")}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                            <div className="flex items-center  gap-2">
                                                                                <Badge className={`${getStatusColor(session.status)} font-medium text-sm`}>
                                                                                    {getStatusText(session.status)}
                                                                                </Badge>
                                                                                <Badge variant="outline" className="bg-black font-medium text-sm text-[#FFFFFF]">{convertMinutesToHours(session.duration_minutes)}</Badge>
                                                                                <Badge variant="outline" className="bg-[#032D5D] font-medium text-sm text-[#FFFFFF]">S {session.session_number}</Badge>
                                                                            </div>
                                                                        </div>

                                                                        {/* Session Stats */}
                                                                        <div className="grid grid-cols-4 gap-4 mb-4">
                                                                            <div className="bg-[#EDEDED] h-[55px] rounded-lg text-center py-1">
                                                                                <div className="text-[15px] text-gray-700">Total Revenue</div>
                                                                                <div className="text-lg font-bold">Rs.{session.total_revenue.toLocaleString()}</div>
                                                                            </div>
                                                                            <div className="bg-[#EDEDED] h-[55px] rounded-lg text-center py-1">
                                                                                <div className="text-[15px] text-gray-700">Total Tickets</div>
                                                                                <div className="text-lg font-bold">{session.total_tickets}</div>

                                                                            </div>
                                                                            <div className="bg-[#EDEDED] h-[55px] rounded-lg text-center py-1">
                                                                                <div className="text-[15px] text-gray-700">Full Tickets</div>
                                                                                <div className="text-lg font-bold">{session.full_tickets}</div>
                                                                            </div>
                                                                            <div className="bg-[#EDEDED] h-[55px] rounded-lg text-center py-1">
                                                                                <div className="text-[15px] text-gray-700">Half Tickets</div>
                                                                                <div className="text-lg font-bold">{session.half_tickets}</div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Session Info */}
                                                                        <div className="grid grid-cols-4 gap-4 text-sm">
                                                                            <div>
                                                                                <span className="text-gray-500 text-sm font-semibold">Started Location</span>
                                                                                <p className="font-normal text-sm">{session.start_stop_name}</p>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-gray-500 text-sm font-semibold">Ended Location</span>
                                                                                <p className="font-normal">{session.end_stop_name}</p>
                                                                            </div>

                                                                            <div>
                                                                                <span className="text-gray-500 text-sm font-semibold">Conductor Name</span>
                                                                                <p className="font-normal">{session.conductor_full_name}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ) : (

                                        <div className="flex items-center justify-center h-64 gap-3">

                                            {trips.length === 0 ? (
                                                <p className="text-gray-500">No trip selected</p>
                                            ) : (
                                                <div>
                                                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                                                    <p className="mt-4 text-gray-600">Loading...</p>
                                                </div>
                                            )}

                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}