'use client';

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

import { Card, CardHeader, CardTitle, CardContent, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Settings2,SlidersHorizontal,EyeIcon } from 'lucide-react';
import { Bus, BusTableProps } from '@/types/bus-management';
import { Company, CompanyTableProps } from '@/types/company';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const COLUMNS = [
    { key: "name", label: "Name", defaultVisible: true },
    { key: "registration_number", label: "Registration Number", defaultVisible: true },
    // { key: "fleet_number", label: "Fleet Number", defaultVisible: true },
    { key: "status", label: "Status", defaultVisible: true },
    
    { key: "email", label: "Email", defaultVisible: true },

    { key: "phone", label: "Phone", defaultVisible: true },
    
    { key: "address", label: "Address", defaultVisible: true },
    { key: "city", label: "City", defaultVisible: true },
    { key: "province", label: "Province", defaultVisible: true },
    { key: "action", label: "Action", defaultVisible: true }


]
const renderCell = (row: Company, columnKey: string, onEdit: any, onDelete: any, onView:any) => {
    switch (columnKey) {
        case "registration_number":
            return row.registration_number
        case "name":
            return row.name
        case "email":
            return row.email
        case "phone":
            return row.phone
        case "address":
            return row.address
        case "city":
            return row.city
        case "province":
            return row.province
        case "status":
            return    <Badge className="bg-[#E6F6E9] text-[#16A34A] capitalize">{row.status}</Badge>
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
export default function CompanyTable({ companies, onAdd, onEdit, onDelete,onView }: CompanyTableProps) {
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
        COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: col.defaultVisible }), {}),
    )

    const toggleColumn = (columnKey: string) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [columnKey]: !prev[columnKey],
        }))
    }
    return (
        <div className="px-1 lg:px-3">
            <Card className='py-[15px]'>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Company List</CardTitle>
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
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filters
                                </Button>
                                <Button
                                    onClick={onAdd}
                                    
                                    className="flex items-center gap-2 text-white font-medium rounded-[14px] px-5 py-2 bg-gradient-to-r from-[#0F90EE] to-[#276CCC] hover:opacity-90 shadow-md"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Company
                                </Button>
                               
                            </div>
                        </CardAction>
                    </div>
                </CardHeader>
                <CardContent className="px-0" >
                    {companies.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No buses added yet. Click "Add New Bus" to get started.
                        </div>
                    ) : (
                        <div className="w-full border bg-white dark:bg-slate-950">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted sticky top-0 z-10">
                                        <TableRow>
                                            {/* Fixed Column */}

                                            {COLUMNS.map(
                                                (column) =>
                                                    visibleColumns[column.key] && (
                                                        <TableHead key={column.key} className="min-w-32 text-[15px] font-semibold">
                                                            {column.label}
                                                        </TableHead>
                                                    ),
                                            )}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {companies.map((row) => (
                                            <TableRow key={row.id} className="hover:bg-muted/50">
                                                {/* Fixed Column */}

                                                {COLUMNS.map(
                                                    (column) =>
                                                        visibleColumns[column.key] && (
                                                            <TableCell key={column.key} className="min-w-32 text-[15px] font-normal text-[#71747D]">
                                                                {renderCell(row, column.key, onEdit, onDelete,onView)}
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
            </Card>
        </div>
    );
}
