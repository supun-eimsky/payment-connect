'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { Ticket as AllTicket } from '@/types';

import { FixedColumnTable } from "@/components/fixed-column-table"
import { useNavbar } from "@/context/navbar-context"
import { Ticket, DollarSign, CreditCard, Wallet, ChevronLeft, ChevronRight } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { DataPagination } from "@/components/pagination/DataPagination";
import { PageHeaderFilter } from '@/components/page-header-filter';
import { FilterField, FilterValues, DynamicFilterProps } from '@/types';
////set Organisation_ID
const userStr = localStorage.getItem("user")
let Organisation_ID: any = null;
let COMPANY_ID: any = null;
let role: any = null;
if (userStr) {
  const parsed = JSON.parse(userStr);
  Organisation_ID = parsed.organisation_id ? (parsed.organisation_id) : (null);
  COMPANY_ID = parsed.company_id ? (parsed.company_id) : (null)
  role = parsed.user_type ? (parsed.user_type) : (null)
}
export default function DashboardPage() {
  const [allTickets, setAllTickets] = useState<AllTicket[] | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [previousCursor, setPreviousCursor] = useState<string | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);

  const [routeList, setRouteList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const { token } = useAuth();
  const { setNavbarData } = useNavbar();
  const [filters, setFilters] = useState<any>({
    company_id: COMPANY_ID,
    organisation_id: Organisation_ID,
    limt: 10
  });
  let filterFieldsPageHeader: FilterField[] = [

    {
      key: 'route_id',
      label: 'Route',
      type: 'select',
      options: routeList,
    },
    {
      key: 'payment_method',
      label: 'Payment Method',
      type: 'select',
      options: [
        {
          name: "Cash",
          id: "cash"
        },
        {
          name: "Card",
          id: "card"
        },

      ],
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        {
          name: "Issued",
          id: "issued"
        },
        {
          name: "Cancelled",
          id: "cancelled"
        },
        {
          name: "Refunded",
          id: "refunded"
        }

      ],
    },
  ];
  if (!COMPANY_ID && role !== "organisation_admin") {
    const new_add: FilterField = {
      key: 'company_id',
      label: 'Company',
      type: 'select',
      options: companies,
    };
    filterFieldsPageHeader = [new_add, ...filterFieldsPageHeader];
    // console.log("Fetching all routes", filterFieldsPageHeader)
  }

  useEffect(() => {
    setNavbarData("Issued Tickets", "Issued Tickets / Tickets");
    if (role === "organisation_admin") {

    } else {
      fetchStats(filters, null);
    }
    //fetchStats(filters, null);
    fetchCompanies({
      "organisation_id": Organisation_ID,
      limit: 100
    })
    if (COMPANY_ID) {

      getRouteCompany({
        "company_id": COMPANY_ID,
        limit: 100
      })
    } else {


      fetchRoute({
        limit: 100,
        organisation_id: Organisation_ID
      })
    }
  }, [token, setNavbarData]);

  const fetchStats = async (filtersData: any, cursor?: string | null) => {
    if (!token) return;

    setLoading(true);
    try {
      const data = await apiService.getTicketDetails(token, cursor, filtersData);
      setAllTickets(data.data);
      setHasMore(data.has_more);
      setNextCursor(data.next_cursor ?? null);
      setPreviousCursor(data.previous_cursor ?? null);
      // console.log('Ticket Details Data:', data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async (filterData: any) => {
    if (!token) return;
    try {

      // Call with filter
      setLoading(true)
      const data = await apiService.getCompaniesWithFilters(token, null, filterData);
      const companiesArray = data || [];
      setCompanies(companiesArray.data)
      if (role === "organisation_admin") {
        console.log("Fetching all routes for organisation admin", companies)
        filters.company_id = companiesArray.data && companiesArray.data.length > 0 ? companiesArray.data[0].id : "";
        fetchStats(filters, null);
      }

      //  setcompanies(busesArray.data);
      //console.log('Company Details Data:', companiesArray);
    } catch (err: any) {
      console.error('Company to fetch bus', err);
      // setError(err.message);
    } finally {
      setLoading(false);
    }

  }
  const fetchRoute = async (filterData: any) => {
    if (!token) return;
    try {

      // Call with filter
      //    setLoading(true)
      const data = await apiService.getRouteWithFilters(token, null, filterData);
      const busesArray = data.routes;
      // console.log('Route  d:', busesArray);
      setRouteList(busesArray)
      return
      //  console.log('Route  dsssssss:', busesArray);
    } catch (err) {
      console.error('Route  d', err);
    } finally {
      // setLoading(false);
    }

  }
  const getRouteCompany = async (filterData: any) => {
    if (!token) return;
    try {

      // Call with filter
      //    setLoading(true)
      const data = await apiService.getRouteCompany(token, filterData.company_id);
      const busesArray = data.routes;
      setRouteList(busesArray)
      return
      // console.log('Route  dsssssss:', busesArray);
    } catch (err) {
      console.error('Route  d', err);
    } finally {
      // setLoading(false);
    }
  }
  // useEffect(() => {

  //   fetchCompanies({
  //     "organisation_id": Organisation_ID
  //   })

  // }, [token]);
  // Handle next page
  const handleNext = () => {
    // console.log('Next cursor:', nextCursor);
    if (hasMore && nextCursor) {
      fetchStats(filters, nextCursor);
    }
  };

  // Handle previous page
  const handlePrevious = () => {
    if (previousCursor != "") {

      fetchStats(filters, previousCursor);
    }
  };


  const handleFilterValuesRest = async (data: FilterValues) => {
    //  console.log(data)

    location.reload()

  }

  const handleFilterValues = async (data: FilterValues) => {
    //console.log(data)
    const merged = { ...filters, ...data };
    setFilters(merged);
    fetchStats(merged, null);

  }
  const OnChangeFilterValues = async (data: any) => {
    //console.log(data)
    if (data.company_id) {
      getRouteCompany({
        "company_id": data.company_id,
        limit: 100
      })
    }


  }
  const setSelectedCompanyId = async (data: any) => {
    console.log("Selected Company ID:", data);
    setSelectedCompany(data)
    const merged = { ...filters, company_id: data };
    setFilters(merged);
    fetchStats(merged, null);
  }



  return (
    <div>

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-5">
            <div className="px-1 lg:px-3">
              <PageHeaderFilter
                isOpen={true}
                onClose={() => setIsFilterOpen(false)}
                fields={filterFieldsPageHeader.length > 0 ? filterFieldsPageHeader : []}
                values={filterValues}
                onApply={handleFilterValues}
                onReset={handleFilterValuesRest}
                onChange={OnChangeFilterValues}
              />

            </div>

            <div className="px-1 lg:px-3">
              {allTickets && !loading ? (<FixedColumnTable data={allTickets} companyList={companies} selectedCompy={selectedCompany} onSelecteCompny={setSelectedCompanyId} />) : (<></>)}
            </div>
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



          </div>
        </div>
      </div>
    </div>
  );
}