'use client';

import React, { useState, useEffect } from 'react';
import { useNavbar } from '@/context/navbar-context';
import BusForm, { } from '@/components/bus-management/bus-form';
import BusTable, { } from '@/components/bus-management/bus-table';
// import { DynamicFilter } from '@/components/dynamic_filter';
import { BusFormData, Bus, BusFilters } from '@/types/bus-management';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { DetailPopup } from '@/components/detail-popup'
import { useRouter } from 'next/navigation';
import { Company, CompanyFilters } from '@/types/company';
import { DataPagination } from "@/components/pagination/DataPagination";
import { PaginatedResponse } from "@/types";
import { usePagination } from "@/hooks/usePagination";
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
import { AlertCircle, Clock, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

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
    const [buses, setBuses] = useState<Bus[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBus, setEditingBus] = useState<Bus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [yearsList, setYearsList] = useState<any[]>([]);
    const router = useRouter();
    const [companies, setcompanies] = useState<Company[]>([]);
    const [selectedItem, setSelectedItem] = useState(null)
    const [companyFilters, setCompanyFilters] = useState<any>({
        organisation_id: Organisation_ID,

    });
    const [filters, setFilters] = useState<BusFilters>({
        company_id: COMPANY_ID,

    });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; busId: string | null }>({
        open: false,
        busId: null,
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterValues, setFilterValues] = useState<FilterValues>({});

    // Define filter fields dynamically
    const getYearList = (start: number, end: number) => {
        const years = [];
        for (let y = start; y <= end; y++) {
            years.push({ id: y, name: y });
        }
        return years;
    };
    const filterFieldsPageHeader: FilterField[] = [

        {
            key: 'min_year',
            label: 'Min Year',
            type: 'select',
            options: yearsList,
             icon: <Clock className="w-4 h-4" />,
        },
        {
            key: 'max_year',
            label: 'Max Year',
            type: 'select',
            options: yearsList,
             icon: <Clock className="w-4 h-4" />,
        },

        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                {
                    name: "Operational",
                    id: "operational"
                },
                {
                    name: "Maintenance",
                    id: "maintenance"
                }
                ,
                {
                    name: "Retired",
                    id: "retired"
                },
                {
                    name: "Decommissioned",
                    id: "decommissioned"
                }

            ],
        },
        {
            key: 'search',
            label: 'Search',
            type: 'text',
            placeholder: 'Search ...',
            icon: "",
        },



    ];
   

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
  
    const fetchBuses = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            setLoading(true)
            const data = await apiService.getBusWithFilters(token, null, filterData);
            const busesArray = data || [];
            setBuses(busesArray.data);
            pagination.setTotal(busesArray.total);
            console.log('Bus Details Data:', busesArray);
        } catch (err) {
            console.error('Failed to fetch bus', err);
        } finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        setNavbarData('Bus Management', 'Bus Management / Bus List');
        setYearsList(getYearList(1980, 2025))
        filters.limit = pagination.limit
        filters.offset = pagination.offset
        fetchBuses(filters)
        if (!COMPANY_ID) {
            fetchCompanies(companyFilters)
        }
    }, [pagination.currentPage]);
    const handleAdd = () => {
        setEditingBus(null);
        setShowForm(true);
    };

    const handleEdit = (bus: Bus) => {
        console.log(bus)
        setEditingBus(bus);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        setDeleteDialog({ open: true, busId: id });
    };
    const handleItemView = (bus: any) => {
        console.log(bus)
        router.push('/bus-management/view?id=' + bus.id)
        // setSelectedItem(bus);
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
                    fetchBuses(filters)
                }


            } catch (err: any) {
                console.log(err.message);
                setError(err.message);
            } finally {

            }
        }
        setDeleteDialog({ open: false, busId: null });
    };
    const handleFilterPopup = async () => {
        console.log("ssssss")
        setIsFilterOpen(true)
    }

    const handleFormSubmit = async (data: BusFormData) => {
        if (editingBus) {

            if (!token) return;
            try {
                const createRespone = await apiService.updateBus(token, data);
                console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchBuses(filters)
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
                const createRespone = await apiService.createBus(token, data);
                console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchBuses(filters)
                }
            } catch (err: any) {
                console.log(err.message);
                setError(err.message);
            } finally {

            }
        }

    };
    const handleFilterValuesRest = async (data: FilterValues) => {
        console.log(data)

        location.reload()

    }

    const handleFilterValues = async (data: FilterValues) => {
        console.log(data)
        const merged = { ...filters, ...data };
        setFilters(merged)
        fetchBuses(merged);

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
                        <BusForm
                            companyId={COMPANY_ID}
                            companyList={companies.length > 0 ? (companies) : (null)}
                            onfilter={handleFilterPopup}
                            initialData={editingBus ? {
                                registration_number: editingBus.registration_number,
                                fleet_number: editingBus.fleet_number,
                                model: editingBus.model,
                                manufacturer: editingBus.manufacturer,
                                year_of_manufacture: editingBus.year_of_manufacture,
                                seating_capacity: editingBus.seating_capacity,
                                standing_capacity: editingBus.standing_capacity,
                                company_id: editingBus.company_id,
                                id: editingBus.id,
                            } : null}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setShowForm(false)}
                        />

                    ) : (
                        <> <div className="px-1 lg:px-3">
                            <PageHeaderFilter
                                isOpen={true}
                                onClose={() => setIsFilterOpen(false)}
                                fields={filterFieldsPageHeader}
                                values={filterValues}
                                onApply={handleFilterValues}
                                onReset={handleFilterValuesRest} />

                        </div>
                            <div className="px-1 lg:px-3">
                                <Card className='py-[15px]'>
                                    <BusTable onfilter={handleFilterPopup} buses={buses} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} onView={handleItemView} />

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
                    {/* <DynamicFilter
                        isOpen={isFilterOpen}
                        onClose={() => setIsFilterOpen(false)}
                        fields={filterFields}
                        values={filterValues}
                        onApply={setFilterValues}
                        onReset={() => setFilterValues({})}
                    /> */}
                </div>
            </div>
        </div>
    );
}
