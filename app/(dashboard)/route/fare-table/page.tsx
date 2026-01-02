'use client';

import React, { useState, useEffect } from 'react';
import { useNavbar } from '@/context/navbar-context';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CategoryList } from '@/components/route/category-list';
import { Pencil, Save, ArrowLeftRight, StepBack, Loader2 } from 'lucide-react';
import { RouteCard } from "@/components/route/route-card";
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'next/navigation';
import { apiService } from '@/services/api';

interface Fare {
  id?: string;
  forward_fare_id?: string;
  direction_id: string;
  from_stop_id: string;
  from_stop_name_si: string;
  from_stop_name_en: string;
  from_stop_name_tm: string;
  from_sequence: number;
  new_fare?: boolean;
  reverse_fare_id?: string;
  to_stop_id: string;
  to_stop_name_si: string;
  to_stop_name_en: string;
  to_stop_name_tm: string;
  to_sequence: number;
  full_amount_lkr: number;
  half_amount_lkr: number;
  distance_km: number;
  categories?: any[] | [];
}
interface FareOutput {
  forward_fare_id?: string
  forward_direction_id: string;
  forward_from_stop_id: string;
  forward_to_stop_id: string;
  reverse_fare_id?: string
  reverse_direction_id: string;
  reverse_from_stop_id: string;
  reverse_to_stop_id: string;
  effective_from: string;
  effective_to: string;
  category_id: string;
  full_amount: string;
  half_amount: string
  status: "active";
  categories: {
    category_id: string;
    full_amount: number;
    half_amount: number;
  }[];
}
interface FareOutputNew {
  forward_fare_id?: string
  reverse_fare_id?: string
  category_id: string;
  full_amount: number;
  half_amount: number
  status?: "active";

}

interface Stop {
  id: string;
  name: string;
  seq: number;
}
interface Stop1 {
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

const initialFares: Fare[] = []

interface FareMatrix {
  id: string;
  direction_id: string;
  from_stop_id: string;
  forward_fare_id?: string;
  from_stop_name_si: string;
  from_stop_name_en: string;
  from_stop_name_tm: string;
  from_sequence: number;
  new_fare: boolean;
  to_stop_id: string;
  reverse_fare_id?: string;
  to_stop_name_si: string;
  to_stop_name_en: string;
  to_stop_name_tm: string;
  to_sequence: number;

