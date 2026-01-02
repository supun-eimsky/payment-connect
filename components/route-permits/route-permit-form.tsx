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
import { apiService } from '@/services/api';
import { BusFormData, BusFormProps } from '@/types/bus-management';
import { RoutePermitFormData, RoutePermitProps } from '@/types/route-permits';





const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
const SEATING_CAPACITIES = [30, 40, 45, 50];
const ROUTE_LIST = [
  {
    "lable": "Route 1",
    "value": "660e8400-e29b-41d4-a716-446655440001"
  }
];
const STANDING_CAPACITIES = [10, 15, 20, 25];

export default function RoutePermitForm({
  companyId,
  initialData,
  routList,
  companyList,
  onSelectCompany,
  onSubmit,
  onCancel,
}: RoutePermitProps) {
  const [formData, setFormData] = useState<RoutePermitFormData>({
    route_id: '',
    expiry_date: '',
    permit_number: '',
    issued_date: '',
    company_id: companyId,
    id: null
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RoutePermitFormData, string>>>({});

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof RoutePermitFormData, value: string | number) => {
    console.log(field);
    if (field == "company_id") {
      onSelectCompany(value)
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RoutePermitFormData, string>> = {};
    (Object.keys(formData) as (keyof RoutePermitFormData)[]).forEach((key) => {
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
          <CardTitle className="text-lg">{initialData ? 'Edit Route Permit' : 'Add New Route Permit '}</CardTitle>
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
              </div>) : (<div className="space-y-2">
                <Label htmlFor="company_id" className="block text-gray-700 font-medium mb-2">Company ID</Label>
                <Input id="company_id" value={companyId} disabled className="bg-gray-100" />
              </div>)}

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Route*</Label>
                <Select
                  value={formData.route_id ? String(formData.route_id) : ''}
                  onValueChange={(value) => handleChange('route_id', String(value))}
                >
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Select Route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routList.map((cap) => (
                      <SelectItem key={cap.id} value={cap.name.toString()}>
                        {cap.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.route_id && (
                  <p className="text-red-500 text-sm">{errors.route_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Permit Number *</Label>
                <Input
                  value={formData.permit_number}
                  onChange={(e) => handleChange('permit_number', e.target.value)}
                />
                {errors.permit_number && (
                  <p className="text-red-500 text-sm">{errors.permit_number}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Issued Date *</Label>
                {/* <Input
                  value={formData.issued_date}
                  onChange={(e) => handleChange('issued_date', e.target.value)}
                /> */}
                <Input
                  id="issued_date"
                  type="date"
                  value={formData.issued_date == '' ? ('') : (new Date(formData.issued_date).toISOString().split("T")[0])}
                  onChange={(e) => handleChange('issued_date', e.target.value)}
                  required
                />
                {errors.issued_date && (
                  <p className="text-red-500 text-sm">{errors.issued_date}</p>
                )}
              </div>

                <div className="space-y-2">
                  <Label className="block text-gray-700 font-medium mb-2">Expiry Date *</Label>

                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date == '' ? ('') : (new Date(formData.expiry_date).toISOString().split("T")[0])}
                    onChange={(e) => handleChange('expiry_date', e.target.value)}
                    required
                  />
                  {errors.expiry_date && (
                    <p className="text-red-500 text-sm">{errors.expiry_date}</p>
                  )}
                </div></div>






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
