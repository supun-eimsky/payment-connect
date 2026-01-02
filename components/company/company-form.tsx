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

import { Company, CompanyFormProps } from '@/types/company';




const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
const SEATING_CAPACITIES = [30, 40, 45, 50];
const ORGANISATION_LIST = [
    {
    "id": "aa1506a1-0f6b-431d-baa4-4612a8e6b22d",
    "name": "DFCC",
    "code": "DFCC",
    "registration_number": "DFCC",
    "email": "contact@ntc.gov.lk",
    "phone": "+94114567890",
    "address": "456 New Parliament Road",
    "city": "Kotte",
    "province": "Western",
    "status": "active",
    "created_at": "2025-10-29 03:49:03.009840",
    "updated_at": "2025-11-18 03:43:13.778025",
    "created_by": "793f0f8b-8153-4ac8-aca9-cfff6e324096",
    "updated_by": "793f0f8b-8153-4ac8-aca9-cfff6e324096",
    "deleted_at": null
  },
  {
    "id": "5cab9802-0808-4be6-8613-16bc82a1406d",
    "name": "HNB",
    "code": "HNB",
    "registration_number": "HNB",
    "email": "info@ntc.gov.lk",
    "phone": "+94112369369",
    "address": "No. 503, Elvitigala Mawatha, Narahenpita",
    "city": "Colombo",
    "province": "Western Province",
    "status": "active",
    "created_at": "2025-10-31 12:46:05.402691",
    "updated_at": "2025-11-18 03:43:13.778025",
    "created_by": null,
    "updated_by": null,
    "deleted_at": null
  }
];

export default function CompanyForm({
  organisation_id,
  organisations,
  initialData,
  onSubmit,
  onCancel,
}: CompanyFormProps) {
  const [formData, setFormData] = useState<Company>({
    registration_number: '',
    name: '',
    email: '',
    phone: '',
    province: '',
    city: '',
    address: '',
    organisation_id: organisation_id,
    id: null
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Company, string>>>({});

  useEffect(() => {
    console.log(initialData, "sssssssssssssssssssssssssssssssss")
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof Company, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Company, string>> = {};
    (Object.keys(formData) as (keyof Company)[]).forEach((key) => {
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
          <CardTitle className="text-lg">{initialData ? 'Edit Company' : 'Add New Company'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <div className="space-y-2">
                <Label htmlFor="company_id" className="block text-gray-700 font-medium mb-2">Organisation Id</Label>
                <Input id="company_id" value={organisation_id ? (organisation_id) : ("")} disabled className="bg-gray-100" />
              </div> */}

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">
                  Organisation*
                </Label>
                <Select
                  value={formData.organisation_id ? String(formData.organisation_id) : ''}
                  onValueChange={(value) => handleChange('organisation_id', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {organisations?.map((item, index) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Name *</Label>
                <Input
                  placeholder="Name"

                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
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
                <Label className="block text-gray-700 font-medium mb-2">Email *</Label>
                <Input
                  placeholder="email"

                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Phone Number *</Label>
                <Input
                  placeholder="phone"

                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Address *</Label>
                <Input
                  placeholder="address"

                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">City *</Label>
                <Input
                  placeholder="city"

                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">{errors.city}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Province *</Label>
                <Input
                  placeholder="province"

                  value={formData.province}
                  onChange={(e) => handleChange('province', e.target.value)}
                />
                {errors.province && (
                  <p className="text-red-500 text-sm">{errors.province}</p>
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
