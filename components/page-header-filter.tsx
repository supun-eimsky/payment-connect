"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Trip, TripFilters, TripDetails } from '@/types';
import { FilterField, FilterValues, DynamicFilterProps } from '@/types';
import { X, Filter, ChevronDown } from 'lucide-react';
import { AlertCircle, User, Search, List } from 'lucide-react';

interface SessionViewFilterBarProps {
    isOpen: boolean;
    onClose: () => void;
    fields: FilterField[];
    values: FilterValues;
    //onApply: (values: FilterValues) => void;
    onApply: (data: FilterValues) => void;
    onReset: (data: FilterValues) => void;
    onChange?: (data: any) => void;
}

export function PageHeaderFilter({
    isOpen,
    onClose,
    fields,
    values,
    onApply,
    onChange,
    onReset, }: SessionViewFilterBarProps) {
    const [route, setRoute] = useState("")
    const [busNumber, setBusNumber] = useState("")
    const [conductor, setConductor] = useState("")
    const [date, setDate] = useState("")
    const [localValues, setLocalValues] = useState<FilterValues>(values);

    const handleChange = (key: string, value: any) => {
        setLocalValues(prev => ({ ...prev, [key]: value }));
        console.log({ ...localValues, [key]: value });
      
            onChange?.({ ...localValues, [key]: value });
        
    };

    const handleApply = () => {
        console.log(localValues);
        onApply(localValues);
        onClose();
    };

    const handleReset = () => {
        const resetValues = fields.reduce((acc, field) => {
            acc[field.key] = field.type === 'multiselect' ? [] : '';
            return acc;
        }, {} as FilterValues);
        setLocalValues(resetValues);
        onReset({});
    };

    const toggleMultiSelect = (key: string, value: string) => {
        const current = localValues[key] || [];
        const updated = current.includes(value)
            ? current.filter((v: string) => v !== value)
            : [...current, value];
        handleChange(key, updated);
    };


    return (
        <>
            {/* Backdrop */}


            {/* Filter Panel */}
            <div className="w-full bg-[#1D8AF5] p-3 rounded-xl flex flex-grid items-center justify-between gap-3">
                <div className="flex flex-grid items-center gap-2 w-full">
                    {/* Header */}
                    {/* <div className="flex items-center justify-between p-4 border-b">
                   <div className="flex items-center gap-2">
                     <Filter className="w-5 h-5 text-blue-600" />
                     <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                   </div>
                   <button
                     onClick={onClose}
                     className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                   >
                     <X className="w-5 h-5 text-gray-600" />
                   </button>
                 </div> */}

                    {/* Filter Fields */}

                    {fields.map(field => (
                        <div key={field.key} className="space-y-3">


                            {field.type === 'text' && (
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">
                                        {field.icon || <Search className="w-4 h-4" />}
                                    </div>
                                    <input
                                        type="text"
                                        value={localValues[field.key] || ''}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        placeholder={field.placeholder}
                                        className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>

                            )}

                            {field.type === 'number' && (

                                <input
                                    type="number"
                                    value={localValues[field.key] || null}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />

                            )}

                            {field.type === 'date' && (
                                <input
                                    type="date"
                                    value={localValues[field.key] || ''}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            )}

                            {field.type === 'select' && (
                                <div className="relative w-full" >
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10">
                                        {field.icon || <List className="w-4 h-4" />}
                                    </div>
                                    <select
                                        value={localValues[field.key] || ''}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        className="text-[13px] w-full h-11 pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                                    >
                                        <option value="null" >Select {field.label}</option>
                                        {field.options?.map(opt => (
                                            <option key={opt.id} value={opt.id}>
                                                {opt.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            )}

                            {field.type === 'multiselect' && (
                                <div className="space-y-2 border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                                    {field.options?.map(opt => (
                                        <label
                                            key={opt.id}
                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={(localValues[field.key] || []).includes(opt.id)}
                                                onChange={() => toggleMultiSelect(field.key, opt.id)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{opt.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                </div>

                <div className="flex gap-2"> {/* Footer Actions */}
                     <Button
                        onClick={handleApply}
                        className="bg-blue-400 hover:bg-blue-600 text-white h-11 rounded-12 px-6"

                    >
                        Apply
                    </Button>
                    <Button
                        onClick={handleReset}
                        className="bg-gray-50 hover:bg-blue-600 text-black h-11 rounded-12 px-6"
                    >
                        Reset
                    </Button>

                   


                </div>
            </div >
        </>
    )
}