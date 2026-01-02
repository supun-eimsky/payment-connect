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
const ROUTE_LIST = [
    {
        "lable": "Route 1",
        "value": "660e8400-e29b-41d4-a716-446655440001"
    }
];
const STANDING_CAPACITIES = [10, 15, 20, 25];

export default function RouteFormAddBus({
    companyId,
    initialData,
    onSubmit,
    onCancel,
}: RouteProps) {
    const [formData, setFormData] = useState<RouteFormData>({
        code: '',
        name: '',
        status:'',
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

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    






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

        </div>
    );
}
