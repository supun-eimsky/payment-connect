'use client';

import React, { useState, useEffect } from 'react';
import { useNavbar } from '@/context/navbar-context';
import UserForm, { } from '@/components/user/user-form';
import UserTable, { } from '@/components/user/user-table';
import { User, UserFilters } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { DetailPopup } from '@/components/user/detail-popup';
import { Card } from '@/components/ui/card';
// import { DynamicFilter } from '@/components/dynamic_filter';
import { usePagination } from "@/hooks/usePagination";
import { DataPagination } from "@/components/pagination/DataPagination";
import { PageHeaderFilter } from '@/components/page-header-filter';

import { PaginatedResponse } from "@/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { FilterField, FilterValues, DynamicFilterProps } from '@/types';

////set Organisation_ID
const userStr = localStorage.getItem("user")
let Organisation_ID: any = null;
let COMPANY_ID: any = null;
if (userStr) {
    const parsed = JSON.parse(userStr);
    Organisation_ID = parsed.organisation_id ? (parsed.organisation_id) : (null);
    COMPANY_ID = parsed.company_id ? (parsed.company_id) : (null)
}


export default function UserManagement() {
    const { token } = useAuth();
    const pagination = usePagination(10);
    const { setNavbarData } = useNavbar();
    const [buses, setBuses] = useState<User[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedItem, setSelectedItem] = useState(null)
    const [filters, setFilters] = useState<UserFilters>({
        company_id: COMPANY_ID,
        organisation_id: Organisation_ID,
    });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; busId: string | null }>({
        open: false,
        busId: null,
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterValues, setFilterValues] = useState<FilterValues>({});
    const filterFields: FilterField[] = [
        {
            key: 'search',
            label: 'Search',
            type: 'text',
            placeholder: 'Search ...',
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: companies,
        },
        {
            key: 'role',
            label: 'Role',
            type: 'multiselect',
            options: [

            ],
        },
        {
            key: 'date',
            label: 'Date',
            type: 'date',
        },
    ];
    const filterFieldsPageHeader: FilterField[] = [

        {
            key: 'company_id',
            label: 'Company',
            type: 'select',
            options: companies,
        },
        {
            key: 'user_type',
            label: 'User Type',
            type: 'select',
            options: [
                {
                    name: "Driver",
                    id: "driver"
                },
                {
                    name: "Conductor",
                    id: "conductor"
                },
                {
                    name: "Company Admin",
                    id: "company_admin"
                },
                {
                    name: "Organisation Admin",
                    id: "organisation_admin"
                }

            ],
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                {
                    name: "Active",
                    id: "active"
                },
                {
                    name: "Inactive",
                    id: "inactive"
                }

            ],
        },



    ];
    useEffect(() => {
        setNavbarData('User Management', 'User Management / User List');

    }, [setNavbarData]);
    const fetchUsers = async (filterData: any) => {
        if (!token) return;

        try {
            // Call with filter
            setLoading(true)
            const data = await apiService.getUsersWithFilters(token, null, filterData);
            const busesArray = data || [];
            setBuses(busesArray.data);
            fetchCompanies({
                "organisation_id": Organisation_ID
            })
            pagination.setTotal(busesArray.total);
            console.log('User Details Data:', busesArray);
        } catch (err) {
            console.error('Failed to fetch bus', err);
        } finally {
            setLoading(false);
        }

    }
    const fetchCompanies = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            setLoading(true)
            const data = await apiService.getCompaniesWithFilters(token, null, filterData);
            const companiesArray = data || [];
            setCompanies(companiesArray.data)
            //  setcompanies(busesArray.data);
            console.log('Company Details Data:', companiesArray);
        } catch (err: any) {
            console.error('Company to fetch bus', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }

    }


    const handleAdd = () => {
        setEditingUser(null);
        setShowForm(true);
    };

    const handleFilter = (list: any) => {

        const output = {
            ...filters,
            ...Object.fromEntries(
                Object.entries(list).filter(([_, v]) => v !== "")
            ),
        };
        setFilters(output)

        fetchUsers(output);
    };


    useEffect(() => {
        filters.limit = pagination.limit
        filters.offset = pagination.offset

        fetchUsers(filters);
        console.log('Filters applied:', filters);
    }, [pagination.currentPage]);
    const handleEdit = (bus: User) => {
        console.log(bus)
        setEditingUser(bus);
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
                    fetchUsers(filters)
                }


            } catch (err: any) {
                console.log(err.message);
                setError(err.message);
            } finally {

            }
        }
        setDeleteDialog({ open: false, busId: null });
    };

    const handleFormSubmit = async (data: User) => {
        if (editingUser) {

            if (!token) return;
            try {
                const createRespone = await apiService.updateUser(token, data);
                console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchUsers(filters)
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
                const createRespone = await apiService.createUser(token, data);
                console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchUsers(filters)
                }
            } catch (err: any) {
                console.log(err.message);
                setError(err.message);
            } finally {

            }
        }

    };
    const handleFilterPopup = async () => {
        console.log("ssssss")
        setIsFilterOpen(true)
    }
    const handleFilterSubmit = (filterData: any) => {
        console.log('Received filters:', filterData);


    };
    const handleFilterValuesRest = async (data: FilterValues) => {
        console.log(data)

        location.reload()

    }

    const handleFilterValues = async (data: FilterValues) => {
        console.log(data)
        const merged = { ...filters, ...data };
        setFilters(merged)
        fetchUsers(merged);

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
                        <UserForm
                            companyId={COMPANY_ID}
                            OrganisationId={Organisation_ID}
                            initialData={editingUser ? editingUser : null}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setShowForm(false)}
                        />

                    ) : (
                        <>
                            <div className="px-1 lg:px-3">
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
                                    <UserTable onFilterMain={handleFilterPopup} companiesList={companies} pagination={pagination} users={buses} onAdd={handleAdd} onFilter={handleFilter} onEdit={handleEdit} onDelete={handleDelete} onView={handleItemView} />
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
