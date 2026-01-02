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




const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
const SEATING_CAPACITIES = [30, 40, 45, 50];
const STANDING_CAPACITIES = [10, 15, 20, 25];

export default function BusForm({
  companyId,
  initialData,
  companyList,
  onSubmit,
  onCancel,
  onfilter
}: BusFormProps) {
  const [formData, setFormData] = useState<BusFormData>({
    registration_number: '',
    fleet_number: '',
    model: '',
    manufacturer: '',
    year_of_manufacture: 0,
    seating_capacity: 0,
    standing_capacity: 0,
    company_id: companyId,
    id: null
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BusFormData, string>>>({});

  useEffect(() => {
    console.log(initialData, "sssssssssssssssssssssssssssssssss")
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof BusFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BusFormData, string>> = {};
    (Object.keys(formData) as (keyof BusFormData)[]).forEach((key) => {
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
          <CardTitle className="text-lg">{initialData ? 'Edit Bus' : 'Add New Bus'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companyList ? (<div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">
                  Company ID *
                </Label>
              <Select
                  value={formData.company_id ? String(formData.company_id) : ''}
                  onValueChange={(value) => handleChange('company_id', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyList.map((item, index) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>


                {errors.company_id && (
                  <p className="text-red-500 text-sm">{errors.company_id}</p>
                )}
              </div>) : ( <div className="space-y-2">
                <Label htmlFor="company_id" className="block text-gray-700 font-medium mb-2">Company ID</Label>
                <Input id="company_id" value={companyId} disabled className="bg-gray-100" />
              </div>)}
             

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Registration Number *</Label>
                <Input
                  placeholder="Registration Number"
                  value={formData.registration_number}
                  onChange={(e) => handleChange('registration_number', e.target.value)}
                />
                {errors.registration_number && (
                  <p className="text-red-500 text-sm">{errors.registration_number}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Fleet Number *</Label>
                <Input
                  placeholder="Fleet Number"

                  value={formData.fleet_number}
                  onChange={(e) => handleChange('fleet_number', e.target.value)}
                />
                {errors.fleet_number && (
                  <p className="text-red-500 text-sm">{errors.fleet_number}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Model *</Label>
                <Input
                  placeholder="Model"

                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                />
                {errors.model && (
                  <p className="text-red-500 text-sm">{errors.model}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Manufacturer *</Label>
                <Input
                  placeholder="Manufacturer"

                  value={formData.manufacturer}
                  onChange={(e) => handleChange('manufacturer', e.target.value)}
                />
                {errors.manufacturer && (
                  <p className="text-red-500 text-sm">{errors.manufacturer}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Year of Manufacture *</Label>
                <Select
                  value={formData.year_of_manufacture ? String(formData.year_of_manufacture) : ''}
                  onValueChange={(value) => handleChange('year_of_manufacture', Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.year_of_manufacture && (
                  <p className="text-red-500 text-sm">{errors.year_of_manufacture}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Seating Capacity *</Label>
                {/* <Select
                  value={formData.seating_capacity ? String(formData.seating_capacity) : ''}
                  onValueChange={(value) => handleChange('seating_capacity', Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEATING_CAPACITIES.map((cap) => (
                      <SelectItem key={cap} value={cap.toString()}>
                        {cap}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                <Input
                  placeholder="Seating Capacity"

                  value={formData.seating_capacity}
                  onChange={(e) => handleChange('seating_capacity', Number(e.target.value))}
                />
                {errors.seating_capacity && (
                  <p className="text-red-500 text-sm">{errors.seating_capacity}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Standing Capacity *</Label>
                {/* <Select
                  value={formData.standing_capacity ? String(formData.standing_capacity) : ''}
                  onValueChange={(value) => handleChange('standing_capacity', Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    {STANDING_CAPACITIES.map((cap) => (
                      <SelectItem key={cap} value={cap.toString()}>
                        {cap}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                <Input
                  placeholder="Standing Capacity"

                  value={formData.standing_capacity}
                  onChange={(e) => handleChange('standing_capacity', Number(e.target.value))}
                />
                {errors.standing_capacity && (
                  <p className="text-red-500 text-sm">{errors.standing_capacity}</p>
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
