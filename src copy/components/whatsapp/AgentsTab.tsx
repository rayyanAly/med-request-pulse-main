import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AgentsTableSkeleton from '@/components/skeleton/AgentsTableSkeleton';

const AgentsTab: React.FC = () => {
  const { agents, agentsLoading, agentsError, departments } = useSelector((state: RootState) => state.whatsapp);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const departmentMap = useMemo(() => {
    const map: { [key: number]: string } = {};
    departments.forEach((dept: any) => {
      map[dept.id] = dept.name;
    });
    return map;
  }, [departments]);

  const filteredAgents = useMemo(() => {
    let filtered = agents.filter((agent: any) => ![31, 26, 2].includes(agent.id));
    if (selectedDepartment === 'all') return filtered;
    return filtered.filter((agent: any) => agent.department_id?.toString() === selectedDepartment);
  }, [agents, selectedDepartment]);

  if (agentsLoading) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Agents</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm">Filter by Department:</span>
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
        <AgentsTableSkeleton />
      </div>
    );
  }

  if (agentsError) {
    return <div className="p-4 border rounded-lg text-red-500">Error: {agentsError}</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Agents</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm">Filter by Department:</span>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept: any) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Presence</TableHead>
            <TableHead>Open Conversation</TableHead>
            <TableHead>Department</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAgents.map((agent: any) => (
            <TableRow key={agent.id}>
              <TableCell>{agent.id}</TableCell>
              <TableCell>{agent.name}</TableCell>
              <TableCell>
                <Badge variant={agent.presence === 'online' ? 'default' : 'secondary'}>
                  {agent.presence}
                </Badge>
              </TableCell>
              <TableCell>{agent.open_cnt}</TableCell>
              <TableCell>{agent.department_id ? departmentMap[agent.department_id] || 'Unknown' : 'No Department'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AgentsTab;