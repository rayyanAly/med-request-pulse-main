import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import DepartmentsTableSkeleton from '@/components/skeleton/DepartmentsTableSkeleton';

const DepartmentsTab: React.FC = () => {
  const { departments, departmentsLoading, departmentsError } = useSelector((state: RootState) => state.whatsapp);

  if (departmentsLoading) {
    return (
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Departments</h2>
        <DepartmentsTableSkeleton />
      </div>
    );
  }

  if (departmentsError) {
    return <div className="p-4 border rounded-lg text-red-500">Error: {departmentsError}</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Departments</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Conversations Count</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Is Default</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept: any) => (
            <TableRow key={dept.id}>
              <TableCell>{dept.name}</TableCell>
              <TableCell>{dept.conversations_count}</TableCell>
              <TableCell>
                <Badge variant={dept.is_active ? 'default' : 'secondary'}>
                  {dept.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>{dept.is_default ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DepartmentsTab;