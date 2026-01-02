'use client'

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AvailableStop {
  id: string;
  stop_name_en: string;
  stop_name_si: string;
  stop_name_tm: string;
  stop_code: string;
  latitude: number;
  longitude: number;
}

interface SelectedStop {
  stop_id: string;
  sequence_number: number;
  distance_from_start: number;
}
interface BusStopMapPoint {
  position: [number, number];
  popup: string;

}

interface EditMode {
  type: string | null;
  id: string | null;
}
type StopInput = {
  id: string;
  stop_name_si: string;
  stop_name_en: string;
  stop_name_tm: string;
  stop_code: string;
  sequence_number: number;
  distance_from_start_km: number;
  latitude: number;
  longitude: number;
};

type StopOutput = {
  stop_id: string;
  sequence_number: number;
  distance_from_start: number;
};

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DetailPopup } from '@/components/detail-popup'
import { useNavbar } from "@/context/navbar-context"
import { useAuth } from '@/hooks/useAuth';
import { RouteCard } from "@/components/route/route-card";
import { AppWindowIcon, CodeIcon, Eye, Navigation, Plus, MapPin, ChevronUp, ChevronDown, Map, Trash2, X, Check, ChevronsUpDown, Loader2, AlertCircle } from "lucide-react"
import { RouteData, StopFaresResponse } from '@/types/route';
import GoogleMapComponent from "@/components/map";
import RouteFormAddBus from "@/components/route/route-form-add-bus";
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { apiService } from '@/services/api';
import { DirectionsFormData } from '@/types/direction';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSearchParams } from 'next/navigation';

