'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CreateShipmentModal } from '@/components/shipments/CreateShipmentModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-900">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area (offset left by sidebar width) */}
      <div className="flex-1 flex flex-col min-w-0 ml-20 lg:ml-68 transition-all duration-300">
        {/* Sticky Header */}
        <Header onOpenCreateShipment={() => setIsCreateModalOpen(true)} />

        {/* Page Body */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Create Shipment Modal */}
      <CreateShipmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
