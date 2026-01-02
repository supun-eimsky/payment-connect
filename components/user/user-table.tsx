'use client';

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

import { Card, CardHeader, CardTitle, CardContent, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Settings2, SlidersHorizontal, EyeIcon, Filter } from 'lucide-react';
import { User, UserTableProps } from '@/types/user';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DataPagination } from "@/components/pagination/DataPagination";
const COLUMNS = [
    // { key: "company", label: "company_id", defaultVisible: true },
    // { key: "fleet_number", label: "Fleet Number", defaultVisible: true },
    { key: "user_type", label: "User type", defaultVisible: true,test_align:"" },
    { key: "email", label: "Email", defaultVisible: true },
    { key: "status", label: "Status", defaultVisible: true },

    { key: "phone", label: "Phone", defaultVisible: true },
    { key: "first_name", label: "First Name", defaultVisible: true },
    { key: "last_name", label: "Last Name", defaultVisible: true },

    { key: "national_id", label: "National Id", defaultVisible: true },
    { key: "license_number", label: "License Number", defaultVisible: true },
    { key: "action", label: "Action", defaultVisible: true,test_align:"center" }


]
const renderCell = (row: User, columnKey: string, onEdit: any, onDelete: any, onView: any) => {
    switch (columnKey) {
        case "company_id":
            return row.company_id
        case "user_type":
            return row.user_type
        case "email":
            return row.email
        case "phone":
            return row.phone
        case "first_name":
            return row.first_name
        case "last_name":
            return row.last_name
        case "national_id":
            return row.national_id
        case "license_number":
            return row.license_number
        case "status":
            return (row.status === "active" ? <Badge className="bg-[#E6F6E9] text-[#16A34A] capitalize">{row.status}</Badge> : <Badge className="bg-[#F28603] text-[#ffffff] capitalize">{row.status}</Badge>)
        case "action":
            return (
                 <div className="flex justify-start gap-3">
                  
                    <Button  className="bg-[#F28603] rounded-[49px] w-[33px] h-[33px] hover:text-red-700 hover:bg-red-800" variant="ghost" size="icon" onClick={() => onEdit(row)}>
                        <img src="/icons/Edit.svg"></img>
                    </Button>
                    <Button className="bg-[#F5C300EB] rounded-[49px] w-[33px] h-[33px] hover:text-red-700 hover:bg-red-800" variant="ghost" size="icon" onClick={() => onView(row)}>
                        <img src="/icons/view_icon.svg"></img>
                    </Button>
                    
                    <div >
                         <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(row.id)}
                        className="bg-[#FF0000] rounded-[49px] w-[33px] h-[33px] hover:text-red-700 hover:bg-red-800 "
                    >
                         <img src="/icons/trash.svg"></img>
                    </Button>
                    </div>
                   
                </div>
            );

        default:
            return ""
    }
}

