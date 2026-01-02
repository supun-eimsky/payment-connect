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
import { Devices, DeviceProps } from '@/types/device';




const userStr = localStorage.getItem("user")
let Organisation_ID: any = null;
let COMPANY_ID: any = null;
if (userStr) {
  const parsed = JSON.parse(userStr);
  Organisation_ID = parsed.organisation_id ? (parsed.organisation_id) : (null);
  COMPANY_ID = parsed.company_id ? (parsed.company_id) : (null);
}
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
const SEATING_CAPACITIES = [30, 40, 45, 50];
const ROUTE_LIST = [
  {
    "lable": "Route 1",
    "value": "660e8400-e29b-41d4-a716-446655440001"
  }
];
const STANDING_CAPACITIES = [10, 15, 20, 25];
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
export default function DeviceForm({
  companyId,
  initialData,
  companyList,
  organisationList,
  onSelectCompany,
  onSubmit,
  onCancel,
}: DeviceProps) {
  const [formData, setFormData] = useState<Devices>({
    device_code: '',
    serial_number: '',
    model: '',
    manufacturer: '',
    mac_address: '',
    imei: '',
    purchase_date: '',
    warranty_expiry: '',
    firmware_version: '',
    // company_id: companyId,
    status: '',
    id: null
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Devices, string>>>({});

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof Devices, value: string | number) => {
    console.log(value);
    // if (field == "company_id") {
    //   onSelectCompany(value)
    // }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Devices, string>> = {};
    (Object.keys(formData) as (keyof Devices)[]).forEach((key) => {
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
              {Organisation_ID == null ? (<div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">
                  Organisation*
                </Label>
                <Select
                  value={formData.organisation_id ? String(formData.organisation_id) : ''}
                  onValueChange={(value) => handleChange('organisation_id', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Organisation" />
                  </SelectTrigger>
                  <SelectContent>
                    {organisationList?.map((item, index) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>) : (<></>)}



              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Device Code *</Label>
                <Input
                  value={formData.device_code}
                  onChange={(e) => handleChange('device_code', e.target.value)}
                />
                {errors.device_code && (
                  <p className="text-red-500 text-sm">{errors.device_code}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Serial Number *</Label>
                <Input
                  value={formData.serial_number}
                  onChange={(e) => handleChange('serial_number', e.target.value)}
                />
                {errors.serial_number && (
                  <p className="text-red-500 text-sm">{errors.serial_number}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Model *</Label>
                <Input
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
                  value={formData.manufacturer}
                  onChange={(e) => handleChange('manufacturer', e.target.value)}
                />
                {errors.manufacturer && (
                  <p className="text-red-500 text-sm">{errors.manufacturer}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">imei *</Label>
                <Input
                  value={formData.imei}
                  onChange={(e) => handleChange('imei', e.target.value)}
                />
                {errors.imei && (
                  <p className="text-red-500 text-sm">{errors.imei}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">mac_address *</Label>
                <Input
                  value={formData.mac_address}
                  onChange={(e) => handleChange('mac_address', e.target.value)}
                />
                {errors.mac_address && (
                  <p className="text-red-500 text-sm">{errors.mac_address}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Warranty Expiry *</Label>
                {/* <Input
                  value={formData.issued_date}
                  onChange={(e) => handleChange('issued_date', e.target.value)}
                /> */}
                <Input
                  id="issued_date"
                  type="date"
                  value={formData.warranty_expiry == '' ? ('') : (new Date(formData.warranty_expiry).toISOString().split("T")[0])}
                  onChange={(e) => handleChange('warranty_expiry', e.target.value)}
                  required
                />
                {errors.warranty_expiry && (
                  <p className="text-red-500 text-sm">{errors.warranty_expiry}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Purchase Date *</Label>
                {/* <Input
                  value={formData.issued_date}
                  onChange={(e) => handleChange('issued_date', e.target.value)}
                /> */}
                <Input
                  id="purchase_date"
                  type="date"
                  value={formData.purchase_date == '' ? ('') : (new Date(formData.purchase_date).toISOString().split("T")[0])}
                  onChange={(e) => handleChange('purchase_date', e.target.value)}
                  required
                />
                {errors.purchase_date && (
                  <p className="text-red-500 text-sm">{errors.purchase_date}</p>
                )}
              </div>
            </div>





            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Firmware Version *</Label>
                <Input
                  value={formData.firmware_version}
                  onChange={(e) => handleChange('firmware_version', e.target.value)}
                />
                {errors.firmware_version && (
                  <p className="text-red-500 text-sm">{errors.firmware_version}</p>
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
    </div >
  );
}
