import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ConversationsTableSkeleton from '@/components/skeleton/ConversationsTableSkeleton';
import { fetchConversations } from '@/redux/actions/whatsappActions';
import { RootState, AppDispatch } from '@/redux/store';
import { WhatsAppConversation } from '@/redux/types';

const ConversationsTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, loading, error } = useSelector((state: RootState) => state.whatsapp);
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'open' | 'resolved'>('all');
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const itemsPerPage = 100;

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [activeSubTab, fromDate, toDate]);

  const filteredConversations = conversations.filter((conv: WhatsAppConversation) => {
    if (activeSubTab === 'all') return true;
    if (activeSubTab === 'open') return conv.status === 'open' || conv.status === 'awaiting';
    if (activeSubTab === 'resolved') return conv.status === 'resolve';
    return true;
  }).filter((conv) => {
    const convDate = new Date(conv.last_message_at);
    if (fromDate && convDate < new Date(fromDate)) return false;
    if (toDate && convDate > new Date(toDate + 'T23:59:59')) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredConversations.length / itemsPerPage);
  const paginatedConversations = filteredConversations.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const allCount = conversations.length;
  const openCount = conversations.filter(conv => conv.status === 'open' || conv.status === 'awaiting').length;
  const resolvedCount = conversations.filter(conv => conv.status === 'resolve').length;


  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-light mb-4">Conversations</h2>
      <div className="flex gap-4 mb-4">
        <div className="flex flex-col">
          <Label htmlFor="from-date">From Date</Label>
          <Input id="from-date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="to-date">To Date</Label>
          <Input id="to-date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>
      <Tabs value={activeSubTab} onValueChange={(value) => setActiveSubTab(value as 'all' | 'open' | 'resolved')} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All ({allCount})</TabsTrigger>
          <TabsTrigger value="open">Open ({openCount})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedCount})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <ConversationsTable conversations={paginatedConversations} loading={loading} error={error} />
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={page === 1 ? undefined : () => setPage(Math.max(1, page - 1))} className={page === 1 ? "opacity-50" : ""} />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext onClick={page === totalPages || loading ? undefined : () => setPage(Math.min(totalPages, page + 1))} className={page === totalPages || loading ? "opacity-50" : ""} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TabsContent>
        <TabsContent value="open" className="mt-4">
          <ConversationsTable conversations={paginatedConversations} loading={loading} error={error} />
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={page === 1 ? undefined : () => setPage(Math.max(1, page - 1))} className={page === 1 ? "opacity-50" : ""} />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext onClick={page === totalPages || loading ? undefined : () => setPage(Math.min(totalPages, page + 1))} className={page === totalPages || loading ? "opacity-50" : ""} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TabsContent>
        <TabsContent value="resolved" className="mt-4">
          <ConversationsTable conversations={paginatedConversations} loading={loading} error={error} />
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={page === 1 ? undefined : () => setPage(Math.max(1, page - 1))} className={page === 1 ? "opacity-50" : ""} />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext onClick={page === totalPages || loading ? undefined : () => setPage(Math.min(totalPages, page + 1))} className={page === totalPages || loading ? "opacity-50" : ""} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ConversationsTable: React.FC<{ conversations: WhatsAppConversation[]; loading: boolean; error: string | null }> = ({ conversations, loading, error }) => {
  if (loading && conversations.length === 0) {
    return <ConversationsTableSkeleton />;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  if (conversations.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead>Last Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Last Activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">No conversations found.</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contact</TableHead>
          <TableHead>Last Message</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Last Activity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {conversations.map((conv) => (
          <TableRow key={conv.id}>
            <TableCell>
              {`${conv.contact.name || ''} ${conv.contact.lastname || ''}`.trim() || conv.contact.phone_e164}
            </TableCell>
            <TableCell>
              {conv.status === 'resolve' ? (conv.resolution_code + (conv.resolution_summary ? ' : ' + conv.resolution_summary : '')) : (conv.last_message ? conv.last_message.body : 'No messages')}
            </TableCell>
            <TableCell>
              <Badge variant={conv.status === 'open' ? 'default' : conv.status === 'resolve' ? 'secondary' : 'outline'}>
                {conv.status === 'resolve' ? 'resolved' : conv.status}
              </Badge>
            </TableCell>
            <TableCell>{conv.department_name}</TableCell>
            <TableCell>{conv.assigned_to_name}</TableCell>
            <TableCell>{new Date(conv.last_message_at).toLocaleString('en-IN')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ConversationsTab;