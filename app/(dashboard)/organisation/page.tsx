'use client';

import React, { useState, useEffect } from 'react';
import { useNavbar } from '@/context/navbar-context';
import OrganisationForm, { } from '@/components/organisation/organisation-form';
import OrganisationTable, { } from '@/components/organisation/organisation-table';
import { Organisation, OrganisationFilters } from '@/types/organisations';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { CompanyDetailPopup } from '@/components/company/company-detail-popup'
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
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Company } from '@/types/company';

////set Organisation_ID
const userStr = localStorage.getItem("user")
let Organisation_ID: any = null;
if(userStr){
const parsed = JSON.parse(userStr);
 Organisation_ID = parsed.organisation_id?(parsed.organisation_id):(null);
}
 


export default function organisationManagement() {

    const { token } = useAuth();
    const { setNavbarData } = useNavbar();
    const [organisations, setOrganisations] = useState<Organisation[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingOrganisation, setEditingOrganisation] = useState<Organisation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState(null)
    const [filters, setFilters] = useState<OrganisationFilters>({
        organisation_id: Organisation_ID,
        offset: 0,
        limit: 10,

    });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; busId: string | null }>({
        open: false,
        busId: null,
    });

    useEffect(() => {
        setNavbarData('Organisation Management', 'Organisation Management / Organisation List');

        fetchOrganisations(filters)
    }, []);
    const fetchOrganisations = async (filterData: any) => {
        if (!token) return;
        try {

            // Call with filter
            setLoading(true)
            const data = await apiService.getOrganisationsWithFilters(token, null, filterData);
            const busesArray = data || [];
            setOrganisations(busesArray.data);
        //    console.log('Company Details Data:', busesArray);
        } catch (err: any) {
            console.error('Company to fetch bus', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }

    }
    const handleAdd = () => {
        setEditingOrganisation(null);
        setShowForm(true);
    };

    const handleEdit = (organisation: Organisation) => {
       // console.log(organisation)
        setEditingOrganisation(organisation);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        setDeleteDialog({ open: true, busId: id });
    };
    const handleItemView = (bus: any) => {
       // console.log(bus)
           router.push('/organisation/view?id=' + bus.id)
       // setSelectedItem(bus);
    };

    const confirmDelete = async () => {
        if (deleteDialog.busId) {
            // setcompanies((prev) => prev.filter((bus) => bus.id !== deleteDialog.busId));
            if (!token) return;
            try {
                const createRespone = await apiService.deleteOrganisation(token, deleteDialog.busId);
             //   console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchOrganisations(filters)
                }


            } catch (err: any) {
                console.log(err.message);
                setError(err.message);
            } finally {

            }
        }
        setDeleteDialog({ open: false, busId: null });
    };

    const handleFormSubmit = async (data: Organisation) => {
        if (editingOrganisation) {

            if (!token) return;
            try {
                const createRespone = await apiService.updateOrganisation(token, data);
               // console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchOrganisations(filters)
                }


            } catch (err: any) {
                console.log(err.message);
                setError(err.message);
            } finally {

            }
            setShowForm(false);
        } else {
            if (!token) return;
            try {
                setError("");
              //  console.log(data)
                const createRespone = await apiService.createOrganisation(token, data);
               // console.log(createRespone)
                if (createRespone.success) {
                    setShowForm(false);
                    fetchOrganisations(filters)
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
                        <OrganisationForm
                            organisation_id={Organisation_ID}
                            initialData={editingOrganisation ? {
                                registration_number: editingOrganisation.registration_number,
                                name: editingOrganisation.name,
                                email: editingOrganisation.email,
                                phone: editingOrganisation.phone,
                                address: editingOrganisation.address,
                                city: editingOrganisation.city,
                                province: editingOrganisation.province,
                                code: editingOrganisation.code,
                                id: editingOrganisation.id,
                            } : null}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setShowForm(false)}
                        />

                    ) : (
                        <OrganisationTable organisations={organisations} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} onView={handleItemView} />
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
