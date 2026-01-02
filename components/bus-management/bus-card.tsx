import { Badge } from "@/components/ui/badge"
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DirectionsFormData } from "@/types/direction";
import { useNavbar } from "@/context/navbar-context"

export function BusManagementCard({
  initialData,
  routeDataSet,
  bus,
  directionCreate
}: any) {
  const [errors, setErrors] = useState<Partial<Record<keyof any, string>>>({});
  const [createMode, setCreateMode] = useState({ type: "" });
  const { setNavbarData } = useNavbar();
   const { token } = useAuth();
  const [formData, setFormData] = useState<DirectionsFormData>({
    start_location: '',
    end_location: '',
    total_distance: 0,
    estimated_duration: 0,
    route_id: null,
    id: null
  });
  
  const handleApply = (type: string) => {
    setCreateMode({ type: type })
  };




  return (
    <div className="relative mb-3 rounded-2xl bg-gradient-to-r from-[#0F90EE] to-[#276CCC] px-6 py-4 text-white flex flex-col justify-center gap-4">


      {/* Content */}
      <div className="flex items-center justify-between  ">
        <div>
          <div className="flex-0 items-center justify-between  ">
            <h1 className="text-xl font-bold mb-2">{bus?.registration_number}</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-green-500 px-3 py-1 rounded text-xs">{bus?.status}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          {directionCreate ? (<Button
            onClick={() => handleApply("direction")}
            className="bg-blue-400 hover:bg-blue-600 text-white h-11 rounded-12 px-6"
          // disabled={isLoading}Monday
          >
            <Plus className="w-4 h-4" />
            Create Directions
          </Button>) : (<><div className="flex-2 items-center justify-between  ">
            <h1 className="text-xl font-bold mb-2">2025-11-11</h1>
            <div className="flex items-center gap-4 text-sm">
              Monday
            </div>
          </div></>)}


        </div>
      </div>

    </div>
  )
}
