'use client';

import React, { useState, useEffect } from 'react';
import { useNavbar } from '@/context/navbar-context';
import RoutePermitForm, { } from '@/components/route-permits/route-permit-form';
import RoutePermitTable, { } from '@/components/route-permits/route-permit-table';
import { BusFormData, Bus, BusFilters } from '@/types/bus-management';
import { RoutePermit, RoutePermitFormData, RoutePermitFilters } from '@/types/route-permits';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { DetailPopup } from '@/components/permit-detail-popup'
import { DataPagination } from "@/components/pagination/DataPagination";
import { PaginatedResponse } from "@/types";
import { usePagination } from "@/hooks/usePagination";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from '@/components/ui/card';

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
import { Company, CompanyFilters } from '@/types/company';

const userStr = localStorage.getItem("user")
let Organisation_ID: any = null;
let COMPANY_ID: any = null;
if (userStr) {
    const parsed = JSON.parse(userStr);
    Organisation_ID = parsed.organisation_id ? (parsed.organisation_id) : (null);
    COMPANY_ID = parsed.company_id ? (parsed.company_id) : (null)
}

export default function BusManagement() {
    const { token } = useAuth();
    const pagination = usePagination(10);
    const { setNavbarData } = useNavbar();
    const [routePermits, setRoutePermits] = useState<RoutePermit[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingRoutePermit, setEditingRoutePermit] = useState<RoutePermit | null>(null);
    const [loading, setLoading] = useState(true);
    const [companies, setcompanies] = useState<Company[]>([]);
    const [routeList, setRouteList] = useState<any[]>([]);


    const [error, setError] = useState('');
    const [selectedItem, setSelectedItem] = useState(null)
    const [filters, setFilters] = useState<BusFilters>({
        company_id: COMPANY_ID,
        organisation_id:Organisation_ID

    });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; busId: string | null }>({
        open: false,
        busId: null,
    });



    const fetchRoute = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            console.log(filterData, "sssssssssssssssssssjkjlj")
            const data = await apiService.getRouteWithFilters(token, null, filterData);
            const busesArray = data.routes;

            setRouteList(busesArray)
            // setAvailableRoutes(busesArray)
            //  setRoutePermits(busesArray);
            console.log('Route  dsssssss:', busesArray);
        } catch (err) {
            console.error('Route  d', err);
        } finally {
            //  setLoading(false);
        }

    }
    const fetchCompanies = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            setLoading(true)
            const data = await apiService.getCompaniesWithFilters(token, null, filterData);
            const busesArray = data || [];
            setcompanies(busesArray.data);
            console.log('Company Details Data:', busesArray);
        } catch (err: any) {
            console.error('Company to fetch bus', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }

    }
    const fetchRoutePermits = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            setLoading(true)
            const data = await apiService.getRoutePermitsWithFilters(token, null, filterData);
            const busesArray = data || [];
            setRoutePermits(busesArray.data);
            pagination.setTotal(busesArray.total);
            console.log('Route Permits ds:', busesArray);
        } catch (err) {
            console.error('Route Permits d', err);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        setNavbarData('Permits Management', 'Permits Management / Permits List');
        filters.limit = pagination.limit
        filters.offset = pagination.offset
        fetchRoutePermits(filters)
        fetchRoute(filters)
        if (!COMPANY_ID) {
            fetchCompanies(filters)
        } else {

        }
    }, [pagination.currentPage]);
    const handleAdd = () => {
        setEditingRoutePermit(null);
        setShowForm(true);
    };

    const handleEdit = (bus: RoutePermit) => {
        console.log(bus)


        setEditingRoutePermit(bus);
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
                const createRespone = await apiService.deleteRoutePermit(token, deleteDialog.busId);
                console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchRoutePermits(filters)
                }

            } catch (err: any) {
                console.log(err.message);
                setError(err.message);
            } finally {

            }
        }
        setDeleteDialog({ open: false, busId: null });
    };

    const handleCompanySlect = async (data: any) => {
        filters.company_id = data
        console.log(data)
        fetchRoute(filters)
    }

    const handleFormSubmit = async (data: RoutePermitFormData) => {
        if (editingRoutePermit) {

            if (!token) return;
            try {
                const createRespone = await apiService.updateRoutePermit(token, data);
                console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchRoutePermits(filters)
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
                console.log(data)
                const createRespone = await apiService.createRoutePermits(token, data);
                console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchRoutePermits(filters)
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
                        <RoutePermitForm
                            companyId={COMPANY_ID}
                            companyList={companies.length > 0 ? (companies) : (null)}
                            routList={routeList.length > 0 ? (routeList) : ([])}

                            initialData={editingRoutePermit ? {
                                route_id: editingRoutePermit.route_id,
                                permit_number: editingRoutePermit.permit_number,
                                issued_date: editingRoutePermit.issued_date,
                                expiry_date: editingRoutePermit.expiry_date,
                                company_id: editingRoutePermit.company_id,
                                id: editingRoutePermit.id,
                            } : null}
                            onSubmit={handleFormSubmit}
                            onSelectCompany={handleCompanySlect}
                            onCancel={() => setShowForm(false)}
                        />

                    ) : (
                        <> <div className="px-1 lg:px-3">
                            <Card className='py-[15px]'>
                                <RoutePermitTable buses={routePermits} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} onView={handleItemView} />

                                <DataPagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    total={pagination.total}
                                    limit={pagination.limit}
                                    onPageChange={pagination.goToPage}
                                />
                            </Card>
                        </div>
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
