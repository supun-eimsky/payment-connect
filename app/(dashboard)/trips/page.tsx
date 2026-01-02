'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X, MapPin, Navigation, Map, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

// Types
interface Route {
  id: string;
  code: string;
  name: string;
  status: string;
}

interface Stop {
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

interface Direction {
  id: string;
  start_location: string;
  end_location: string;
  total_distance_km: number;
  estimated_duration_minutes: number;
  status: string;
  stops: Stop[];
}

interface RouteData {
  route: Route;
  directions: Direction[];
}

interface FareCategory {
  category_id: string;
  category_name: string;
  full_amount_lkr: number;
  half_amount_lkr: number;
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

interface FareDetail {
  to_stop: ToStop;
  distance_km: number;
  categories: FareCategory[];
}

interface StopFaresResponse {
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

interface EditMode {
  type: string | null;
  id: string | null;
}

type TabType = 'overview' | 'directions' | 'fares';

const BusTicketSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<EditMode>({ type: null, id: null });
  const [formData, setFormData] = useState<Partial<Direction>>({});
  const mapRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [expandedStops, setExpandedStops] = useState<{ [key: string]: boolean }>({});
  const [showStopsSection, setShowStopsSection] = useState<{ [key: string]: boolean }>({});
  
  // Store fetched fares data by stop
  const [stopFaresData, setStopFaresData] = useState<{ [key: string]: StopFaresResponse }>({});
  const [loadingStops, setLoadingStops] = useState<{ [key: string]: boolean }>({});
  const [fareErrors, setFareErrors] = useState<{ [key: string]: string }>({});

  const [routeData, setRouteData] = useState<RouteData>({
    route: {
      id: "1b1ddc53-ab3e-4265-9d81-513099f5eefb",
      code: "138",
      name: "Colombo - Galle Expressway Service",
      status: "active"
    },
    directions: [
      {
        id: "4e18a51e-d67a-499f-a30a-3535d99ff469",
        start_location: "Colombo Fort",
        end_location: "Galle",
        total_distance_km: 116.8,
        estimated_duration_minutes: 150,
        status: "active",
        stops: [
          {
            id: "5cd6613e-d8c3-4a24-ab40-02cb30bd0101",
            stop_name_si: "කොළඹ කොටුව",
            stop_name_en: "Colombo Fort",
            stop_name_tm: "கொழும்பு கோட்டை",
            stop_code: "1",
            sequence_number: 1,
            distance_from_start_km: 0,
            latitude: 6.9271,
            longitude: 79.8612
          },
          {
            id: "92be4983-8f5f-4759-9471-7d2be4bbb9ff",
            stop_name_si: "බම්බලපිටිය",
            stop_name_en: "Bambalapitiya",
            stop_name_tm: "பம்பலப்பிட்டி",
            stop_code: "2",
            sequence_number: 2,
            distance_from_start_km: 6.2,
            latitude: 6.8905,
            longitude: 79.8567
          }
        ]
      },
      {
        id: "912db840-d947-4a54-957c-cd6096a8321e",
        start_location: "Galle",
        end_location: "Colombo Fort",
        total_distance_km: 116.8,
        estimated_duration_minutes: 160,
        status: "active",
        stops: [
          {
            id: "70711f6d-5aae-4195-95f2-e3c84a83ba32",
            stop_name_si: "ගාල්ල",
            stop_name_en: "Galle",
            stop_name_tm: "காலி",
            stop_code: "12",
            sequence_number: 1,
            distance_from_start_km: 0,
            latitude: 6.0535,
            longitude: 80.221
          }
        ]
      }
    ]
  });