export default function UserTable({ users, onAdd, onEdit, onDelete, onView, pagination, companiesList, onFilter,onFilterMain }: any) {
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
        COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: col.defaultVisible }), {}),
    )
    const [visibleColumns2, setVisibleColumns2] = useState<Record<string, boolean>>(
        COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: col.defaultVisible }), {}),
    )
    const [visibleCompany, setVisibleCompany] = useState<any>(null);
    const [visibleUserType, setVisibleUserType] = useState<any>(null);
    const [userList, setUserList] = useState([
        {
            lable: "Driver",
            vlues: "driver"
        },
        {
            lable: "Conductor",
            vlues: "conductor"
        },
        {
            lable: "Company Admin",
            vlues: "company_admin"
        },
        {
            lable: "Organisation Admin",
            vlues: "organisation_admin"
        }

    ]);



    const toggleColumn = (columnKey: string) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [columnKey]: !prev[columnKey],
        }))
    }
    const toggleCompanyFilter = (type: string) => {
        console.log(type)
        setVisibleCompany(type)


        if (visibleCompany == type) {

            console.log("tatatataat")
            setVisibleCompany(null)
            onFilter(
                {
                    company_id: null
                }
            )
        } else {
            console.log("vbvbvbvbvbv")
            onFilter(
                {
                    company_id: type
                }
            )

        }

    }
    const toggleUserTypeFilter = (type: string) => {
        setVisibleUserType(type)
        if (visibleUserType == type) {
            console.log("tatatataat")
            setVisibleUserType(null)
            onFilter(
                {
                    user_type: null
                }
            )
        } else {
            console.log("vbvbvbvbvbv")
            onFilter(
                {
                    user_type: type
                }
            )

        }


    }
    return (
        <>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">User List</CardTitle>
                    <CardAction>
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="lg" className="gap-2 bg-transparent rounded-[14px]">
                                        <Settings2 className="h-4 w-4" />
                                        Customize Columns
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Show/Hide Columns</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {COLUMNS.map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.key}
                                            checked={visibleColumns[column.key]}
                                            onCheckedChange={() => toggleColumn(column.key)}
                                        >
                                            {column.label}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {/* <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="lg" className="gap-2 bg-transparent rounded-[14px]">
                                        <Filter className="h-4 w-4" />
                                        Filter by Company
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Show/Hide Columns</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {companiesList.map((type: any) => (
                                        <DropdownMenuCheckboxItem
                                            key={type.id}
                                            checked={type.id == visibleCompany ? (true) : (false)}
                                            onCheckedChange={() => toggleCompanyFilter(type.id)}
                                        >
                                            {type.name}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="lg" className="gap-2 bg-transparent rounded-[14px]">
                                        <Filter className="h-4 w-4" />
                                        Filter by User Type
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Show/Hide Columns</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {userList.map((type: any) => (
                                        <DropdownMenuCheckboxItem
                                            key={type.vlues}
                                            checked={type.vlues == visibleUserType ? (true) : (false)}
                                            onCheckedChange={() => toggleUserTypeFilter(type.vlues)}
                                        >
                                            {type.lable}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu> */}
                            <Button
                                className="
                                        flex items-center gap-2 
                                        text-white font-medium
                                        rounded-[14px]
                                        px-5 py-2
                                        bg-gradient-to-r from-[#0F90EE] to-[#276CCC]
                                        hover:opacity-90
                                        shadow-md
                                    "
                                      onClick={onFilterMain}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters
                            </Button>
                            <Button
                                onClick={onAdd}

                                className="flex items-center gap-2 text-white font-medium rounded-[14px] px-5 py-2 bg-gradient-to-r from-[#0F90EE] to-[#276CCC] hover:opacity-90 shadow-md"
                            >
                                <Plus className="w-4 h-4" />
                                Add User
                            </Button>

                        </div>
                    </CardAction>
                </div>
            </CardHeader>
            <CardContent className="px-0">
                {users.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No buses added yet. Click "Add New Bus" to get started.
                    </div>
                ) : (
                    <div className="w-full  border bg-white dark:bg-slate-950">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted sticky top-0 z-10">
                                    <TableRow>
                                        {/* Fixed Column */}

                                        {COLUMNS.map(
                                            (column) =>
                                                visibleColumns[column.key] && (
                                                    <TableHead key={column.key} className={`min-w-32 text-${column.test_align} text-[15px] font-semibold`}>
                                                        {column.label}
                                                    </TableHead>
                                                ),
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((row: any) => (
                                        <TableRow key={row.id} className="hover:bg-muted/50">
                                            {/* Fixed Column */}

                                            {COLUMNS.map(
                                                (column) =>
                                                    visibleColumns[column.key] && (
                                                        <TableCell key={column.key} className="min-w-32 text-[15px] font-normal text-[#71747D]">
                                                            {renderCell(row, column.key, onEdit, onDelete, onView)}
                                                        </TableCell>

                                                    ),

                                            )}

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>


                        </div>
                    </div>
                )}
            </CardContent>
        </>

    );
}
