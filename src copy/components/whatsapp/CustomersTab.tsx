import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchCustomers } from '@/redux/actions/whatsappActions';
import { FETCH_CUSTOMERS_REQUEST, FETCH_CUSTOMERS_SUCCESS, FETCH_CUSTOMERS_FAILURE } from '@/redux/constants/whatsappConstants';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import CustomerOrderDialog from './CustomerOrderDialog';
import { Customer } from '@/redux/types';
import CustomersTableSkeleton from '@/components/skeleton/CustomersTableSkeleton';

const CustomersTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, customersLoading, customersError, allCustomersCache } = useSelector((state: RootState) => state.whatsapp);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'crm'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFetchingAll, setIsFetchingAll] = useState(false);

  // Fetch all customers once when component mounts (only if not cached)
  useEffect(() => {
    if (allCustomersCache.length > 0) return; // Skip if already cached
    
    const fetchAllCustomers = async () => {
      setIsFetchingAll(true);
      try {
        const headers = {
          'X-API-Key': 'your_api_key_here',
          'Content-Type': 'application/json',
        };
        
        // First, get the first page to know total pages
        const firstResponse = await fetch(`/api/external/search-customers?per_page=50&page=1`, { headers });
        if (!firstResponse.ok) throw new Error('Failed to fetch customers');
        const firstData = await firstResponse.json();
        const totalPages = firstData.last_page;
        let allData: any[] = [...firstData.data];
        
        // Fetch all remaining pages in parallel
        if (totalPages > 1) {
          const allPromises = [];
          for (let p = 2; p <= totalPages; p++) {
            allPromises.push(
              fetch(`/api/external/search-customers?per_page=50&page=${p}`, { headers })
                .then(res => res.json())
                .then(data => data.data)
            );
          }
          const allPagesData = await Promise.all(allPromises);
          allPagesData.forEach(pageData => {
            allData = [...allData, ...pageData];
          });
        }
        
        dispatch({ type: 'SET_ALL_CUSTOMERS_CACHE', payload: allData });
        setIsFetchingAll(false);
      } catch (error) {
        console.error('Error fetching all customers:', error);
        setIsFetchingAll(false);
      }
    };
    
    fetchAllCustomers();
  }, []); // Only run once on mount

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Apply local search and pagination on cached data
  useEffect(() => {
    if (allCustomersCache.length === 0) return;
    
    let filtered = allCustomersCache;
    
    // Apply search filter
    if (search) {
      filtered = allCustomersCache.filter(customer => {
        const name = customer.name?.toLowerCase() || '';
        const mobile = customer.mobile?.toLowerCase() || '';
        const email = customer.crm_data?.email?.toLowerCase() || '';
        const firstName = customer.crm_data?.firstname?.toLowerCase() || '';
        const lastName = customer.crm_data?.lastname?.toLowerCase() || '';
        const searchLower = search.toLowerCase();
        
        return name.includes(searchLower) || 
               mobile.includes(searchLower) || 
               email.includes(searchLower) ||
               firstName.includes(searchLower) ||
               lastName.includes(searchLower);
      });
    }
    
    // Apply CRM filter
    if (filter === 'crm') {
      filtered = filtered.filter(c => c.crm_data);
    }
    
    // Paginate
    const paginatedData = filtered.slice((page - 1) * 50, page * 50);
    
    dispatch({ 
      type: FETCH_CUSTOMERS_SUCCESS, 
      payload: {
        current_page: page,
        data: paginatedData,
        first_page_url: '',
        last_page: Math.ceil(filtered.length / 50),
        last_page_url: '',
        links: [],
        next_page_url: page < Math.ceil(filtered.length / 50) ? '' : null,
        path: '',
        per_page: 50,
        prev_page_url: page > 1 ? '' : null,
        to: Math.min(page * 50, filtered.length),
        total: filtered.length,
      } 
    });
  }, [allCustomersCache, search, filter, page, dispatch]);

  // Reset page and clear cache when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  const renderLoadingSkeleton = () => (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-7 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>
      <Skeleton className="h-5 w-48 mb-4" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>CRM Status</TableHead>
            <TableHead>Order Count</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(10)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-28" /></TableCell>
              <TableCell><Skeleton className="h-5 w-40" /></TableCell>
              <TableCell><Skeleton className="h-6 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-8" /></TableCell>
              <TableCell><Skeleton className="h-8 w-28" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );

  const filteredCustomers = customers?.data || [];

  if (isFetchingAll) {
    return renderLoadingSkeleton();
  }

  if (customersError) {
    return <div className="p-4 border rounded-lg text-red-500">Error: {customersError}</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Customers</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Select value={filter} onValueChange={(value: 'all' | 'crm') => setFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="crm">Registered on CRM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {filter === 'crm' ? `Total CRM Customers: ${customers?.total || 0}` : `Total Customers: ${customers?.total || 0}`}
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>CRM Status</TableHead>
            <TableHead>Order Count</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                {search ? `No customers found matching "${search}"` : 'No customers found'}
              </TableCell>
            </TableRow>
          ) : (
            filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name || (customer.crm_data?.firstname && customer.crm_data?.lastname ? customer.crm_data.firstname + ' ' + customer.crm_data.lastname : null) || 'N/A'}</TableCell>
                <TableCell>{customer.mobile}</TableCell>
                <TableCell>{customer.crm_data?.email || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={customer.crm_data ? 'default' : 'secondary'}>
                    {customer.crm_data ? 'Registered' : 'Not Registered'}
                  </Badge>
                </TableCell>
                <TableCell>{customer.crm_data?.order_count || 0}</TableCell>
                <TableCell>
                  {customer.crm_data && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setDialogOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {customers && (
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1 || customersLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {customers.current_page} of {customers.last_page}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === customers.last_page || customersLoading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      <CustomerOrderDialog
        customer={selectedCustomer}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default CustomersTab;