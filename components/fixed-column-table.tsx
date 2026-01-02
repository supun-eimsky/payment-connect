"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings2, Filter, SlidersHorizontal, Armchair, CheckCircle, Clock, XCircle } from "lucide-react"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface TableData {
    id: string,
    session_id: string,
    ticket_number: string,
    boarding_stop_id: string,
    alighting_stop_id: string,
    ticket_type: string,
    fare_amount: number,
    payment_method: string,
    issued_at: string,
    status: string,
    created_at: string,
    route_id: string,
    route_code: string,
    route_name: string,
    direction_id: string,
    direction_start_location: string,
    direction_end_location: string,
    boarding_stop_name: string,
    alighting_stop_name: string,
    driver_id: string,
    driver_first_name: string,
    driver_last_name: string,
    conductor_id: string,
    conductor_first_name: string,
    conductor_last_name: string,
    bus_id: string,
    bus_registration_number: string,
    trip_id: string,
    session_number: number,
    card_payment_details: any;
}



const COLUMNS = [
    { key: "route_name", label: "Route Name", defaultVisible: true },
    { key: "direction_start_location", label: "Direction Start Location", defaultVisible: true },
    { key: "direction_end_location", label: "Direction End Location", defaultVisible: true },
    { key: "fare_amount", label: "Fare Amount (Rs)", defaultVisible: true },

    { key: "payment_method", label: "Payment Method", defaultVisible: true },
    { key: "card_number", label: "Card Number", defaultVisible: true },
    { key: "ticket_type", label: "Ticket Type", defaultVisible: true },

    { key: "status", label: "Status", defaultVisible: true },
    { key: "issued_at", label: "Issued At", defaultVisible: true },


    { key: "session_id", label: "Session ID", defaultVisible: true },
    { key: "boarding_stop_id", label: "Boarding Stop ID", defaultVisible: true },
    { key: "alighting_stop_id", label: "Alighting Stop ID", defaultVisible: true },

    { key: "created_at", label: "Created At", defaultVisible: true },
    { key: "route_id", label: "Route ID", defaultVisible: true },
    { key: "route_code", label: "Route Code", defaultVisible: true },

    { key: "direction_id", label: "Direction ID", defaultVisible: true },
    { key: "boarding_stop_name", label: "Boarding Stop Name", defaultVisible: true },
    { key: "alighting_stop_name", label: "Alighting Stop Name", defaultVisible: true },
    { key: "driver_id", label: "Driver ID", defaultVisible: true },
    { key: "driver_first_name", label: "Driver First Name", defaultVisible: true },
    { key: "driver_last_name", label: "Driver Last Name", defaultVisible: true },
    { key: "conductor_id", label: "Conductor ID", defaultVisible: true },
    { key: "conductor_first_name", label: "Conductor First Name", defaultVisible: true },
    { key: "conductor_last_name", label: "Conductor Last Name", defaultVisible: true },
    { key: "bus_id", label: "Bus ID", defaultVisible: true },
    { key: "bus_registration_number", label: "Bus Registration Number", defaultVisible: true },
    { key: "trip_id", label: "Trip ID", defaultVisible: true },
    { key: "session_number", label: "Session Number", defaultVisible: true },
    { key: "id", label: "ID", defaultVisible: true },


]
const STATUS_OPTIONS = ["issued", "cancelled"]