  full_amount_lkr: number;
  half_amount_lkr: number;
  distance_km: number;
}
export default function FareMatrixUI() {
  const { token } = useAuth();
  const [fares, setFares] = useState<Fare[]>([]);
  const [editingFare, setEditingFare] = useState<Fare | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [tempFull, setTempFull] = useState<string>('');
  const [reverseDirectionId, srtReverseDirectionId] = useState<string>('');
  const [tempHalf, setTempHalf] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { setNavbarData } = useNavbar();
  const [changedFareIds, setChangedFareIds] = useState(new Set());
  const [routeinfo, setRouteinfo] = useState({
    "id": "a3924555-16dc-4ae8-9982-4237c6ac3eca",
    "code": "02",
    "name": "Colombo - Galle",
    "version": 3,
    "status": "active"
  });
  // Get unique stops sorted by sequence
  const searchParams = useSearchParams();
  const routeId = searchParams.get('id');
  useEffect(() => {
    setNavbarData('Route Management', 'Route Management / Route/Fare Table');

    fetchRouteCategories();
    fetchRouteGetById(routeId ?? "");
  }, []);
  const fetchRouteGetById = async (id: string) => {
    if (!token) return;
    try {
      const data = await apiService.getRouteById(token, id);
      setRouteinfo(data.route)
      // setCategories(data.categories)
    } catch (err) {
      console.error('fetchRouteCategories', err);
    } finally {
      // setLoading(false);
    }
  }
  const fetchRouteCategories = async () => {
    if (!token) return;
    try {
      const data = await apiService.getRouteCategories(token);
      setCategories(data.categories)
    } catch (err) {
      console.error('fetchRouteCategories', err);
    } finally {
      // setLoading(false);
    }
  }

  const fetchRoute = async (category_id: string) => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await apiService.getFareFullWithCategories(token, routeId ?? "", category_id);

      setRouteinfo(data.route)
      const fullArray = data.fares;
      // const firstHalf = fullArray.slice(0, fullArray.length / 2);
      const firstHalf = fullArray;
      if (firstHalf.length > 0) {

        setFares(firstHalf)
        const NewArray = generateFareMatrix(data.directions[0].stops, data.directions[0].id)
        console.log(NewArray)
        srtReverseDirectionId(data.directions[1].id)

        const newBuildObjet = mergeFareData(firstHalf, NewArray, category_id)
        console.log(newBuildObjet, "selectCatIdselectCatIdselectCatId")
        setFares(newBuildObjet)
      } else {
        const NewArray = generateFareMatrix(data.directions[0].stops, data.directions[0].id)
        srtReverseDirectionId(data.directions[1].id)
        setFares(NewArray)
      }

    } catch (err) {
      console.error('Route  d', err);
    } finally {
      setLoading(false);
    }
  }
  function mergeFareData(
    input1: Fare[],
    input2: Fare[],
    selectCatId: string,
  ): Fare[] {
    // Create a deep copy of input2 to avoid mutating the original


    console.log(input1, "inout1")
    console.log(input2, 'inout2')
    const result = JSON.parse(JSON.stringify(input2)) as Fare[];

    // Create a map for quick lookup from input1
    const input1Map = new Map<string, Fare>();

    input1.forEach((item) => {
      // Create a unique key based on matching criteria
      const key = `${item.direction_id}_${item.from_stop_id}_${item.from_sequence}_${item.to_stop_id}_${item.to_sequence}`;
      input1Map.set(key, item);
    });

    // Merge data from input1 into result

    result.forEach((item) => {
      const key = `${item.direction_id}_${item.from_stop_id}_${item.from_sequence}_${item.to_stop_id}_${item.to_sequence}`;

      const matchingItem = input1Map.get(key);
      let setfull_amount_lkr = 0
      let sethalf_amount_lkr = 0
      let setNew_fare = true
      if (matchingItem?.categories && matchingItem.categories.length > 0) {
        console.log(selectCatId, "ssssssssssssssswwwwwwwwwwwwwwwwwwww")
        const selectMatchingItem = matchingItem.categories.find(item => item.category_id === selectCatId);
        if (selectMatchingItem) {
          setfull_amount_lkr = selectMatchingItem.full_amount_lkr
          sethalf_amount_lkr = selectMatchingItem.half_amount_lkr
          setNew_fare = false
        }


      }
      if (matchingItem) {
        const getReverseFare = input1.find(
          item => item.from_stop_id === matchingItem.to_stop_id && item.to_stop_id === matchingItem.from_stop_id
        );
        // Merge the data - update the amounts and distance from input1

        item.full_amount_lkr = setfull_amount_lkr;
        item.half_amount_lkr = sethalf_amount_lkr;
        item.distance_km = matchingItem.distance_km;
        item.id = matchingItem.id;
        item.new_fare = setNew_fare;
        item.forward_fare_id = matchingItem.id,
          item.reverse_fare_id = getReverseFare?.id ?? "",



          // Optionally update stop names if they differ
          item.from_stop_name_si = matchingItem.from_stop_name_si;
        item.from_stop_name_en = matchingItem.from_stop_name_en;
        item.from_stop_name_tm = matchingItem.from_stop_name_tm;
        item.to_stop_name_si = matchingItem.to_stop_name_si;
        item.to_stop_name_en = matchingItem.to_stop_name_en;
        item.to_stop_name_tm = matchingItem.to_stop_name_tm;
      }
    });

    return result;
  }
  function generateFareMatrix(stops: Stop1[], directionId: string): FareMatrix[] {
    const result: FareMatrix[] = [];

    for (let i = 0; i < stops.length; i++) {
      for (let j = i + 1; j < stops.length; j++) {
        const from = stops[i];
        const to = stops[j];
        const uniqueId = () => "fare22-" + Math.random().toString(36).substring(2, 12);
        result.push({
          id: uniqueId(),
          direction_id: directionId,
          new_fare: true,

          from_stop_id: from.id,
          from_stop_name_si: from.stop_name_si,
          from_stop_name_en: from.stop_name_en,
          from_stop_name_tm: from.stop_name_tm,
          from_sequence: from.sequence_number,

          to_stop_id: to.id,
          to_stop_name_si: to.stop_name_si,
          to_stop_name_en: to.stop_name_en,
          to_stop_name_tm: to.stop_name_tm,
          to_sequence: to.sequence_number,

          full_amount_lkr: 0,
          half_amount_lkr: 0,

          // If you need real distance use to.distance - from.distance
          distance_km: 0,
        });
      }
    }

    return result;
  }
  const handleFormSubmit = async (data: any, new_fare: boolean) => {
    if (!token) return;

    if (new_fare) {
      try {
        // setError("");
        console.log(data)
        const createRespone = await apiService.createFares(token, data);
        console.log(createRespone)
        fetchRoute(categoryId)
        if (createRespone.success) {
          // setShowForm(false);
          // fetchBuses(filters)
        }
      } catch (err: any) {
        console.log(err.message);
        //  setError(err.message);
      } finally {

      }
    } else {
      try {
        // setError("");
        console.log(data, "ssssssdsdsdsdsd")
        const createRespone = await apiService.updateFares(token, data, categoryId);
        console.log(createRespone)

        fetchRoute(categoryId)

        if (createRespone.success) {
          // setShowForm(false);
          // fetchBuses(filters)
        }
      } catch (err: any) {
        console.log(err.message);
        //  setError(err.message);
      } finally {

      }
    }


  }
  const stops: Stop[] = Array.from(
    new Set(
      fares.flatMap(f => [
        { id: f.from_stop_id, name: f.from_stop_name_en, seq: f.from_sequence },
        { id: f.to_stop_id, name: f.to_stop_name_en, seq: f.to_sequence }
      ]).map(s => JSON.stringify(s))
    )
  )
    .map(s => JSON.parse(s))
    .sort((a, b) => a.seq - b.seq);

  const getFare = (fromId: string, toId: string): Fare | undefined => {
    return fares.find(f => f.from_stop_id === fromId && f.to_stop_id === toId);
  };

  const handleEdit = (fare: Fare): void => {
    setEditingFare(fare);
    setTempFull(fare.full_amount_lkr.toString());
    setTempHalf(fare.half_amount_lkr.toString());
    setIsDialogOpen(true);
  };

  const handleSave = (): void => {
    if (!editingFare) return;
    console.log(editingFare)
    const fullAmount = parseFloat(tempFull);
    const halfAmount = parseFloat(tempHalf);

    if (isNaN(fullAmount) || isNaN(halfAmount)) {
      alert('Please enter valid numbers');
      return;
    }
    setFares(fares.map(f =>
      f.id === editingFare.id
        ? { ...f, full_amount_lkr: fullAmount, half_amount_lkr: halfAmount }
        : f
    ));
    //buildFareObject(editingFare, categoryId, fullAmount, halfAmount)
    const buildObjet = buildFareObject(editingFare, categoryId, fullAmount, halfAmount);
    setChangedFareIds(prev => new Set([...prev, editingFare.id]));
    setIsDialogOpen(false);
    setEditingFare(null);
    console.log(buildObjet)
    handleFormSubmit(buildObjet, editingFare.new_fare ?? true)


    // Mark this fare as changed

  };

  function buildFareObject(
    input: Fare,
    category_id: string,
    fullAmount: number,
    halfAmount: number
  ): FareOutputNew {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    return {


      forward_fare_id: input?.forward_fare_id,
      reverse_fare_id: input?.reverse_fare_id,
      status: "active",
      full_amount: fullAmount,
      half_amount: halfAmount,
      category_id: category_id,
    };
  }

  const handleBackToCategories = (): void => {
    setCategoryId("")
    setCategoryName("")

    setFares([])
    setChangedFareIds(new Set());
  };
  const handleCategoryId = (id: any, name: string): void => {
    setCategoryId(id)
    setCategoryName(name)
    fetchRoute(id)

  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-2 md:py-5">

          <div className="px-1 lg:px-3">
            <RouteCard initialData={null} onSubmit={''} routeDataSet={routeinfo} directionCreate={false} />


          </div>
          {categoryId ? (<div className="px-1 lg:px-3">
            <Card className='gap-4'>
              <CardHeader className="">
                <CardTitle className="text-lg">
                  Fare table for : {categoryName}
                </CardTitle>
                <CardDescription>

                  <span >All amounts are in Rs.</span>

                </CardDescription>
                <CardAction>
                  <div className="flex gap-2">
                    <Button onClick={handleBackToCategories} className="
                                        flex items-center gap-2 
                                        text-white font-medium
                                        rounded-[14px]
                                        px-5 py-2
                                        bg-gradient-to-r from-[#0F90EE] to-[#276CCC]
                                        hover:opacity-90
                                        shadow-md
                  ">
                      <StepBack className="w-4 h-4" />
                      Go Back to Categories
                    </Button>
                  </div>
                </CardAction>

              </CardHeader>
              <CardContent>
                {loading && <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>}
                <div className="overflow-auto max-h-[500px] border border-gray-400">
                  <table className="w-full border-collapse">
                    <tbody>
                      {stops.map((fromStop, rowIndex) => (
                        <tr key={fromStop.id} className=''>
                          <td className="bg-white p-2 text-[10px] font-semibold min-w-[100px] sticky left-0 z-10 relative
  before:absolute before:inset-0 before:border before:border-gray-400 before:pointer-events-none before:content-['']
  shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            {fromStop.name}
                          </td>
                          {stops.map((toStop, colIndex) => {
                            // Show station name in the diagonal
                            if (rowIndex === colIndex) {
                              return (
                                <td
                                  key={toStop.id}
                                  className={`border border-gray-400 bg-orange-100 p-2 relative
  before:absolute before:inset-0 before:border before:border-gray-400 before:pointer-events-none before:content-['']
  shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] ${rowIndex === 0 ? 'sticky top-0 z-10' : 'sticky top-0 z-10'}`}
                                >
                                  <div className="text-[10px] text-center font-semibold">{toStop.name}</div>
                                </td>
                              );
                            }

                            // Hide upper triangle (empty boxes)
                            if (rowIndex < colIndex) {
                              return null;
                            }

                            // Get reverse direction fare
                            const fare = getFare(toStop.id, fromStop.id);
                            const isChanged = fare && changedFareIds.has(fare.id);
                            return (
                              <td
                                key={toStop.id}
                                className={`border border-gray-400 p-2 relative group ${isChanged ? 'bg-red-200' : 'bg-cyan-50'
                                  }`}
                                title={fare ? `${fare.from_stop_name_en} - ${fare.to_stop_name_en}\nDistance: ${fare.distance_km} km` : ''}
                              >
                                {fare ? (
                                  <>

                                    <div className="flex flex-0 items-center gap-1 justify-center">
                                      <div className="text-[10px] font-medium">
                                        {fare.full_amount_lkr.toFixed(2)}
                                      </div>
                                      <div className="text-[10px] font-bold">
                                        |
                                      </div>
                                      <div className="text-[10px] font-medium">
                                        {fare.half_amount_lkr.toFixed(2)}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 h-5 w-5"
                                        onClick={() => handleEdit(fare)}
                                      >
                                        <Pencil className="w-3 h-3" />
                                      </Button>
                                    </div>


                                  </>
                                ) : (
                                  <div className="text-xs text-center text-gray-400">-</div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex gap-9 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-cyan-50 border border-gray-400 flex flex-0 gap-1 items-center justify-center">
                      <div className="text-[12px] font-semibold">70</div>
                      <div className="text-xs font-bold">
                        |
                      </div>
                      <div className="text-[12px] font-semibold">35</div>
                    </div>
                    <span className='text-[14px]'>Fare Amounts (Left side: Full, Right side: Half) <span className='font-semibold' >All amounts are in Rs.</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-7 bg-red-200 border border-gray-400"></div>
                    <span>Modified (saved Changes)</span>
                  </div>

                </div>

              </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Fare</DialogTitle>
                </DialogHeader>
                {editingFare && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Direction</Label>
                      <div className="text-sm flex gap-3 text-gray-600 items-center ">
                        {editingFare.from_stop_name_en} <ArrowLeftRight className='size-[18px]' /> {editingFare.to_stop_name_en}
                      </div>
                      <div className="text-xs text-gray-500">
                        Distance: {editingFare.distance_km} km
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="full-amount">Full Amount (LKR)</Label>
                      <Input
                        id="full-amount"
                        type="number"
                        value={tempFull}
                        onChange={(e) => setTempFull(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="half-amount">Half Amount (LKR)</Label>
                      <Input
                        id="half-amount"
                        type="number"

                        value={tempHalf}
                        onChange={(e) => setTempHalf(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className='
                  flex items-center gap-2 
                                        text-white font-medium
                                        rounded-[14px]
                                        px-5 py-2
                                        bg-gradient-to-r from-[#0F90EE] to-[#276CCC]
                                        hover:opacity-90
                                        shadow-md
                  '>
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>) : (<>
            <div className="px-1 lg:px-3">
              <CategoryList onSelectCategory={handleCategoryId} categories={categories} />
            </div>

          </>)}

        </div>
      </div>

    </div>
  );
}