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
import { BusStopFormData, BusStopFormProps } from '@/types/bus-stop';

export default function BusForm({
  companyId,
  initialData,
  onSubmit,
  onCancel,
}: BusStopFormProps) {
  const [formData, setFormData] = useState<BusStopFormData>({
    stop_code: '',
    stop_name_en: '',
    stop_name_si: '',
    stop_name_tm: '',
    latitude: 0,
    longitude: 0,
    id: null
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BusStopFormData, string>>>({});

  useEffect(() => {
    console.log(initialData, "sssssssssssssssssssssssssssssssss")
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof BusStopFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BusStopFormData, string>> = {};
    (Object.keys(formData) as (keyof BusStopFormData)[]).forEach((key) => {
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
          <CardTitle className="text-lg">{initialData ? 'Edit Bus Stop' : 'Add New Bus Stop'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Stop Code *</Label>
                <Input
                  placeholder="Stop Code"
                  value={formData.stop_code}
                  onChange={(e) => handleChange('stop_code', e.target.value)}
                />
                {errors.stop_code && (
                  <p className="text-red-500 text-sm">{errors.stop_code}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Stop Name en *</Label>
                <Input
                  placeholder="Stop Name En"

                  value={formData.stop_name_en}
                  onChange={(e) => handleChange('stop_name_en', e.target.value)}
                />
                {errors.stop_name_en && (
                  <p className="text-red-500 text-sm">{errors.stop_name_en}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Stop Name si *</Label>
                <Input
                  placeholder="Stop Name si"

                  value={formData.stop_name_si}
                  onChange={(e) => handleChange('stop_name_si', e.target.value)}
                />
                {errors.stop_name_si && (
                  <p className="text-red-500 text-sm">{errors.stop_name_si}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Stop Name tm *</Label>
                <Input
                  placeholder="Stop Name tm"

                  value={formData.stop_name_tm}
                  onChange={(e) => handleChange('stop_name_tm', e.target.value)}
                />
                {errors.stop_name_tm && (
                  <p className="text-red-500 text-sm">{errors.stop_name_tm}</p>
                )}
              </div>


              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Latitude *</Label>
                <Input
                  placeholder="Latitude"
                  type="number"
                  value={formData.latitude}
                  onChange={(e) => handleChange('latitude', Number(e.target.value))}
                />
                {errors.latitude && (
                  <p className="text-red-500 text-sm">{errors.latitude}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Longitude *</Label>
                <Input
                  placeholder="Longitude"
                  type="number"
                  value={formData.longitude}
                  onChange={(e) => handleChange('longitude', Number(e.target.value))}
                />
                {errors.longitude && (
                  <p className="text-red-500 text-sm">{errors.longitude}</p>
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