export function FixedColumnTable({
    data: initialData,
}: {
    data: TableData[]
}) {
    const [data] = useState<TableData[]>(initialData)
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
        COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: col.defaultVisible }), {}),
    )
    const [selectedStatuses, setSelectedStatuses] = useState<Record<string, boolean>>(
        STATUS_OPTIONS.reduce((acc, status) => ({ ...acc, [status]: true }), {}),
    )
    const TICKET_TYPE_OPTIONS = Array.from(new Set(data.map((item) => item.ticket_type)))
    console.log(TICKET_TYPE_OPTIONS, "Password123Password123Password123Password123")
    const [selectedTicketTypes, setSelectedTicketTypes] = useState<Record<string, boolean>>(
        TICKET_TYPE_OPTIONS.reduce((acc, type) => ({ ...acc, [type]: true }), {}),
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case "issued":
                return "capitalize bg-[#E6F6E9] pr-4 pl-4 py-1 rounded-[36px] text-[#16A34A] dark:bg-green-900 dark:text-green-200 text-[15px] font-normal"
            case "Pending":
                return "capitalize bg-[#FEF3C7] pr-4 pl-4 py-1 rounded-[36px] text-[#B45309] dark:bg-yellow-900 dark:text-yellow-200 text-[15px] font-normal"
            case "cancelled":
                return "capitalize bg-red-100 pr-4 pl-4 py-1 rounded-[36px] text-[#71747D] dark:bg-red-900 dark:text-red-200 text-[15px] font-normal"
            default:
                return "capitalize bg-gray-100 pr-4 pl-4 py-1 rounded-[36px] text-[#71747D] dark:bg-gray-900 dark:text-gray-200 text-[15px] font-normal"
        }
    }
    const getPaymentMethodColor = (status: string) => {
        switch (status) {
            case "cash":
                return "capitalize bg-[#F2F2F2] pr-4 pl-4 py-1 rounded-[36px] text-[#71747D] dark:bg-green-900 dark:text-green-200 text-[15px] font-normal"
            case "card":
                return "capitalize bg-[#F2F2F2] pr-4 pl-4 py-1 rounded-[36px] text-[#71747D] dark:bg-yellow-900 dark:text-yellow-200 text-[15px] font-normal"
            case "cancelled":
                return "capitalize bg-red-100 pr-4 pl-4 py-1 rounded-[36px] text-[#71747D] dark:bg-red-900 dark:text-red-200 text-[15px] font-normal"
            default:
                return " bg-gray-100 pr-4 pl-4 py-1 rounded-[36px] text-[#71747D] dark:bg-gray-900 dark:text-gray-200 text-[15px] font-normal"
        }
    }
    const getTicketTypeColor = (status: string) => {
        switch (status) {
            case "half":
                return " capitalize text-[#33ff5c]  text-[15px] font-semibold"
            case "full":
                return "capitalize text-[#FF9533] text-[15px] font-semibold"
            case "cancelled":
                return "capitalize text-[#71747D] text-[15px] font-normal"
            default:
                return "capitalize text-[#71747D] text-[15px] font-normal"
        }
    }

    const toggleColumn = (columnKey: string) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [columnKey]: !prev[columnKey],
        }))
    }
    const toggleStatusFilter = (status: string) => {
        setSelectedStatuses((prev) => ({
            ...prev,
            [status]: !prev[status],
        }))
    }
    const toggleTicketTypeFilter = (type: string) => {
        setSelectedTicketTypes((prev) => ({
            ...prev,
            [type]: !prev[type],
        }))
    }
    const renderCell = (row: TableData, columnKey: string) => {
        switch (columnKey) {
            case "id":
                return row.id
            case "session_id":
                return row.session_id
            case "ticket_number":
                return row.ticket_number
            case "boarding_stop_id": 
                return row.boarding_stop_id
            case "card_number": 
                return row.card_payment_details?.card_number || "N/A"
            case "alighting_stop_id":
                return row.alighting_stop_id
            case "ticket_type":
                return <span className={`${getTicketTypeColor(row.ticket_type)}`}>{row.ticket_type}</span>

            case "payment_method":
                const statusIcons = {
                    cash: <img src="/icons/icon-cash-payment.svg" className="h-4 w-4 text-green-600" />,
                    card: <img src="/icons/icon-card-payment.svg" className="h-4 w-4 text-yellow-600" />,

                }
                return <Badge className={`${getPaymentMethodColor(row.payment_method)}`}>
                    {statusIcons[row.payment_method as keyof typeof statusIcons]}
                    {row.payment_method}
                </Badge>
            case "issued_at":
                return row.issued_at
            case "status":
                return <Badge className={`${getStatusColor(row.status)}`}>{row.status}</Badge>
            case "created_at":
                return row.created_at
            case "route_id":
                return row.route_id
            case "route_code":
                return row.route_code
            case "route_name":
                return row.route_name
            case "direction_id":
                return row.direction_id
            case "direction_start_location":
                return row.direction_start_location
            case "direction_end_location":
                return row.direction_end_location
            case "boarding_stop_name":
                return row.boarding_stop_name
            case "alighting_stop_name":
                return row.alighting_stop_name
            case "driver_id":
                return row.driver_id
            case "driver_first_name":
                return row.driver_first_name
            case "driver_last_name":
                return row.driver_last_name
            case "conductor_id":
                return row.conductor_id
            case "conductor_first_name":
                return row.conductor_first_name
            case "conductor_last_name":
                return row.conductor_last_name
            case "bus_id":
                return row.bus_id
            case "bus_registration_number":
                return row.bus_registration_number
            case "trip_id":
                return row.trip_id
            case "session_number":
                return row.session_number
            case "fare_amount":
                return row.fare_amount
            case "route":
                return row.route_name
            case "date":
                return row.session_id
            default:
                return ""
        }
    }
    const filteredData = data.filter((row) => selectedStatuses[row.status] && selectedTicketTypes[row.ticket_type])
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle className="text-[22px]">Issued Tickets</CardTitle>

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
                        
                       
                        {/* <Button
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
                        </Button> */}
                    </div>
                </CardAction>
            </CardHeader>
            <CardContent className="px-0 pt-0 sm:px-0 sm:pt-1">
                <div className="w-full space-y-4 px-5 pb-4">


                    <div className="w-full rounded-lg border bg-white dark:bg-slate-950">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted sticky top-0 z-10">
                                    <TableRow>
                                        {/* Fixed Column */}
                                        <TableHead className="sticky left-0 z-20 bg-muted w-32 min-w-32 text-[15px] font-semibold">Ticket ID</TableHead>
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
                                    {filteredData.map((row) => (
                                        <TableRow key={row.id} className="hover:bg-muted/50">
                                            {/* Fixed Column */}
                                            <TableCell className="sticky left-0 z-10 bg-white dark:bg-slate-950 text-[15px] font-normal text-[#71747D] w-32 min-w-32">
                                                {row.ticket_number}
                                            </TableCell>
                                            {COLUMNS.map(
                                                (column) =>
                                                    visibleColumns[column.key] && (
                                                        <TableCell key={column.key} className="min-w-32 text-[15px] font-normal text-[#71747D]">
                                                            {renderCell(row, column.key)}
                                                        </TableCell>
                                                    ),
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
