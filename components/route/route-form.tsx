'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BusFormData, BusFormProps } from '@/types/bus-management';
import { RouteFormData, RouteProps } from '@/types/route';





const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
const SEATING_CAPACITIES = [30, 40, 45, 50];
const STSTUS_LIST = [
  {
    "lable": "Active",
    "value": "active"
  },
  {
    "lable": "Inactive",
    "value": "inactive"
  }
];
const STANDING_CAPACITIES = [10, 15, 20, 25];

export default function RouteForm({
  companyId,
  initialData,
  onSubmit,
  onCancel,
}: RouteProps) {
  const [formData, setFormData] = useState<RouteFormData>({
    code: '',
    name: '',
    status:"active",
    id: null
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RouteFormData, string>>>({});

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof RouteFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RouteFormData, string>> = {};
    (Object.keys(formData) as (keyof RouteFormData)[]).forEach((key) => {
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

  const handleSubmit = () => {
    console.log(formData)
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <div className="px-1 lg:px-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{initialData ? 'Edit Route ' : 'Add New Route  '}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Code*</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value)}
                />

                {errors.code && (
                  <p className="text-red-500 text-sm">{errors.code}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Name*</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
           
              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Status*</Label>
                <Select
                  value={formData.status ? String(formData.status) : ''}
                  onValueChange={(value) => handleChange('status', String(value))}
                >
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STSTUS_LIST.map((cap) => (
                      <SelectItem key={cap.value} value={cap.value.toString()}>
                        {cap.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.status && (
                  <p className="text-red-500 text-sm">{errors.status}</p>
                )}
              </div>






            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button className=" h-11 rounded-12 px-6" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button className="bg-blue-400 hover:bg-blue-600 text-white h-11 rounded-12 px-6" onClick={handleSubmit}>
                {initialData ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