export default function RouteView() {
  const [selectedItem, setSelectedItem] = useState(null)
  const { setNavbarData } = useNavbar();
  const [expandedStops, setExpandedStops] = useState<Record<string, boolean>>({});
  const [showAddStopsModal, setShowAddStopsModal] = useState(false);
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stopFaresData, setStopFaresData] = useState<{ [key: string]: StopFaresResponse }>({});
  const [loadingStops, setLoadingStops] = useState<{ [key: string]: boolean }>({});
  const [fareErrors, setFareErrors] = useState<{ [key: string]: string }>({});

  const [routeData, setRouteData] = useState<RouteData>({
    route: {
      id: "",
      code: "",
      name: "",
      status: ""
    },
    directions: [],
  });
  const [routeinfo, setRouteinfo] = useState({});
  const [filters, setFilters] = useState<any>({
    // company_id: COMPANY_ID,
    offset: 0,
    limit: 10,

  });
  const [fares, setFares] = useState([
    {
      id: "fare-1",
      direction_id: "4e18a51e-d67a-499f-a30a-3535d99ff469",
      from_stop_id: "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
      to_stop_id: "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
      effective_from: "2024-01-15",
      effective_to: "2024-12-31",
      status: "active",
      categories: [
        { category_id: "normal", name: "Normal", full_amount: 100.00, half_amount: 50.00 },
        { category_id: "Semi-Luxury", name: "Semi-Luxury", full_amount: 150.00, half_amount: 75.00 },
        { category_id: "Semi-Luxury2", name: "Semi-Luxury2", full_amount: 150.00, half_amount: 75.00 }
      ]
    },
    {
      id: "fare-1",
      direction_id: "4e18a51e-d67a-499f-a30a-3535d99ff469",
      from_stop_id: "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
      to_stop_id: "364ed844-23c1-4771-bc8a-a07e57b9fd0e",
      effective_from: "2024-01-15",
      effective_to: "2024-12-31",
      status: "active",
      categories: [
        { category_id: "normal", name: "Normal", full_amount: 100.00, half_amount: 50.00 },
        { category_id: "Semi-Luxury", name: "Semi-Luxury", full_amount: 150.00, half_amount: 75.00 },
        { category_id: "Semi-Luxury2", name: "Semi-Luxury2", full_amount: 150.00, half_amount: 75.00 }
      ]
    },
    {
      id: "fare-2",
      direction_id: "912db840-d947-4a54-957c-cd6096a8321e",
      from_stop_id: "70711f6d-5aae-4195-95f2-e3c84a83ba32",
      to_stop_id: "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
      effective_from: "2024-01-15",
      effective_to: "2024-12-31",
      status: "active",
      categories: [
        { category_id: "normal", name: "Normal", full_amount: 500.00, half_amount: 250.00 },
        { category_id: "semi-luxury", name: "Semi-Luxury", full_amount: 750.00, half_amount: 375.00 }
      ]
    }
  ]);
  const [selectedStopsToAdd, setSelectedStopsToAdd] = useState<SelectedStop[]>([]);
  const [busStopsMapPoint, setBusStopsMapPoint] = useState<BusStopMapPoint[]>([]);
  const [currentDirectionId, setCurrentDirectionId] = useState<string | null>(null);
  const [stopSearchQuery, setStopSearchQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [busStopUpdate, setBusStopUpdate] = useState<boolean>(false);
  const [isDirectionCreate, setIsDirectionCreate] = useState<boolean>(false);
  const [commandSearch, setCommandSearch] = useState<string>('');
  const [directionId, setDirectionId] = useState<string>('');
  const [reverseDirectionId, setReverseDirectionId] = useState<string>('');
  const [forwardDirectionId, setForwardDirectionId] = useState<string>('');

  const [error, setError] = useState('');
  const [availableStops, setAvailableStops] = useState<AvailableStop[]>([]);


  const searchParams = useSearchParams();
  const route_id = searchParams.get('id');
  const toggleStop = async (stopId: string, directionId: string): Promise<void> => {
    const isCurrentlyExpanded = expandedStops[stopId];

    setExpandedStops(prev => {
      // If the clicked stop is already expanded, close it
      if (prev[stopId]) {
        return { ...prev, [stopId]: false };
      }
      // Otherwise, close all others and open only the clicked one
      return { [stopId]: true };
    });

    // Fetch fares when expanding
    if (!isCurrentlyExpanded) {
      await fetchStopFares(directionId, stopId);
    }
  };


  useEffect(() => {
    setNavbarData("Route Management", "Route Management/Route/ View");
    fetchRouteData(filters, route_id ?? "")
    fetchAvailableStop()
    // fetchStats();
  }, [token, setNavbarData]);


  const fetchAvailableStop = async () => {
    if (!token) return;
    try {

      // Call with filter
      setLoading(true)
      const data = await apiService.getBusStopWithFilters(token, filters);
      const busesArray = data || [];
      setAvailableStops(busesArray)
      //  setBuses(busesArray);
      console.log('Bus Stop list Details Data:', busesArray);
    } catch (err) {
      console.error('Failed to fetch bus', err);
    } finally {
      setLoading(false);
    }
  }

  function transformStops(input: any[]): { stops: any[] } {
    const stops = input.map((item) => ({
      stop_id: item.id,
      sequence_number: item.sequence_number,
      distance_from_start: item.distance_from_start_km,
    }));

    return { stops };
  }
  function mapViewStops(input: StopInput[]): { stops: BusStopMapPoint[] } {
    const stops = input.map((stop) => ({
      position: [stop.latitude, stop.longitude] as [number, number],
      popup: `${stop.stop_name_en}`, // You can customize text here
    }));

    return { stops };
  }
  const fetchStopFares = async (directionId: string, stopId: string) => {
    const cacheKey = `${directionId}-${stopId}`;
    if (!token) return;
    // If already loaded, don't fetch again
    // if (stopFaresData[cacheKey]) {
    //   return;
    // }

    setLoadingStops(prev => ({ ...prev, [cacheKey]: true }));
    setFareErrors(prev => ({ ...prev, [cacheKey]: '' }));

    try {
      const data = await apiService.getFaresToBusStop(token, directionId, stopId);
      console.log('fetching stop fares:', data)


      setStopFaresData(prev => ({
        ...prev,
        [cacheKey]: data
      }));
    } catch (error) {
      console.error('Error fetching stop fares:', error);
      setFareErrors(prev => ({
        ...prev,
        [cacheKey]: 'Failed to load fares. Please try again.'
      }));
    } finally {
      setLoadingStops(prev => ({ ...prev, [cacheKey]: false }));
    }
  };
  const fetchRouteData = async (filterData: any, id: string) => {
    if (!token) return;
    try {

      // Call with filter
      setLoading(true)
      const data = await apiService.getRouteData(token, id,);
      const busesArray = data || [];
      console.log(busesArray, "rtrtrtrtrtlllllll")
      setRouteData(busesArray)
      setRouteinfo(busesArray.route)
      if (busesArray.directions.length > 0) {
        const output = mapViewStops(busesArray.directions[0].stops);
        setBusStopsMapPoint(output.stops)
      }

      if (busesArray.directions.length >= 2) {
        setIsDirectionCreate(false)

      } else {
        setIsDirectionCreate(true)
      }
      setDirectionId(busesArray.directions[0].id)
      setForwardDirectionId(busesArray.directions[0].id)
      setReverseDirectionId(busesArray.directions[1].id)
      const selectedBustop = transformStops(busesArray.directions[0].stops).stops
      setSelectedStopsToAdd(selectedBustop)
      if (selectedBustop.length > 0) {
        setBusStopUpdate(true)
      }

    } catch (err) {
      console.error('Route Permits d', err);
    } finally {
      setLoading(false);
    }

  }
  const handleFormSubmit = async (data: DirectionsFormData) => {
    if (!token) return;
    try {
      setError("");
      console.log(data)
      const createRespone = await apiService.createdirection(token, data);
      console.log(createRespone)
      if (createRespone.success) {
        fetchRouteData(filters, route_id ?? "")
        return true
      }
    } catch (err: any) {
      console.log(err.message);
      return false
      setError(err.message);
    } finally {

    }


  }
  const handleAddStopsClick = (directionId: string) => {
    setCurrentDirectionId(directionId);
    setSelectedStopsToAdd([]);
    setStopSearchQuery('');
    setShowAddStopsModal(true);
  };
  const handleStopSelection = (stopId: string) => {
    setSelectedStopsToAdd(prev => {
      const exists = prev.find(s => s.stop_id === stopId);
      if (exists) return prev.filter(s => s.stop_id !== stopId);
      const direction = routeData.directions.find(d => d.id === currentDirectionId);
      const nextSequence = direction ? direction.stops.length + prev.length + 1 : prev.length + 1;
      return [...prev, { stop_id: stopId, sequence_number: nextSequence, distance_from_start: 0 }];
    });
  };
  const handleDistanceChange = (stopId: string, distance: string) => {
    setSelectedStopsToAdd(prev => prev.map(s => s.stop_id === stopId ? { ...s, distance_from_start: parseFloat(distance) || 0 } : s));
  };

  const handleSequenceChange = (stopId: string, sequence: string) => {
    setSelectedStopsToAdd(prev => prev.map(s => s.stop_id === stopId ? { ...s, sequence_number: parseInt(sequence) || 1 } : s));
  };
  const handleSaveStops = async () => {
    if (!token) return;
    if (selectedStopsToAdd.length === 0) {
      alert('Please select at least one stop');
      return;
    }
    let setBustopArray = selectedStopsToAdd.map(s => ({
      stop_id: s.stop_id,
      sequence_number: s.sequence_number,
      distance_from_start: s.distance_from_start
    }))

    const payload = {
      forward_direction_id: directionId == forwardDirectionId ? forwardDirectionId : reverseDirectionId,
      reverse_direction_id: directionId == forwardDirectionId ? reverseDirectionId : forwardDirectionId,
      stops: [...setBustopArray].sort(
        (a, b) => a.sequence_number - b.sequence_number
      )
    };
    if (busStopUpdate) {
      try {
        setError("");

        const createRespone = await apiService.updateBothDirectionStops(token, payload);
        console.log(createRespone)
        if (createRespone.success) {
          setShowAddStopsModal(false);
          setSelectedStopsToAdd([]);
          setCurrentDirectionId(null);
          fetchRouteData(filters, route_id ?? "")
          // setShowForm(false);
          // fetchBuses(filters)
        }
      } catch (err: any) {
        console.log(err.message);
        setError(err.message);
      } finally {

      }

    } else {
      try {
        setError("");

        const createRespone = await apiService.createDirectionStops(token, payload);
        console.log(createRespone)
        if (createRespone.success) {
          setShowAddStopsModal(false);
          setSelectedStopsToAdd([]);
          setCurrentDirectionId(null);
          fetchRouteData(filters, route_id ?? "")
          // setShowForm(false);
          // fetchBuses(filters)
        }
      } catch (err: any) {
        console.log(err.message);
        setError(err.message);
      } finally {

      }
    }



  };
  const getFilteredStops = () => {
    const direction = routeData.directions.find(d => d.id === currentDirectionId);
    const addedStopIds = direction?.stops.map(s => s.id) || [];

    return availableStops.filter(stop => {
      const searchQuery = commandSearch.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        stop.stop_name_en.toLowerCase().includes(searchQuery) ||
        stop.stop_name_si.includes(commandSearch) ||
        stop.stop_name_tm.includes(commandSearch) ||
        stop.stop_code.toLowerCase().includes(searchQuery);

      return matchesSearch && !addedStopIds.includes(stop.id);
    });
  };
  const getSelectedStopDetails = (stopId: string) => {
    return availableStops.find(s => s.id === stopId);
  };
  const addBustopView = () => {
    console.log(selectedStopsToAdd)
    setShowAddStopsModal(true)
  };
  const setBusStopForDirection = (BusStopArray: any[], direction_id: string) => {
    setDirectionId(direction_id)
    setSelectedStopsToAdd(transformStops(BusStopArray).stops)
    // const output = mapViewStops(busesArray.directions[0].stops);
    setBusStopsMapPoint(mapViewStops(BusStopArray).stops)
  };
  return (
    <div>

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-2 md:py-5">
            <div className="px-1 lg:px-3">
              <RouteCard initialData={null} onSubmit={handleFormSubmit} routeDataSet={routeinfo} directionCreate={isDirectionCreate} />


            </div>
            <div className='px-1 lg:px-3'>
              <div className="flex w-full flex-col gap-6">
                {routeData?.directions?.[0]?.id ? (<Tabs defaultValue={routeData?.directions?.[0]?.id ?? ""}>

                  <TabsList>
                    {routeData.directions.map((direction, idx) => (
                      <TabsTrigger
                        key={direction?.id ?? idx}   // ✅ Add key
                        value={direction?.id ?? ""}
                        onClick={() => setBusStopForDirection(direction.stops, direction.id)}
                        className="h-9">
                        <div >
                          <div className="flex items-center gap-3 justify-between ">
                            <h3 className="text-base ">Direction {idx + 1}</h3>
                            <Navigation className="w-5 h-5" />
                          </div>

                        </div>

                      </TabsTrigger>
                    ))}

                  </TabsList>
                  {routeData.directions.map((direction, idx) => (
                    <TabsContent
                      key={direction?.id ?? idx}   // ✅ Add key
                      value={direction?.id ?? ""}

                      className='w-full'>
                      <Card className='gap-3'>
                        <CardHeader>
                          <CardTitle className='font-bold'>{direction.start_location} → {direction.end_location}</CardTitle>
                          <CardAction>

                            <Button
                              onClick={addBustopView}

                              className="flex items-center gap-2 text-white font-medium rounded-[14px] px-5 py-2 bg-gradient-to-r from-[#0F90EE] to-[#276CCC] hover:opacity-90 shadow-md"
                            >
                              <Plus className="w-4 h-4" />
                              {busStopUpdate ? "Update" : "Add"} Bus Stop
                            </Button>
                          </CardAction>
                          <CardDescription>
                            <div className="p-0">
                              {/* Route Info */}
                              <div className="grid grid-cols-2 gap-4 mb-1">
                                <div className="grid grid-cols-2 gap-4 mb-1">
                                  <div>
                                    <p className="text-sm text-gray-600">Total Distance</p>
                                    <p className="font-semibold text-gray-900">{direction.total_distance_km} km</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Estimated Duration</p>
                                    <p className="font-semibold text-gray-900">{direction.estimated_duration_minutes} min</p>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div data-orientation="horizontal" role="none" data-slot="separator" className="bg-border mb-3 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-0"></div>

                          <div className="flex min-h-screen bg-white">

                            {/* Left side - Form */}
                            <div className="flex w-full flex-col justify-between bg-white  sm:w-802/1452 object-contain pr-2 ">

                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-5 h-5 text-blue-600" />
                                      <span className="font-semibold text-gray-700">Bus Stops</span>
                                      <span className="text-sm text-gray-500">({direction.stops.length} stops)</span>
                                    </div>
                                  </div>
                                  {/* <button className="flex items-center gap-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm">
                                    <Plus className="w-4 h-4" />
                                    Add Stop
                                  </button> */}
                                </div>



                                <div className="space-y-2 max-h-160 overflow-y-auto">
                                  {direction.stops.length > 0 ? (<>{direction.stops.map((stop, stopIdx) => {
                                    const stopFares = fares.filter(
                                      fare => fare.direction_id === direction.id && fare.from_stop_id === stop.id
                                    );
                                    const cacheKey = `${direction.id}-${stop.id}`;
                                    const isExpanded = expandedStops[stop.id];
                                    const isLoading = loadingStops[cacheKey];
                                    const fareData = stopFaresData[cacheKey];
                                    const error = fareErrors[cacheKey];

                                    return (
                                      <div key={stop.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                        <button
                                          onClick={() => toggleStop(stop.id, direction.id)}
                                          className="w-full flex items-center gap-2 p-3 bg-white hover:bg-gray-50 transition-colors"
                                        >
                                          <div className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            <img src={"/icons/route_bus.svg"}></img>
                                          </div>
                                          <div className="flex-1 text-left">
                                            <span className="font-semibold text-gray-800">{stop.stop_name_en}</span>
                                            <span className="ml-2 text-xs text-gray-500">({stop.stop_code})</span>
                                          </div>
                                          <span className="text-xs text-gray-500">{stop.distance_from_start_km} km</span>
                                          {stopFares.length > 0 && (
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                              {stopFares.length} {stopFares.length === 1 ? 'fare' : 'fares'}
                                            </span>
                                          )}
                                          {isExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-gray-600" />
                                          ) : (
                                            <ChevronDown className="w-4 h-4 text-gray-600" />
                                          )}
                                        </button>

                                        {isExpanded && (
                                          <div className="p-3 bg-white border-t">
                                            <div className="mb-3 pb-3 border-b">
                                              <p className="text-xs text-gray-600 mb-1">
                                                <strong>සිංහල:</strong> {stop.stop_name_si}
                                              </p>
                                              <p className="text-xs text-gray-600 mb-1">
                                                <strong>தமிழ்:</strong> {stop.stop_name_tm}
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                📍 {stop.latitude.toFixed(6)}, {stop.longitude.toFixed(6)}
                                              </p>
                                            </div>

                                            {isLoading ? (
                                              <div className="flex items-center justify-center py-6">
                                                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                                                <span className="ml-2 text-sm text-gray-600">Loading fares...</span>
                                              </div>
                                            ) : error ? (
                                              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                <p className="text-sm text-red-600">{error}</p>
                                                <button
                                                  onClick={() => fetchStopFares(direction.id, stop.id)}
                                                  className="mt-2 text-xs text-blue-600 hover:underline"
                                                >
                                                  Retry
                                                </button>
                                              </div>
                                            ) : fareData && fareData.fares.length > 0 ? (
                                              <div className="space-y-2">
                                                <h5 className="text-xs font-semibold text-gray-700 mb-2">Fares from this stop:</h5>
                                                {[...fareData.fares].sort(
                                                  (a, b) => a.distance_km - b.distance_km
                                                ).map((fare, fareIdx) => (
                                                  <div key={fareIdx} className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
                                                    <div className="flex items-center gap-2 mb-2">
                                                      <Navigation className="w-4 h-4 text-green-600" />
                                                      <span className="font-medium text-sm text-gray-800">
                                                        To: {fare.to_stop.stop_name_en}
                                                      </span>
                                                      <span className="text-xs text-gray-500 ml-auto">
                                                        {fare.distance_km} km
                                                      </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                      {fare.categories.map((cat, catIdx) => (
                                                        <div key={catIdx} className="bg-white p-2 rounded shadow-sm">
                                                          <div className="text-xs text-gray-600 mb-1">{cat.category_name}</div>
                                                          <div className="font-bold text-sm text-blue-700">
                                                            Full: LKR {cat.full_amount_lkr}
                                                          </div>
                                                          <div className="font-bold text-sm text-purple-700">
                                                            Half: LKR {cat.half_amount_lkr}
                                                          </div>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            ) : (
                                              stopIdx < direction.stops.length - 1 && (
                                                <p className="text-xs text-gray-400 italic">No fares configured from this stop</p>
                                              )
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}</>) : (<><p className="text-xs text-gray-400 italic">No bus stop configured from this directions</p></>)}

                                </div>

                              </div>

                            </div>


                            {/* Right side - Illustration */}
                            <div className="flex w-full flex-col justify-between bg-white  sm:w-650/1452 object-contain pr-2   ">
                              {direction.stops.length > 0 ? (<div>
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <Map className="w-5 h-5 text-blue-600" />
                                      <span className="font-semibold text-gray-700">Map</span>

                                    </div>
                                  </div>
                                  {/* <button className="flex items-center gap-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm">
                                    <Plus className="w-4 h-4" />
                                    Add Stop
                                  </button> */}
                                </div>
                                <GoogleMapComponent
                                  center={[6.93194, 79.8478]}
                                  zoom={9}
                                  markers={busStopsMapPoint}
                                />

                              </div>) : (<></>)}



                            </div>
                          </div>
                        </CardContent>

                      </Card>
                    </TabsContent>
                  ))}


                </Tabs>) : ("")}

              </div>
            </div>

            {/* <SectionCards /> */}


            {showAddStopsModal && (
              // data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed 
              <div className="fixed inset-0 z-50 bg-black/50 bg-opacity-500 flex items-center justify-center  p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl h-full w-full max-h-[10 0vh] overflow-hidden flex flex-col">
                  <div className="bg-gradient-to-r  text-white p-1  flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800 px-3">Add Bus Stops</h3>
                    <button onClick={() => setShowAddStopsModal(false)} className="hover:bg-white/20 rounded p-3"><X className="w-6 h-6" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4">
                    {/* Shadcn Multi-select Dropdown */}
                    <div className="mb-6">
                      <label className="block text-xm font-medium mb-2">Select Bus Stops</label>
                      <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={isDropdownOpen}
                            className="w-full justify-between h-auto min-h-[42px] py-2 w-full"
                          >
                            <div className="flex flex-wrap gap-1 flex-1">
                              {selectedStopsToAdd.length === 0 ? (
                                <span className="text-muted-foreground">Select stops...</span>
                              ) : (
                                selectedStopsToAdd.map(sel => {
                                  const stop = getSelectedStopDetails(sel.stop_id);
                                  return (
                                    <Badge key={sel.stop_id} variant="secondary" className="mr-1">
                                      {stop?.stop_name_en}
                                      <span
                                        role="button"
                                        className="ml-1 hover:bg-muted rounded-full"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStopSelection(sel.stop_id);
                                        }}
                                      >
                                        <X className="h-3 w-3" />
                                      </span>
                                    </Badge>
                                  );
                                })
                              )}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[600px] p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="Search stops by name or code..."
                              value={commandSearch}
                              onValueChange={setCommandSearch}
                            />
                            <CommandEmpty>No stops found.</CommandEmpty>
                            <CommandGroup className="max-h-[300px] overflow-auto">
                              {getFilteredStops().map((stop) => {
                                const isSelected = selectedStopsToAdd.some(s => s.stop_id === stop.id);
                                return (
                                  <CommandItem
                                    key={stop.id}
                                    value={`${stop.stop_name_en} ${stop.stop_code} ${stop.stop_name_si} ${stop.stop_name_tm}`}
                                    onSelect={() => handleStopSelection(stop.id)}
                                  >
                                    <div className="flex items-center gap-3 w-full">
                                      <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-input'
                                        }`}>
                                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium">{stop.stop_name_en}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                          <span className="font-mono">{stop.stop_code}</span>
                                          <span>•</span>
                                          <span className="truncate">{stop.stop_name_si}</span>
                                          <span>•</span>
                                          <span className="truncate">{stop.stop_name_tm}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {selectedStopsToAdd.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {selectedStopsToAdd.length} stop{selectedStopsToAdd.length !== 1 ? 's' : ''} selected
                        </p>
                      )}
                    </div>

                    {/* Selected Stops Configuration */}
                    {selectedStopsToAdd.length > 0 && (

                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <span>Configure Selected Stops</span>
                          <Badge variant="outline">{selectedStopsToAdd.length}</Badge>
                        </h4>
                        <div className='grid grid-cols-2 gap-2'>
                          {selectedStopsToAdd.map((sel, idx) => {
                            const stopDetails = availableStops.find(s => s.id === sel.stop_id);
                            return (
                              <div key={sel.stop_id} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{idx + 1}</div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{stopDetails?.stop_name_en}</p>
                                    <p className="text-xs text-gray-600 truncate">{stopDetails?.stop_code}</p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStopSelection(sel.stop_id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-100"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium mb-1 text-gray-700">Sequence Number</label>
                                    <input
                                      type="number"
                                      value={sel.sequence_number}
                                      onChange={e => handleSequenceChange(sel.stop_id, e.target.value)}
                                      className="w-full h-[65%] px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"

                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium mb-1 text-gray-700">Distance from Start (km)</label>
                                    <input
                                      type="number"

                                      value={sel.distance_from_start}
                                      onChange={e => handleDistanceChange(sel.stop_id, e.target.value)}
                                      className="w-full h-[65%]  px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"

                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t p-4 bg-gray-50 flex gap-3 justify-end">
                    {error && (
                      <Alert variant="destructive" className="border-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="ml-2">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}
                    <Button variant="outline" onClick={() => setShowAddStopsModal(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveStops}
                      disabled={selectedStopsToAdd.length === 0}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      {busStopUpdate ? "Update" : "Add"}  {selectedStopsToAdd.length} Stop{selectedStopsToAdd.length !== 1 ? 's' : ''}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}