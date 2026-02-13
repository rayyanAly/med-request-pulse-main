import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments, fetchAgents } from '@/redux/actions/whatsappActions';
import { RootState, AppDispatch } from '@/redux/store';
import ConversationsTab from '@/components/whatsapp/ConversationsTab';
import DepartmentsTab from '@/components/whatsapp/DepartmentsTab';
import AgentsTab from '@/components/whatsapp/AgentsTab';
import CustomersTab from '@/components/whatsapp/CustomersTab';

const WhatsAppDetail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { departments, agents } = useSelector((state: RootState) => state.whatsapp);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('whatsappActiveTab') || 'conversations');

  useEffect(() => {
    localStorage.setItem('whatsappActiveTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (departments.length === 0) {
      dispatch(fetchDepartments());
    }
    if (agents.length === 0) {
      dispatch(fetchAgents());
    }
  }, [dispatch, departments.length, agents.length]);

  return (
    <div className="p-6 -mt-5">
      <h1 className="text-3xl font-light mb-4">WhatsApp Detail</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="conversations" className="mt-4">
          <ConversationsTab />
        </TabsContent>
        <TabsContent value="departments" className="mt-4">
          <DepartmentsTab />
        </TabsContent>
        <TabsContent value="agents" className="mt-4">
          <AgentsTab />
        </TabsContent>
        <TabsContent value="customers" className="mt-4">
          <CustomersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};


export default WhatsAppDetail;