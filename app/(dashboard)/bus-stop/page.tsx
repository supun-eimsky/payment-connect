'use client';

import React, { useState, useEffect } from 'react';
import { useNavbar } from '@/context/navbar-context';
import BusStopForm, { } from '@/components/bus-stop/bus-stop-form';
import BusStopTable, { } from '@/components/bus-stop/bus-stop-table';
import { BusStopFormData, BusStops, BusStopFilters } from '@/types/bus-stop';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { DetailPopup } from '@/components/detail-popup'


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
const userStr = localStorage.getItem("user")
let Organisation_ID: any = null;
let COMPANY_ID: any = null;
if (userStr) {
    const parsed = JSON.parse(userStr);
    Organisation_ID = parsed.organisation_id ? (parsed.organisation_id) : (null);
    COMPANY_ID = parsed.company_id ? (parsed.company_id) : (null)
}

export default function BusStop() {
    const { token } = useAuth();

    const { setNavbarData } = useNavbar();
    const [buses, setBuses] = useState<BusStops[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBus, setEditingBus] = useState<BusStops | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedItem, setSelectedItem] = useState(null)
    const [filters, setFilters] = useState<BusStopFilters>({
        offset: 0,
        limit: 100,

    });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; busId: string | null }>({
        open: false,
        busId: null,
    });

    useEffect(() => {
        setNavbarData('Bus Stop Management', 'Bus Stop Management / Bus Stop List');
        fetchBusStop(filters)
    }, []);
    const fetchBusStop = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            setLoading(true)
            const data = await apiService.getBusStopWithFilters(token, filterData);
            const busesArray = data || [];
            setBuses(busesArray);
            console.log('Bus Details Data:', busesArray);
        } catch (err) {
            console.error('Failed to fetch bus', err);
        } finally {
            setLoading(false);
        }

    }
    const handleAdd = () => {
        setEditingBus(null);
        setShowForm(true);
    };

    const handleEdit = (bus: BusStops) => {
        console.log(bus)
        setEditingBus(bus);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        setDeleteDialog({ open: true, busId: id });
    };
    const handleItemView = (bus: any) => {
        console.log(bus)
       setSelectedItem(bus);
    };

    const confirmDelete = async () => {
        if (deleteDialog.busId) {
            // setBuses((prev) => prev.filter((bus) => bus.id !== deleteDialog.busId));
            if (!token) return;
            try {
                const createRespone = await apiService.deleteBus(token, deleteDialog.busId);
                console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchBusStop(filters)
                }


            } catch (err: any) {
                console.log(err.message);
                setError(err.message);
            } finally {

            }
        }
        setDeleteDialog({ open: false, busId: null });
    };

    const handleFormSubmit = async (data: BusStopFormData) => {
        console.log(data)
        if (editingBus) {

            // if (!token) return;
            // try {
            //     const createRespone = await apiService.updateBus(token, data);
            //     console.log(createRespone)
            //     if (createRespone.success) {
            //         setShowForm(false);
            //         fetchBuses(filters)
            //     }


            // } catch (err: any) {
            //     console.log(err.message);
            //     setError(err.message);
            // } finally {

            // }
            //setShowForm(false);
        } else {
            if (!token) return;
            try {
                setError("");
                console.log(data)
                const createRespone = await apiService.createBusStop(token, data);
                console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchBusStop(filters)
                }
            } catch (err: any) {
                console.log(err.message);
                setError(err.message);
            } finally {

            }
        }

    };

    return (
        <div className="flex flex-col flex-1">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-5">
                    {error && (
                        <Alert variant="destructive" className="border-red-500">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="ml-2">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                    {showForm ? (
                        <BusStopForm
                            companyId={COMPANY_ID}
                            initialData={editingBus ? {
                                stop_code: editingBus.stop_code,
                                stop_name_en: editingBus.stop_name_en,
                                stop_name_si: editingBus.stop_name_si,
                                stop_name_tm: editingBus.stop_name_tm,
                                latitude: editingBus.latitude,
                                longitude: editingBus.longitude,
                                id: editingBus.id,
                            } : null}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setShowForm(false)}
                        />

                    ) : (
                        <BusStopTable buses={buses} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} onView={handleItemView}/>
                    )}

                    <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, busId: null })}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this bus? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleteDialog({ open: false, busId: null })}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                                    Confirm
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    {/* <CHANGE> Left-side detail popup */}
                    <DetailPopup item={selectedItem} onClose={() => setSelectedItem(null)} />
                </div>
            </div>
        </div>
    );
}
