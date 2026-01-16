'use client';

import React, { useState, useEffect } from 'react';
import { useNavbar } from '@/context/navbar-context';
import RouteForm, { } from '@/components/route/route-form';
import RouteTable, { } from '@/components/route/route-table';
import { BusFormData, Bus, BusFilters } from '@/types/bus-management';
import { Route, RouteFormData, RouteFilters } from '@/types/route';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { DetailPopup } from '@/components/permit-detail-popup'
import { useRouter } from 'next/navigation';
import { PageHeaderFilter } from '@/components/page-header-filter';
import { FilterField, FilterValues, DynamicFilterProps } from '@/types';

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
import { AlertCircle, Code, AppWindow } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';


const userStr = localStorage.getItem("user")
let Organisation_ID: any = null;
let COMPANY_ID: any = null;
let role: any = null;
if (userStr) {
    const parsed = JSON.parse(userStr);
    Organisation_ID = parsed.organisation_id ? (parsed.organisation_id) : (null);
    COMPANY_ID = parsed.company_id ? (parsed.company_id) : (null);
    role = parsed.user_type ? (parsed.user_type) : (null);
}
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


export default function BusManagement() {
    const { token } = useAuth();
    const router = useRouter();
    const { setNavbarData } = useNavbar();
    const [routePermits, setRoutePermits] = useState<Route[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingRoutePermit, setEditingRoutePermit] = useState<Route | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedItem, setSelectedItem] = useState(null)
    const [filters, setFilters] = useState<BusFilters>({
        company_id: COMPANY_ID,
        organisation_id: Organisation_ID,
        offset: 0,
        limit: 10,

    });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; busId: string | null }>({
        open: false,
        busId: null,
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterValues, setFilterValues] = useState<FilterValues>({});
    const filterFieldsPageHeader: FilterField[] = [

        {
            key: 'code',
            label: 'Code',
            type: 'text',
            placeholder: 'Code ...',
            icon: <AppWindow className="w-4 h-4" />,
        },

        {
            key: 'search',
            label: 'Search',
            type: 'text',
            placeholder: 'Search ...',
            icon: "",
        },



    ];
    useEffect(() => {
        setNavbarData('Route Management', 'Route Management / Routes');
        fetchRoute(filters)
    }, []);
    const fetchRoute = async (filterData: any) => {
        if (!token) return;
        if (role === "company_admin" || role === "company_onwner") {
            try {

                // Call with filter
                //    setLoading(true)
                const data = await apiService.getRouteCompany(token, filterData.company_id);
                const busesArray = data.routes;
                setRoutePermits(busesArray);
                console.log(busesArray)
                return
                //  console.log('Route  dsssssss:', busesArray);
            } catch (err) {
                console.error('Route  d', err);
            } finally {
                // setLoading(false);
            }
        } else {

            try {

                // Call with filter
                setLoading(true)
                const data = await apiService.getRouteWithFilters(token, null, filterData);
                const busesArray = data.routes;
                setRoutePermits(busesArray);
                console.log('Route  dsssssss:', busesArray);
            } catch (err) {
                console.error('Route  d', err);
            } finally {
                setLoading(false);
            }
        }


    }
    const handleAdd = () => {
        setEditingRoutePermit(null);
        setShowForm(true);
    };
    const onViewFareTable = (bus: any) => {
        // console.log(bus.id)
        router.push('/route/fare-table?id=' + bus.id, undefined)
    };
    const handleEdit = (bus: Route) => {
        // console.log(bus)
        setEditingRoutePermit(bus);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        setDeleteDialog({ open: true, busId: id });
    };
    const handleItemView = (bus: any) => {
        // console.log(bus)
        router.push('/route/route-view/?id=' + bus.id)
    };

    const confirmDelete = async () => {
        if (deleteDialog.busId) {
            // setBuses((prev) => prev.filter((bus) => bus.id !== deleteDialog.busId));
            if (!token) return;
            try {
                const createRespone = await apiService.deleteRoutePermit(token, deleteDialog.busId);
                // console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchRoute(filters)
                }

            } catch (err: any) {
                console.log(err.message);
                setError(err.message);
            } finally {

            }
        }
        setDeleteDialog({ open: false, busId: null });
    };

    const handleFormSubmit = async (data: RouteFormData) => {
        if (editingRoutePermit) {

            if (!token) return;
            try {
                const createRespone = await apiService.updateRoute(token, data);
                //  console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchRoute(filters)
                    //fetchRoutePermits(filters)
                }


            } catch (err: any) {
                console.log(err.message);
                setError(err.message);
            } finally {

            }
            //setShowForm(false);
        } else {
            if (!token) return;
            try {
                setError("");
                //  console.log(data)
                const createRespone = await apiService.createRoute(token, data);
                //  console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchRoute(filters)
                }
            } catch (err: any) {
                console.log(err.message);
                setError(err.message);
            } finally {

            }
        }

    };
    const handleFilterValuesRest = async (data: FilterValues) => {
        //  console.log(data)

        location.reload()

    }

    const handleFilterValues = async (data: FilterValues) => {
        //  console.log(data)
        const merged = { ...filters, ...data };
        setFilters(merged)
        // fetchBuses(merged);

    }

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
                        <RouteForm
                            companyId={COMPANY_ID}
                            initialData={editingRoutePermit ? {
                                code: editingRoutePermit.code,
                                name: editingRoutePermit.name,
                                id: editingRoutePermit.id,
                                status: editingRoutePermit.status,
                            } : null}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setShowForm(false)}
                        />

                    ) : (<>
                        <div className="px-1 lg:px-3">
                            <PageHeaderFilter
                                isOpen={true}
                                onClose={() => setIsFilterOpen(false)}
                                fields={filterFieldsPageHeader}
                                values={filterValues}
                                onApply={handleFilterValues}
                                onReset={handleFilterValuesRest} />

                        </div>
                        <RouteTable buses={routePermits} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} onView={handleItemView} viewFareTable={onViewFareTable} />
                    </>
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
