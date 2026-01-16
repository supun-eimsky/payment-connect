'use client';

import React, { useState, useEffect } from 'react';
import { useNavbar } from '@/context/navbar-context';
import CompanyForm, { } from '@/components/company/company-form';
import CompanyTable, { } from '@/components/company/company-table';
import { BusFormData, Bus, BusFilters } from '@/types/bus-management';
import { Company, CompanyFilters } from '@/types/company';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { CompanyDetailPopup } from '@/components/company/company-detail-popup'
import { useRouter } from 'next/navigation';
import { Organisation, OrganisationFilters } from '@/types/organisations';

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

////set Organisation_ID
const userStr = localStorage.getItem("user")
let Organisation_ID: any = null;
if (userStr) {
    const parsed = JSON.parse(userStr);
    Organisation_ID = parsed.organisation_id ? (parsed.organisation_id) : (null);
}



export default function CompanyManagement() {

    const { token } = useAuth();
    const { setNavbarData } = useNavbar();
    const [companies, setcompanies] = useState<Company[]>([]);
    const [organisations, setOrganisations] = useState<Organisation[]>([]);

    const [showForm, setShowForm] = useState(false);
    const [editingBus, setEditingBus] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState(null)
    const [filters, setFilters] = useState<CompanyFilters>({
        organisation_id: Organisation_ID,
        offset: 0,
        limit: 100,

    });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; busId: string | null }>({
        open: false,
        busId: null,
    });

    useEffect(() => {
        setNavbarData('Company Management', 'Company Management / Company List');

        fetchCompanies(filters)
        if(Organisation_ID==null){
             fetchOrganisations({
            limit: 100

        })
        }
       
    }, []);

    const fetchOrganisations = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            setLoading(true)
            const data = await apiService.getOrganisationsWithFilters(token, null, filterData);
            const busesArray = data || [];
            setOrganisations(busesArray.data);
          //  console.log('Organisations Details Data:', busesArray.data);
        } catch (err: any) {
            console.error('Company to fetch bus', err);
            setError(err.message);
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
            const busesArray = data || [];
            setcompanies(busesArray.data);
           // console.log('Company Details Data:', busesArray);
        } catch (err: any) {
            console.error('Company to fetch bus', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }

    }
    const handleAdd = () => {
        setEditingBus(null);
        setShowForm(true);
    };

    const handleEdit = (bus: Company) => {
       // console.log(bus)
        setEditingBus(bus);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        setDeleteDialog({ open: true, busId: id });
    };
    const handleItemView = (bus: any) => {
       // console.log(bus)
        router.push('/company/view?id=' + bus.id)
        // setSelectedItem(bus);
    };

    const confirmDelete = async () => {
        if (deleteDialog.busId) {
            // setcompanies((prev) => prev.filter((bus) => bus.id !== deleteDialog.busId));
            if (!token) return;
            try {
                const createRespone = await apiService.deleteCompany(token, deleteDialog.busId);
              //  console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchCompanies(filters)
                }


            } catch (err: any) {
                console.log(err.message);
                setError(err.message);
            } finally {

            }
        }
        setDeleteDialog({ open: false, busId: null });
    };

    const handleFormSubmit = async (data: Company) => {
        if (editingBus) {

            if (!token) return;
            try {
                const createRespone = await apiService.updateCompany(token, data);
              //  console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchCompanies(filters)
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
                const createRespone = await apiService.createCompany(token, data);
              //  console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchCompanies(filters)
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
                        <CompanyForm
                            organisation_id={Organisation_ID}
                            organisations={organisations}
                            initialData={editingBus ? {
                                registration_number: editingBus.registration_number,
                                name: editingBus.name,
                                email: editingBus.email,
                                phone: editingBus.phone,
                                address: editingBus.address,
                                city: editingBus.city,
                                province: editingBus.province,
                                organisation_id: editingBus.organisation_id,
                                id: editingBus.id,
                            } : null}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setShowForm(false)}
                        />

                    ) : (
                        <CompanyTable companies={companies} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} onView={handleItemView} />
                    )}

                    <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, busId: null })}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this company? This action cannot be undone.
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
                    <CompanyDetailPopup item={selectedItem} onClose={() => setSelectedItem(null)} />
                </div>
            </div>
        </div>
    );
}
