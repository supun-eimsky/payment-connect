'use client';

import React, { useState, useEffect } from 'react';
import { useNavbar } from '@/context/navbar-context';
import RoutePermitForm, { } from '@/components/device/device-form';
import RoutePermitTable, { } from '@/components/device/device-table';
import { RoutePermit, RoutePermitFormData, RoutePermitFilters } from '@/types/route-permits';
import { Devices, DeviceFilters, DeviceProps } from '@/types/device';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { DetailPopup } from '@/components/permit-detail-popup'
import { DataPagination } from "@/components/pagination/DataPagination";
import { PaginatedResponse } from "@/types";
import { usePagination } from "@/hooks/usePagination";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

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
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Company, CompanyFilters } from '@/types/company';
import { Organisation } from '@/types/organisations';

const userStr = localStorage.getItem("user")
let Organisation_ID: any = null;
let COMPANY_ID: any = null;
if (userStr) {
    const parsed = JSON.parse(userStr);
    Organisation_ID = parsed.organisation_id ? (parsed.organisation_id) : (null);
    COMPANY_ID = parsed.company_id ? (parsed.company_id) : (null)
}

export default function DevicesManagement() {
    const { token } = useAuth();
    const pagination = usePagination(10);
    const { setNavbarData } = useNavbar();
    const [devices, setDevices] = useState<Devices[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingRoutePermit, setEditingRoutePermit] = useState<Devices | null>(null);
    const [loading, setLoading] = useState(true);
    const [companies, setcompanies] = useState<Company[]>([]);
    const [organisations, setOrganisations] = useState<Organisation[]>([]);
    const [routeList, setRouteList] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [previousCursor, setPreviousCursor] = useState<string | null>(null);
    const router = useRouter();

    const [error, setError] = useState('');
    const [selectedItem, setSelectedItem] = useState(null)
    const [filters, setFilters] = useState<DeviceFilters>({
        organisation_id: Organisation_ID,
        company_id: COMPANY_ID,

    });


    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; busId: string | null }>({
        open: false,
        busId: null,
    });



    const fetchDevices = async (filtersData: any, cursor?: string | null) => {
        if (!token) return;
        try {


            const data = await apiService.getDevicesWithFilters(token, cursor, filtersData);
            const busesArray = data.data;
          //  console.log(busesArray, "device data ffffff")
            setDevices(busesArray.data)
            setHasMore(busesArray.has_more);
            setNextCursor(busesArray.next_cursor ?? null);
            setPreviousCursor(busesArray.previous_cursor ?? null);
            // setAvailableRoutes(busesArray)
            //  setRoutePermits(busesArray);
          //  console.log('Route  dsssssss:', busesArray);
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
          //  console.log('Company Details Data:', busesArray);
        } catch (err: any) {
            console.error('Company to fetch bus', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }

    }
    const fetchOrganisations = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            // filterData.limit = 100;
            setLoading(true)
            const data = await apiService.getOrganisationsWithFilters(token, null, filterData);
            const busesArray = data || [];
            setOrganisations(busesArray.data);
          //  console.log('Organisation Details Data:', busesArray);
        } catch (err: any) {
            console.error('Organisation to fetch bus', err);
           // setError(err.message);
        } finally {
            setLoading(false);
        }
    }
    const fetchRoutePermits = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            setLoading(true)
            //  const data = await apiService.getRoutePermitsWithFilters(token, null, filterData);
            //const busesArray = data || [];
            setDevices([]);
            //   pagination.setTotal(busesArray.total);
            //console.log('Route Permits ds:', busesArray);
        } catch (err) {
            console.error('Route Permits d', err);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        setNavbarData('Devices Management', 'Devices Management / Devices List');
        filters.limit = pagination.limit
        filters.offset = pagination.offset
        fetchRoutePermits(filters)
        fetchOrganisations(filters)
        fetchDevices(filters, null)
        if (!COMPANY_ID) {
            fetchCompanies(filters)
        } else {

        }
    }, [pagination.currentPage]);
    const handleAdd = () => {
        setEditingRoutePermit(null);
        setShowForm(true);
    };

    const handleEdit = (bus: Devices) => {
       // console.log(bus)


        setEditingRoutePermit(bus);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        setDeleteDialog({ open: true, busId: id });
    };
    const handleItemView = (bus: any) => {
       // console.log(bus)

        router.push('/devices/view?id=' + bus.id)
    };

    const confirmDelete = async () => {
        if (deleteDialog.busId) {
            // setBuses((prev) => prev.filter((bus) => bus.id !== deleteDialog.busId));
            if (!token) return;
            try {
                const createRespone = await apiService.deleteRoutePermit(token, deleteDialog.busId);
              //  console.log(createRespone)
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
      //  console.log(data)
        //   fetchRoute(filters)
    }
    const asdignToOrganisation = async (data: any) => {



    }

    const handleFormSubmit = async (data: Devices) => {
        if (editingRoutePermit) {

            if (!token) return;
            try {
                const createRespone = await apiService.updateDevicesOrganisation(token, data);
              //  console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchDevices(filters)
                }


            } catch (err: any) {
               // console.log(err.message);
                setError(err.message);
            } finally {

            }
            setShowForm(false);
        } else {
            if (!token) return;
            try {
                setError("");
                if (Organisation_ID === null) {
                    Organisation_ID = data.organisation_id ? (data.organisation_id) : (null);
                }

                const createRespone = await apiService.createDevicesOrganisation(token, Organisation_ID, data);
               // console.log(createRespone, "sss")
                if (createRespone.success) {
                    setShowForm(false);
                    fetchDevices(filters)
                }
            } catch (err: any) {
                console.log(err.message);
                setError(err.message);
            } finally {

            }
        }

    };
    const handleNext = () => {
       // console.log('Next cursor:', nextCursor);
        if (hasMore && nextCursor) {
            fetchDevices(filters, nextCursor);
        }
    };

    // Handle previous page
    const handlePrevious = () => {
        if (previousCursor != "") {

            fetchDevices(filters, previousCursor);
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
                            organisationList={organisations.length > 0 ? (organisations) : (null)}

                            initialData={editingRoutePermit ? {
                                device_code: editingRoutePermit.device_code,
                                serial_number: editingRoutePermit.serial_number,
                                model: editingRoutePermit.model,
                                manufacturer: editingRoutePermit.manufacturer,
                                mac_address: editingRoutePermit.mac_address,
                                imei: editingRoutePermit.imei,
                                purchase_date: editingRoutePermit.purchase_date,
                                warranty_expiry: editingRoutePermit.warranty_expiry,
                                firmware_version: editingRoutePermit.firmware_version,
                                status: editingRoutePermit.status,
                                id: editingRoutePermit.id,
                                organisation_id: editingRoutePermit.organisation_id
                            } : null}
                            onSubmit={handleFormSubmit}
                            onSelectCompany={handleCompanySlect}
                            onCancel={() => setShowForm(false)}
                        />

                    ) : (
                        <> <div className="px-1 lg:px-3">
                            <Card className='py-[15px]'>
                                <RoutePermitTable buses={devices} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} onView={handleItemView} />

                                {/* <DataPagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    total={pagination.total}
                                    limit={pagination.limit}
                                    onPageChange={pagination.goToPage}
                                /> */}
                                <div className="flex justify-end gap-2 px-1 lg:px-3 pb-4">
                                    <div className="mt-6 flex items-center justify-between">

                                        <div className="flex gap-2">
                                            <button
                                                onClick={handlePrevious}
                                                disabled={previousCursor == null || previousCursor == "" || loading}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${previousCursor == null || loading
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                                    }`}
                                            >
                                                <ChevronLeft size={16} />
                                                Previous
                                            </button>

                                            <button
                                                onClick={handleNext}
                                                disabled={!hasMore || loading}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${!hasMore || loading
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600'
                                                    }`}
                                            >
                                                Next
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>

                                </div>
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
