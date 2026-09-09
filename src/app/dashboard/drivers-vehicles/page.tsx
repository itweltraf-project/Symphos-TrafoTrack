'use client';

import React, { useState } from 'react';
import { useShipments } from '@/context/ShipmentContext';
import { useAuth } from '@/context/AuthContext';
import { Users, Truck, Search, Phone, ShieldCheck, UserCheck, AlertCircle, Plus, Pencil, Trash2 } from 'lucide-react';
import { Driver, Vehicle } from '@/types';
import { DriverModal } from '@/components/modals/DriverModal';
import { VehicleModal } from '@/components/modals/VehicleModal';

export default function DriversVehiclesPage() {
  const { drivers, vehicles, vendors, deleteDriver, deleteVehicle, shipments } = useShipments();
  const { isVendor, currentVendor, isSuperAdmin, isMarketing } = useAuth();
  const [activeTab, setActiveTab] = useState<'drivers' | 'vehicles'>('drivers');
  const [search, setSearch] = useState('');

  // Modals state
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const canManage = isSuperAdmin || isMarketing;

  // Filter if vendor role
  const visibleDrivers = isVendor && currentVendor
    ? drivers.filter((d) => d.vendorId === currentVendor.id)
    : drivers;

  const visibleVehicles = isVendor && currentVendor
    ? vehicles.filter((v) => v.vendorId === currentVendor.id)
    : vehicles;

  const filteredDrivers = visibleDrivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.simNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search)
  );

  const filteredVehicles = visibleVehicles.filter(
    (v) =>
      v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteDriver = (driver: Driver) => {
    const isAssigned = shipments.some(
      (s) => (s.driverId === driver.id || s.driver?.id === driver.id) && s.currentStatus !== 'COMPLETED'
    );
    if (isAssigned) {
      alert(`Pengemudi ${driver.name} sedang bertugas pada shipment aktif dan tidak dapat dihapus!`);
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus data pengemudi "${driver.name}"?`)) {
      deleteDriver(driver.id);
    }
  };

  const handleDeleteVehicle = (veh: Vehicle) => {
    const isAssigned = shipments.some(
      (s) => (s.vehicleId === veh.id || s.vehicle?.id === veh.id) && s.currentStatus !== 'COMPLETED'
    );
    if (isAssigned) {
      alert(`Armada truk ${veh.plateNumber} sedang beroperasi pada shipment aktif dan tidak dapat dihapus!`);
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus data armada truk "${veh.plateNumber}" (${veh.model})?`)) {
      deleteVehicle(veh.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            Manajemen Pengemudi & Armada Angkut Berat
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Database pengemudi bersertifikasi SIM BII Umum dan armada Tronton Lowbed, Multi-Axle, serta Trailer Flatbed.
          </p>
        </div>

        {canManage && (
          <div>
            {activeTab === 'drivers' ? (
              <button
                onClick={() => {
                  setSelectedDriver(null);
                  setIsDriverModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pengemudi Baru</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedVehicle(null);
                  setIsVehicleModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Armada Truk</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabs & Search */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('drivers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'drivers'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Daftar Pengemudi (Driver)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700">
              {visibleDrivers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vehicles'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Daftar Kendaraan & Truk</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700">
              {visibleVehicles.length}
            </span>
          </button>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeTab === 'drivers' ? 'Cari nama driver, no SIM...' : 'Cari nomor polisi, tipe truk...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Drivers Tab */}
      {activeTab === 'drivers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrivers.map((driver) => {
            const vendor = vendors.find((v) => v.id === driver.vendorId);

            return (
              <div key={driver.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 relative group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-700 text-sm">
                      {driver.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{driver.name}</h3>
                      <div className="text-[11px] text-slate-500 font-semibold">{vendor?.name.split('PT ')[1] || vendor?.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        driver.status === 'On Duty'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {driver.status}
                    </span>

                    {canManage && (
                      <div className="flex items-center gap-1 ml-1 border-l border-slate-200 pl-1.5">
                        <button
                          onClick={() => {
                            setSelectedDriver(driver);
                            setIsDriverModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit Pengemudi"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDriver(driver)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus Pengemudi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lisensi SIM:</span>
                    <span className="font-bold text-slate-800">{driver.simType} ({driver.simNumber})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nomor Telepon:</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {driver.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kontak Darurat:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">{driver.emergencyContact}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vehicles Tab */}
      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((veh) => {
            const vendor = vendors.find((v) => v.id === veh.vendorId);

            return (
              <div key={veh.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 relative group">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{veh.brand}</span>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{veh.plateNumber}</h3>
                    <div className="text-xs text-slate-600 font-semibold">{veh.model}</div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                        veh.status === 'In Transit'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {veh.status}
                    </span>

                    {canManage && (
                      <div className="flex items-center gap-1 ml-1 border-l border-slate-200 pl-1.5">
                        <button
                          onClick={() => {
                            setSelectedVehicle(veh);
                            setIsVehicleModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit Armada Truk"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(veh)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus Armada Truk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kategori Armada:</span>
                    <span className="font-bold text-slate-800">{veh.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kapasitas Angkut:</span>
                    <span className="font-bold text-blue-600">{veh.capacityTons} Ton</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dimensi Trailer:</span>
                    <span className="font-semibold text-slate-800">{veh.dimensions.length}m x {veh.dimensions.width}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GPS Tracker ID:</span>
                    <span className="font-mono font-bold text-slate-700">{veh.gpsId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mitra Vendor:</span>
                    <span className="font-semibold text-slate-800">{vendor?.name.split('PT ')[1] || vendor?.name}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <DriverModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        driverToEdit={selectedDriver}
      />

      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        vehicleToEdit={selectedVehicle}
      />
    </div>
  );
}
