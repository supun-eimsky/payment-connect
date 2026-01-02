import { Badge } from "@/components/ui/badge"
import React, { useState, useEffect, useRef } from 'react';
interface DashboardHeaderProps {
  route?: string
  date?: string
  badgeCount?: number
  badgeValue?: number
}
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DirectionsFormData } from "@/types/direction";

export function RouteCard({
  initialData,
  routeDataSet,
  onSubmit,
  directionCreate
}: any) {
  const [errors, setErrors] = useState<Partial<Record<keyof any, string>>>({});
  const [createMode, setCreateMode] = useState({ type: "" });
  const [formData, setFormData] = useState<DirectionsFormData>({
    start_location: '',
    end_location: '',
    total_distance: 0,
    estimated_duration: 0,
    route_id: null,
    id: null
  });
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DirectionsFormData, string>> = {};
    (Object.keys(formData) as (keyof DirectionsFormData)[]).forEach((key) => {
      if (
        formData[key] === '' ||
        formData[key] === 0 ||
        formData[key] === undefined
      ) {
        newErrors[key] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (field: keyof DirectionsFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = (type: string) => {
    setCreateMode({ type: type })
  };
  const handleClose = (type: string) => {
    setCreateMode({ type: type })
  };
  const handleSubmit = () => {
    console.log(formData)

    if (!validate()) return;

    console.log(routeDataSet.id)
    const fullformData = {
      start_location: formData.start_location,
      end_location: formData.end_location,
      total_distance: formData.total_distance,
      estimated_duration: formData.estimated_duration,
      route_id: routeDataSet.id,
      id: null

    }
    if (onSubmit(fullformData)) {
      handleApply("close")
      setFormData({
        start_location: '',
        end_location: '',
        total_distance: 0,
        estimated_duration: 0,
        route_id: null,
        id: null
      })
    } else {

    };
  };


  return (
    <div className="relative mb-3 rounded-2xl bg-gradient-to-r from-[#0F90EE] to-[#276CCC] px-6 py-4 text-white flex flex-col justify-center gap-4">


      {/* Content */}
      <div className="flex items-center justify-between  ">
        <div>
          <div className="flex-0 items-center justify-between  ">
            <h1 className="text-xl font-bold mb-2">{routeDataSet.name}</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded">Route Code:{routeDataSet.code}</span>
              <span className="bg-green-500 px-3 py-1 rounded text-xs">{routeDataSet.status}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          {directionCreate?( <Button
            onClick={() => handleApply("direction")}
            className="bg-blue-400 hover:bg-blue-600 text-white h-11 rounded-12 px-6"
          // disabled={isLoading}Monday
          >
            <Plus className="w-4 h-4" />
            Create Directions
          </Button>):(<><div className="flex-2 items-center justify-between  ">
            <h1 className="text-xl font-bold mb-2">2025-11-11</h1>
            <div className="flex items-center gap-4 text-sm">
             Monday
            </div>
          </div></>)}
         

        </div>
      </div>
      {createMode.type === 'direction'? (
        <div className="p-0 rounded-lg mb-4">
          <Card  >
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                  <div className="space-y-2">
                    <Label className="block text-gray-700 font-medium mb-2">Start location*</Label>
                    <Input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Start location"
                      required
                      value={formData.start_location}
                      onChange={(e) => handleChange('start_location', e.target.value)}
                    />
                    {errors.start_location && (
                      <p className="text-red-500 text-sm">{errors.start_location}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="block text-gray-700 font-medium mb-2">End Location *</Label>
                    <Input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.end_location}
                      placeholder="End location"
                      required
                      onChange={(e) => handleChange('end_location', e.target.value)}
                    />
                    {errors.end_location && (
                      <p className="text-red-500 text-sm">{errors.end_location}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="block text-gray-700 font-medium mb-2">Total Distance *</Label>
                    <Input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.total_distance}
                      placeholder="Total Distance"
                      required
                      onChange={(e) => handleChange('total_distance', Number(e.target.value))}
                    />
                    {errors.total_distance && (
                      <p className="text-red-500 text-sm">{errors.total_distance}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="block text-gray-700 font-medium mb-2">Estimated Duration(min) *</Label>
                    <Input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.estimated_duration}
                      placeholder="Estimated Duration"
                      required
                      onChange={(e) => handleChange('estimated_duration', Number(e.target.value))}
                    />
                    {errors.estimated_duration && (
                      <p className="text-red-500 text-sm">{errors.estimated_duration}</p>
                    )}
                  </div>




                </div>

                <div className="flex justify-start gap-3 pt-4">
                  <Button className="bg-blue-400 hover:bg-blue-600 text-white h-11 rounded-12 px-6"
                    onClick={handleSubmit}
                  >

                    {initialData ? 'Update' : 'Save'}
                  </Button>
                  <Button className=" h-11 rounded-12 px-6" variant="outline"
                    onClick={() => handleClose("close")}
                  >
                    Cancel
                  </Button>

                </div>
              </div>
            </CardContent>

          </Card>


        </div>
      ) : null}
    </div>
  )
}