  // Fetch fares for a specific stop
  const fetchStopFares = async (directionId: string, stopId: string): Promise<void> => {
    const cacheKey = `${directionId}-${stopId}`;
    
    // If already loaded, don't fetch again
    if (stopFaresData[cacheKey]) {
      return;
    }

    setLoadingStops(prev => ({ ...prev, [cacheKey]: true }));
    setFareErrors(prev => ({ ...prev, [cacheKey]: '' }));

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/fares?direction_id=${directionId}&from_stop_id=${stopId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: StopFaresResponse = await response.json();
      
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

  const handleEdit = (type: string, item: Direction): void => {
    setEditMode({ type, id: item.id });
    setFormData(item);
  };

  const handleSave = (): void => {
    setEditMode({ type: null, id: null });
    setFormData({});
  };

  const handleCancel = (): void => {
    setEditMode({ type: null, id: null });
    setFormData({});
  };

  const getStopName = (stopId: string, directionId: string): string => {
    const direction = routeData.directions.find(d => d.id === directionId);
    const stop = direction?.stops.find(s => s.id === stopId);
    return stop?.stop_name_en || 'Unknown';
  };

  const toggleStop = async (stopId: string, directionId: string): Promise<void> => {
    const isCurrentlyExpanded = expandedStops[stopId];
    
    setExpandedStops(prev => ({
      ...prev,
      [stopId]: !prev[stopId]
    }));

    // Fetch fares when expanding
    if (!isCurrentlyExpanded) {
      await fetchStopFares(directionId, stopId);
    }
  };

  const toggleStopsSection = (directionId: string): void => {
    setShowStopsSection(prev => ({
      ...prev,
      [directionId]: !prev[directionId]
    }));
  };

  // Map component for each direction
  const DirectionMap: React.FC<{ direction: Direction }> = ({ direction }) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = (window as any).L;
      if (!L) return;

      const stops = direction.stops;
      if (stops.length === 0) return;

      const avgLat = stops.reduce((sum, stop) => sum + stop.latitude, 0) / stops.length;
      const avgLng = stops.reduce((sum, stop) => sum + stop.longitude, 0) / stops.length;

      const map = L.map(mapRef.current).setView([avgLat, avgLng], 10);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const bounds: [number, number][] = [];
      stops.forEach((stop) => {
        const marker = L.marker([stop.latitude, stop.longitude], {
          icon: L.divIcon({
            className: 'custom-bus-stop-marker',
            html: `<div style="background-color: #3b82f6; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 14px;">${stop.sequence_number}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          })
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: system-ui; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
              Stop ${stop.sequence_number}: ${stop.stop_name_en}
            </h3>
            <p style="margin: 4px 0; font-size: 13px; color: #6b7280;">
              <strong>Code:</strong> ${stop.stop_code}
            </p>
            <p style="margin: 4px 0; font-size: 13px; color: #6b7280;">
              <strong>සිංහල:</strong> ${stop.stop_name_si}
            </p>
            <p style="margin: 4px 0; font-size: 13px; color: #6b7280;">
              <strong>தமிழ்:</strong> ${stop.stop_name_tm}
            </p>
            <p style="margin: 4px 0; font-size: 13px; color: #6b7280;">
              <strong>Distance:</strong> ${stop.distance_from_start_km} km from start
            </p>
            <p style="margin: 4px 0; font-size: 12px; color: #9ca3af;">
              ${stop.latitude.toFixed(6)}, ${stop.longitude.toFixed(6)}
            </p>
          </div>
        `);

        bounds.push([stop.latitude, stop.longitude]);
      });

      if (stops.length > 1) {
        const routeLine = stops.map(stop => [stop.latitude, stop.longitude]);
        L.polyline(routeLine, {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.7,
          smoothFactor: 1
        }).addTo(map);
      }

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }, [direction]);

    return <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: '8px' }} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
      />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Bus Ticket Management System</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded">Route: {routeData.route.code}</span>
            <span>{routeData.route.name}</span>
            <span className="bg-green-500 px-3 py-1 rounded text-xs">{routeData.route.status}</span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-1">
            {(['overview', 'directions', 'fares'] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {routeData.directions.map((direction, idx) => (
              <div key={direction.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Direction {idx + 1}</h3>
                    <Navigation className="w-5 h-5" />
                  </div>
                  <p className="text-sm mt-1">{direction.start_location} → {direction.end_location}</p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Distance</p>
                      <p className="font-semibold">{direction.total_distance_km} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold">{direction.estimated_duration_minutes} min</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Map className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-700">Route Map</h4>
                    </div>
                    <DirectionMap direction={direction} />
                  </div>

                  <div>
                    <button
                      onClick={() => toggleStopsSection(direction.id)}
                      className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors mb-2"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-700">Stops & Fares</span>
                        <span className="text-sm text-gray-500">({direction.stops.length} stops)</span>
                      </div>
                      {showStopsSection[direction.id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>

                    {showStopsSection[direction.id] && (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {direction.stops.map((stop, stopIdx) => {
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
                                  {stop.sequence_number}
                                </div>
                                <div className="flex-1 text-left">
                                  <span className="font-semibold text-gray-800">{stop.stop_name_en}</span>
                                  <span className="ml-2 text-xs text-gray-500">({stop.stop_code})</span>
                                </div>
                                <span className="text-xs text-gray-500">{stop.distance_from_start_km} km</span>
                                {fareData && fareData.fares.length > 0 && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    {fareData.fares.length} {fareData.fares.length === 1 ? 'fare' : 'fares'}
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
                                      {fareData.fares.map((fare, fareIdx) => (
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
                                                  Full: LKR {cat.full_amount_lkr.toFixed(2)}
                                                </div>
                                                <div className="font-bold text-sm text-purple-700">
                                                  Half: LKR {cat.half_amount_lkr.toFixed(2)}
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
                        })}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDirection(direction.id);
                      setActiveTab('directions');
                    }}
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors"
                  >
                    Manage Direction
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'directions' && (
          <div className="space-y-6">
            {routeData.directions.map(direction => (
              <div key={direction.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {direction.start_location} → {direction.end_location}
                  </h3>
                  <button
                    onClick={() => handleEdit('direction', direction)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Direction
                  </button>
                </div>

                {editMode.type === 'direction' && editMode.id === direction.id && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Location</label>
                        <input
                          type="text"
                          defaultValue={direction.start_location}
                          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">End Location</label>
                        <input
                          type="text"
                          defaultValue={direction.end_location}
                          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Total Distance (km)</label>
                        <input
                          type="number"
                          defaultValue={direction.total_distance_km}
                          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Duration (min)</label>
                        <input
                          type="number"
                          defaultValue={direction.estimated_duration_minutes}
                          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded">
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">Bus Stops</h4>
                    <button className="flex items-center gap-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm">
                      <Plus className="w-4 h-4" />
                      Add Stop
                    </button>
                  </div>
                  <div className="space-y-2">
                    {direction.stops.map(stop => (
                      <div key={stop.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          {stop.sequence_number}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{stop.stop_name_en}</p>
                          <p className="text-sm text-gray-600">{stop.stop_name_si} | {stop.stop_name_tm}</p>
                          <p className="text-xs text-gray-500">Code: {stop.stop_code} | {stop.distance_from_start_km} km from start</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'fares' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Fare Management</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
                <Plus className="w-4 h-4" />
                Create New Fare
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 Fares are now loaded dynamically from the API when you expand each stop in the Overview tab.
              </p>
            </div>

            {routeData.directions.map(direction => (
              <div key={direction.id} className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold text-lg mb-4 text-gray-800">
                  {direction.start_location} → {direction.end_location}
                </h4>
                
                <div className="space-y-3">
                  {direction.stops.map((stop, stopIdx) => {
                    const cacheKey = `${direction.id}-${stop.id}`;
                    const fareData = stopFaresData[cacheKey];
                    
                    if (!fareData || fareData.fares.length === 0) {
                      return null;
                    }

                    return (
                      <div key={stop.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-100 px-4 py-2 font-medium">
                          From: {stop.stop_name_en} ({stop.stop_code})
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">To Stop</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Distance</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Full Fare</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Half Fare</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fareData.fares.map((fare, fareIdx) =>
                                fare.categories.map((category, catIdx) => (
                                  <tr key={`${fareIdx}-${catIdx}`} className="border-b hover:bg-gray-50">
                                    {catIdx === 0 && (
                                      <>
                                        <td className="px-4 py-3 text-sm" rowSpan={fare.categories.length}>
                                          {fare.to_stop.stop_name_en}
                                          <span className="ml-2 text-xs text-gray-500">
                                            ({fare.to_stop.stop_code})
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm" rowSpan={fare.categories.length}>
                                          {fare.distance_km} km
                                        </td>
                                      </>
                                    )}
                                    <td className="px-4 py-3 text-sm">{category.category_name}</td>
                                    <td className="px-4 py-3 text-sm font-medium">
                                      LKR {category.full_amount_lkr.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium">
                                      LKR {category.half_amount_lkr.toFixed(2)}
                                    </td>
                                    {catIdx === 0 && (
                                      <td className="px-4 py-3" rowSpan={fare.categories.length}>
                                        <div className="flex gap-2">
                                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                                            <Edit2 className="w-4 h-4" />
                                          </button>
                                          <button className="p-2 text-red-600 hover:bg-red-100 rounded">
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </td>
                                    )}
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {Object.keys(stopFaresData).filter(key => key.startsWith(direction.id)).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No fares loaded yet.</p>
                    <p className="text-xs mt-1">Go to the Overview tab and expand stops to load their fares.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusTicketSystem;