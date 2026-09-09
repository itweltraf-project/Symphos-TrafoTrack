'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Shipment,
  ExpeditionVendor,
  Customer,
  Transformer,
  Driver,
  Vehicle,
  ShipmentStatus,
  TrackingMilestone,
  ProofOfDelivery,
  PreDeliveryInspection,
  DocumentItem,
  PhotoItem,
  ActivityLogItem,
  NotificationItem,
} from '@/types';
import {
  initialShipments,
  initialVendors,
  initialCustomers,
  initialTransformers,
  initialDrivers,
  initialVehicles,
  initialNotifications,
  initialActivityLogs,
} from '@/lib/dummyData';
import { useAuth } from './AuthContext';

interface ShipmentContextType {
  shipments: Shipment[];
  allShipments: Shipment[]; // Unfiltered for global stats
  vendors: ExpeditionVendor[];
  customers: Customer[];
  transformers: Transformer[];
  drivers: Driver[];
  vehicles: Vehicle[];
  notifications: NotificationItem[];
  activityLogs: ActivityLogItem[];
  
  createShipment: (data: Partial<Shipment>) => string;
  updateStatus: (shipmentId: string, newStatus: ShipmentStatus, notes?: string, location?: string, photoUrl?: string) => void;
  updateLocation: (shipmentId: string, locationData: { city: string; province: string; landmark: string; lat: number; lng: number; speedKmH?: number }) => void;
  assignFleet: (shipmentId: string, driverId: string, vehicleId: string) => void;
  submitInspection: (shipmentId: string, inspection: PreDeliveryInspection) => void;
  submitPod: (shipmentId: string, podData: ProofOfDelivery) => void;
  reportIncident: (shipmentId: string, reason: string, actionTaken: string) => void;
  addPhoto: (shipmentId: string, photo: Omit<PhotoItem, 'id' | 'timestamp'>) => void;
  addDocument: (shipmentId: string, doc: Omit<DocumentItem, 'id' | 'uploadedAt'>) => void;
  addCustomer: (data: Partial<Customer>) => Customer;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  addTransformer: (data: Partial<Transformer>) => Transformer;
  updateTransformer: (id: string, data: Partial<Transformer>) => void;
  deleteTransformer: (id: string) => void;

  addVehicle: (data: Partial<Vehicle>) => Vehicle;
  updateVehicle: (id: string, data: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;

  addDriver: (data: Partial<Driver>) => Driver;
  updateDriver: (id: string, data: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;

  markNotificationRead: (id: string) => void;
  getShipmentById: (id: string) => Shipment | undefined;
  resetToDefaultData: () => void;
}

const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

export function ShipmentProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, isVendor } = useAuth();

  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [vendors, setVendors] = useState<ExpeditionVendor[]>(initialVendors);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [transformers, setTransformers] = useState<Transformer[]>(initialTransformers);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(initialActivityLogs);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedShipments = localStorage.getItem('trafo_shipments');
      if (savedShipments) setShipments(JSON.parse(savedShipments));

      const savedCustomers = localStorage.getItem('trafo_customers');
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers));

      const savedTransformers = localStorage.getItem('trafo_transformers');
      if (savedTransformers) setTransformers(JSON.parse(savedTransformers));

      const savedDrivers = localStorage.getItem('trafo_drivers');
      if (savedDrivers) setDrivers(JSON.parse(savedDrivers));

      const savedVehicles = localStorage.getItem('trafo_vehicles');
      if (savedVehicles) setVehicles(JSON.parse(savedVehicles));

      const savedNotifications = localStorage.getItem('trafo_notifications');
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));

      const savedLogs = localStorage.getItem('trafo_activity_logs');
      if (savedLogs) setActivityLogs(JSON.parse(savedLogs));
    } catch (e) {
      console.error('Error loading stored state:', e);
    }
  }, []);

  // Save changes to localStorage
  const persistShipments = (updated: Shipment[]) => {
    setShipments(updated);
    try {
      localStorage.setItem('trafo_shipments', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving shipments:', e);
    }
  };

  const persistCustomers = (updated: Customer[]) => {
    setCustomers(updated);
    try {
      localStorage.setItem('trafo_customers', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving customers:', e);
    }
  };

  const persistTransformers = (updated: Transformer[]) => {
    setTransformers(updated);
    try {
      localStorage.setItem('trafo_transformers', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving transformers:', e);
    }
  };

  const persistDrivers = (updated: Driver[]) => {
    setDrivers(updated);
    try {
      localStorage.setItem('trafo_drivers', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving drivers:', e);
    }
  };

  const persistVehicles = (updated: Vehicle[]) => {
    setVehicles(updated);
    try {
      localStorage.setItem('trafo_vehicles', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving vehicles:', e);
    }
  };

  const persistNotifications = (updated: NotificationItem[]) => {
    setNotifications(updated);
    try {
      localStorage.setItem('trafo_notifications', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving notifications:', e);
    }
  };

  const persistLogs = (updated: ActivityLogItem[]) => {
    setActivityLogs(updated);
    try {
      localStorage.setItem('trafo_activity_logs', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving logs:', e);
    }
  };

  const addLog = (action: string, details?: string) => {
    const newLog: ActivityLogItem = {
      id: `log-${Date.now()}`,
      user: currentUser.name,
      role: currentUser.role,
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    persistLogs([newLog, ...activityLogs]);
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false,
    };
    persistNotifications([newNotif, ...notifications]);
  };

  // Filter shipments based on user role (Vendors can only see their own assigned shipments!)
  const visibleShipments = isVendor && currentUser.vendorId
    ? shipments.filter((s) => s.vendorId === currentUser.vendorId)
    : shipments;

  const createShipment = (data: Partial<Shipment>): string => {
    const newId = `SHP-2026-${String(shipments.length + 801).padStart(4, '0')}`;
    const selectedVendor = vendors.find((v) => v.id === data.vendorId) || vendors[0];
    const selectedCustomer = customers.find((c) => c.id === data.customerId) || customers[0];
    const selectedTransformer = transformers.find((t) => t.id === data.transformerId) || transformers[0];

    const newShipment: Shipment = {
      id: newId,
      deliveryOrderNo: data.deliveryOrderNo || `DO-2026-${Date.now().toString().slice(-4)}`,
      salesOrderNo: data.salesOrderNo || `SO-2026-${Date.now().toString().slice(-4)}`,
      poNumber: data.poNumber || `PO-INTERNAL-${Date.now().toString().slice(-3)}`,
      transformerId: selectedTransformer.id,
      transformer: selectedTransformer,
      customerId: selectedCustomer.id,
      customer: selectedCustomer,
      vendorId: selectedVendor.id,
      vendor: selectedVendor,
      currentStatus: 'SHIPMENT_CREATED',
      shipmentDate: data.shipmentDate || new Date().toISOString().split('T')[0],
      expectedDeliveryDate: data.expectedDeliveryDate || '2026-09-08 17:00',
      originCity: data.originCity || 'Cikarang Factory',
      originAddress: data.originAddress || 'Pabrik Trafo Heavy Electrical, Delta Silicon 6, Cikarang',
      destinationCity: selectedCustomer.city,
      destinationAddress: selectedCustomer.address,
      currentLocation: {
        city: 'Cikarang Factory',
        province: 'Jawa Barat',
        landmark: 'Factory Loading Yard',
        lat: -6.3121,
        lng: 107.1352,
        lastUpdatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      },
      distanceKm: data.distanceKm || 120,
      remainingKm: data.distanceKm || 120,
      isDelayed: false,
      preDeliveryInspection: {
        bushingCondition: 'Good',
        radiatorCondition: 'Good',
        conservatorCondition: 'Good',
        accessoriesCondition: 'Complete',
        oilLeakage: false,
        rustOrDamage: false,
        overallCondition: 'Good',
        inspectedBy: currentUser.name,
        inspectedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        photos: [],
      },
      trackingHistory: [
        {
          id: `tr-${Date.now()}`,
          step: 1,
          status: 'SHIPMENT_CREATED',
          title: 'Shipment Dibuat & Ditugaskan ke Vendor',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          location: 'Cikarang Factory',
          updatedBy: `${currentUser.name} (${currentUser.role})`,
          role: currentUser.role,
          notes: `Shipment berhasil dibuat dan ditugaskan kepada ${selectedVendor.name}.`,
        },
      ],
      documents: [],
      photos: [],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          user: currentUser.name,
          role: currentUser.role,
          action: `Membuat shipment baru ${newId} untuk trafo ${selectedTransformer.transformerNumber}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        },
      ],
    };

    persistShipments([newShipment, ...shipments]);

    // Send notifications to vendor
    addNotification({
      title: 'Tugas Pengiriman Baru Diterima',
      message: `Shipment ${newId} (${selectedTransformer.transformerNumber}) telah dialokasikan kepada ${selectedVendor.name}.`,
      type: 'info',
      shipmentId: newId,
      vendorId: selectedVendor.id,
    });

    addLog(`Membuat pengiriman baru ${newId}`, `Tujuan: ${selectedCustomer.companyName}, Vendor: ${selectedVendor.name}`);

    return newId;
  };

  const updateStatus = (
    shipmentId: string,
    newStatus: ShipmentStatus,
    notes?: string,
    location?: string,
    photoUrl?: string
  ) => {
    const updated = shipments.map((s) => {
      if (s.id !== shipmentId) return s;

      const stepMapping: Record<ShipmentStatus, number> = {
        SHIPMENT_CREATED: 1,
        WAITING_PICKUP: 2,
        VEHICLE_ASSIGNED: 3,
        DRIVER_ASSIGNED: 4,
        PICKUP: 5,
        LOADED: 6,
        DEPARTED: 7,
        IN_TRANSIT: 8,
        AT_TRANSIT_HUB: 9,
        APPROACHING_DESTINATION: 10,
        ARRIVED: 11,
        UNLOADING: 12,
        DELIVERED: 13,
        POD_UPLOADED: 14,
        COMPLETED: 15,
        DELAYED: 8,
      };

      const newMilestone: TrackingMilestone = {
        id: `tr-${Date.now()}`,
        step: stepMapping[newStatus] || 8,
        status: newStatus,
        title: `Status diperbarui ke ${newStatus.replace(/_/g, ' ')}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        location: location || s.currentLocation.landmark || s.currentLocation.city,
        updatedBy: `${currentUser.name} (${currentUser.role})`,
        role: currentUser.role,
        notes: notes || 'Pembaruan berkala progres pengiriman.',
        photoUrl,
      };

      return {
        ...s,
        previousStatus: s.currentStatus,
        currentStatus: newStatus,
        isDelayed: newStatus === 'DELAYED' ? true : s.isDelayed,
        trackingHistory: [...s.trackingHistory, newMilestone],
      };
    });

    persistShipments(updated);

    addNotification({
      title: `Status Berubah: ${shipmentId}`,
      message: `Status shipment ${shipmentId} kini telah diperbarui ke ${newStatus}.`,
      type: newStatus === 'DELAYED' ? 'delay' : newStatus === 'DELIVERED' || newStatus === 'COMPLETED' ? 'success' : 'info',
      shipmentId,
    });

    addLog(`Memperbarui status ${shipmentId} ke ${newStatus}`, notes);
  };

  const updateLocation = (
    shipmentId: string,
    locationData: { city: string; province: string; landmark: string; lat: number; lng: number; speedKmH?: number }
  ) => {
    const updated = shipments.map((s) => {
      if (s.id !== shipmentId) return s;

      const newMilestone: TrackingMilestone = {
        id: `tr-${Date.now()}`,
        step: 8,
        status: s.currentStatus,
        title: `Pembaruan Posisi: ${locationData.landmark || locationData.city}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        location: `${locationData.city}, ${locationData.province}`,
        coordinates: { lat: locationData.lat, lng: locationData.lng },
        updatedBy: `${currentUser.name} (${currentUser.role})`,
        role: currentUser.role,
        notes: `Kecepatan: ${locationData.speedKmH || 0} km/jam. Posisi GPS terverifikasi.`,
      };

      return {
        ...s,
        currentLocation: {
          ...locationData,
          lastUpdatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
        trackingHistory: [...s.trackingHistory, newMilestone],
      };
    });

    persistShipments(updated);
    addLog(`Memperbarui posisi GPS untuk ${shipmentId}`, `${locationData.landmark}, ${locationData.city}`);
  };

  const assignFleet = (shipmentId: string, driverId: string, vehicleId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);

    const updated = shipments.map((s) => {
      if (s.id !== shipmentId) return s;
      return {
        ...s,
        driverId,
        driver,
        vehicleId,
        vehicle,
        currentStatus: 'VEHICLE_ASSIGNED' as ShipmentStatus,
      };
    });

    persistShipments(updated);

    addNotification({
      title: 'Armada & Driver Ditugaskan',
      message: `Shipment ${shipmentId} kini telah ditetapkan dengan Truk ${vehicle?.plateNumber || '-'} dan Driver ${driver?.name || '-'}.`,
      type: 'info',
      shipmentId,
    });

    addLog(`Menetapkan Driver & Kendaraan untuk ${shipmentId}`, `Driver: ${driver?.name}, Truk: ${vehicle?.plateNumber}`);
  };

  const submitInspection = (shipmentId: string, inspection: PreDeliveryInspection) => {
    const updated = shipments.map((s) => {
      if (s.id !== shipmentId) return s;
      return {
        ...s,
        preDeliveryInspection: inspection,
        currentStatus: s.currentStatus === 'WAITING_PICKUP' ? ('LOADED' as ShipmentStatus) : s.currentStatus,
      };
    });

    persistShipments(updated);
    addLog(`Mengunggah Pre-Delivery Inspection untuk ${shipmentId}`, `Kondisi Fisik: ${inspection.overallCondition}`);
  };

  const submitPod = (shipmentId: string, podData: ProofOfDelivery) => {
    const updated = shipments.map((s) => {
      if (s.id !== shipmentId) return s;

      const podMilestone: TrackingMilestone = {
        id: `tr-${Date.now()}`,
        step: 14,
        status: 'POD_UPLOADED',
        title: 'Proof of Delivery (POD) Diterima & Diverifikasi',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        location: s.destinationCity,
        updatedBy: `${currentUser.name} (${currentUser.role})`,
        role: currentUser.role,
        notes: `Penerima: ${podData.receiverName} (${podData.receiverPosition}). BAST ditandatangani.`,
      };

      return {
        ...s,
        pod: podData,
        currentStatus: 'COMPLETED' as ShipmentStatus,
        actualDeliveryDate: `${podData.actualArrivalDate} ${podData.actualArrivalTime}`,
        remainingKm: 0,
        isDelayed: false,
        trackingHistory: [...s.trackingHistory, podMilestone],
      };
    });

    persistShipments(updated);

    addNotification({
      title: 'Pengiriman Selesai (POD Verified)',
      message: `Shipment ${shipmentId} telah berhasil diserahkan ke ${podData.receiverName}. Status otomatis menjadi COMPLETED.`,
      type: 'success',
      shipmentId,
    });

    addLog(`Submit Proof of Delivery untuk ${shipmentId}`, `Diterima oleh ${podData.receiverName} (${podData.receiverPosition})`);
  };

  const reportIncident = (shipmentId: string, reason: string, actionTaken: string) => {
    const updated = shipments.map((s) => {
      if (s.id !== shipmentId) return s;

      const incidentMilestone: TrackingMilestone = {
        id: `tr-${Date.now()}`,
        step: 8,
        status: 'DELAYED',
        title: 'Laporan Kendala / Incident Delay',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        location: s.currentLocation.landmark || s.currentLocation.city,
        updatedBy: `${currentUser.name} (${currentUser.role})`,
        role: currentUser.role,
        notes: `Kendala: ${reason}. Tindakan penanganan: ${actionTaken}.`,
      };

      return {
        ...s,
        isDelayed: true,
        currentStatus: 'DELAYED' as ShipmentStatus,
        delayReason: reason,
        delayActionTaken: actionTaken,
        trackingHistory: [...s.trackingHistory, incidentMilestone],
      };
    });

    persistShipments(updated);

    addNotification({
      title: `ALERT: Kendala Keterlambatan (${shipmentId})`,
      message: `Kendala dilaporkan: ${reason}`,
      type: 'delay',
      shipmentId,
    });

    addLog(`Laporan Kendala ${shipmentId}`, `${reason} | Tindakan: ${actionTaken}`);
  };

  const addPhoto = (shipmentId: string, photo: Omit<PhotoItem, 'id' | 'timestamp'>) => {
    const updated = shipments.map((s) => {
      if (s.id !== shipmentId) return s;
      const newPhotoItem: PhotoItem = {
        ...photo,
        id: `ph-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      return {
        ...s,
        photos: [...s.photos, newPhotoItem],
      };
    });

    persistShipments(updated);
    addLog(`Menambahkan foto perjalanan untuk ${shipmentId}`, photo.title);
  };

  const addDocument = (shipmentId: string, doc: Omit<DocumentItem, 'id' | 'uploadedAt'>) => {
    const updated = shipments.map((s) => {
      if (s.id !== shipmentId) return s;
      const newDocItem: DocumentItem = {
        ...doc,
        id: `doc-${Date.now()}`,
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      return {
        ...s,
        documents: [...s.documents, newDocItem],
      };
    });

    persistShipments(updated);
    addLog(`Mengunggah dokumen untuk ${shipmentId}`, doc.name);
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    persistNotifications(updated);
  };

  const getShipmentById = (id: string) => {
    return shipments.find((s) => s.id === id);
  };

  // Customer CRUD
  const addCustomer = (data: Partial<Customer>): Customer => {
    const newId = data.id || `CUST-${String(customers.length + 1).padStart(3, '0')}`;
    const newCustomer: Customer = {
      id: newId,
      companyName: data.companyName || 'Customer Baru',
      customerPic: data.customerPic || 'PIC Baru',
      phone: data.phone || '021-000000',
      email: data.email || 'info@customer.co.id',
      address: data.address || 'Alamat Customer',
      city: data.city || 'Jakarta',
      province: data.province || 'DKI Jakarta',
      postalCode: data.postalCode || '10000',
      latitude: data.latitude ?? -6.2088,
      longitude: data.longitude ?? 106.8456,
      ...data,
    };
    const updated = [newCustomer, ...customers];
    persistCustomers(updated);
    addLog(`Menambahkan Customer Baru: ${newCustomer.companyName}`, `${newCustomer.city}, ${newCustomer.province}`);
    return newCustomer;
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    const updated = customers.map((c) => (c.id === id ? { ...c, ...data } : c));
    persistCustomers(updated);
    const target = updated.find((c) => c.id === id);
    addLog(`Memperbarui data Customer: ${target?.companyName || id}`, target?.customerPic);
  };

  const deleteCustomer = (id: string) => {
    const target = customers.find((c) => c.id === id);
    const updated = customers.filter((c) => c.id !== id);
    persistCustomers(updated);
    if (target) {
      addLog(`Menghapus Customer: ${target.companyName}`, `ID: ${id}`);
    }
  };

  // Transformer CRUD
  const addTransformer = (data: Partial<Transformer>): Transformer => {
    const newId = data.id || `TRF-${data.capacityKVA || 2500}-${String(transformers.length + 1).padStart(3, '0')}`;
    const newTransformer: Transformer = {
      id: newId,
      transformerNumber: data.transformerNumber || `TRF-${data.capacityKVA || 2500}-${String(transformers.length + 1).padStart(3, '0')}`,
      serialNumber: data.serialNumber || `SN-2026-XF${Math.floor(1000 + Math.random() * 9000)}`,
      type: data.type || 'Step-Down Substation Transformer',
      capacityKVA: data.capacityKVA || 2500,
      weightKg: data.weightKg || 38000,
      dimensions: data.dimensions || { length: 4800, width: 2800, height: 3600 },
      oilType: data.oilType || 'Mineral Oil Nytro Lyra X',
      voltageRating: data.voltageRating || '150 kV / 20 kV',
      productionCompletionDate: data.productionCompletionDate || new Date().toISOString().split('T')[0],
      coolingType: data.coolingType || 'ONAN',
      ...data,
    };
    const updated = [newTransformer, ...transformers];
    persistTransformers(updated);
    addLog(`Menambahkan Transformer baru: ${newTransformer.transformerNumber}`, `${newTransformer.capacityKVA} kVA - ${newTransformer.serialNumber}`);
    return newTransformer;
  };

  const updateTransformer = (id: string, data: Partial<Transformer>) => {
    const updated = transformers.map((t) => (t.id === id ? { ...t, ...data } : t));
    persistTransformers(updated);
    const target = updated.find((t) => t.id === id);
    addLog(`Memperbarui data Transformer: ${target?.transformerNumber || id}`, target?.serialNumber);
  };

  const deleteTransformer = (id: string) => {
    const target = transformers.find((t) => t.id === id);
    const updated = transformers.filter((t) => t.id !== id);
    persistTransformers(updated);
    if (target) {
      addLog(`Menghapus Transformer: ${target.transformerNumber}`, `SN: ${target.serialNumber}`);
    }
  };

  // Vehicle CRUD
  const addVehicle = (data: Partial<Vehicle>): Vehicle => {
    const newId = data.id || `veh-${Date.now().toString().slice(-4)}`;
    const newVehicle: Vehicle = {
      id: newId,
      vendorId: data.vendorId || vendors[0]?.id || 'VND-001',
      plateNumber: data.plateNumber || 'B 9000 UXX',
      type: data.type || 'Tronton Lowbed',
      brand: data.brand || 'Volvo',
      model: data.model || 'FH16 750',
      capacityTons: data.capacityTons || 60,
      dimensions: data.dimensions || { length: 16.5, width: 3.2, height: 1.1 },
      gpsId: data.gpsId || `GPS-TRK-${Math.floor(100 + Math.random() * 900)}`,
      status: data.status || 'Ready',
      ...data,
    };
    const updated = [newVehicle, ...vehicles];
    persistVehicles(updated);
    addLog(`Menambahkan Armada Truk: ${newVehicle.plateNumber}`, `${newVehicle.brand} ${newVehicle.model}`);
    return newVehicle;
  };

  const updateVehicle = (id: string, data: Partial<Vehicle>) => {
    const updated = vehicles.map((v) => (v.id === id ? { ...v, ...data } : v));
    persistVehicles(updated);
    const target = updated.find((v) => v.id === id);
    addLog(`Memperbarui data Armada: ${target?.plateNumber || id}`, target?.status);
  };

  const deleteVehicle = (id: string) => {
    const target = vehicles.find((v) => v.id === id);
    const updated = vehicles.filter((v) => v.id !== id);
    persistVehicles(updated);
    if (target) {
      addLog(`Menghapus Armada Truk: ${target.plateNumber}`, target.model);
    }
  };

  // Driver CRUD
  const addDriver = (data: Partial<Driver>): Driver => {
    const newId = data.id || `drv-${Date.now().toString().slice(-4)}`;
    const newDriver: Driver = {
      id: newId,
      vendorId: data.vendorId || vendors[0]?.id || 'VND-001',
      name: data.name || 'Pengemudi Baru',
      phone: data.phone || '0812-0000-0000',
      simNumber: data.simNumber || `SIM-BII-${Math.floor(100000 + Math.random() * 900000)}`,
      simType: data.simType || 'BII Umum',
      emergencyContact: data.emergencyContact || 'Keluarga: 0812-9999-9999',
      status: data.status || 'Available',
      ...data,
    };
    const updated = [newDriver, ...drivers];
    persistDrivers(updated);
    addLog(`Mendaftarkan Pengemudi baru: ${newDriver.name}`, `${newDriver.simType} - ${newDriver.simNumber}`);
    return newDriver;
  };

  const updateDriver = (id: string, data: Partial<Driver>) => {
    const updated = drivers.map((d) => (d.id === id ? { ...d, ...data } : d));
    persistDrivers(updated);
    const target = updated.find((d) => d.id === id);
    addLog(`Memperbarui data Pengemudi: ${target?.name || id}`, target?.status);
  };

  const deleteDriver = (id: string) => {
    const target = drivers.find((d) => d.id === id);
    const updated = drivers.filter((d) => d.id !== id);
    persistDrivers(updated);
    if (target) {
      addLog(`Menghapus data Pengemudi: ${target.name}`, `ID: ${id}`);
    }
  };

  const resetToDefaultData = () => {
    localStorage.removeItem('trafo_shipments');
    localStorage.removeItem('trafo_customers');
    localStorage.removeItem('trafo_transformers');
    localStorage.removeItem('trafo_drivers');
    localStorage.removeItem('trafo_vehicles');
    localStorage.removeItem('trafo_notifications');
    localStorage.removeItem('trafo_activity_logs');
    setShipments(initialShipments);
    setCustomers(initialCustomers);
    setTransformers(initialTransformers);
    setNotifications(initialNotifications);
    setActivityLogs(initialActivityLogs);
    setVendors(initialVendors);
    setDrivers(initialDrivers);
    setVehicles(initialVehicles);
  };

  return (
    <ShipmentContext.Provider
      value={{
        shipments: visibleShipments,
        allShipments: shipments,
        vendors,
        customers,
        transformers,
        drivers,
        vehicles,
        notifications,
        activityLogs,
        createShipment,
        updateStatus,
        updateLocation,
        assignFleet,
        submitInspection,
        submitPod,
        reportIncident,
        addPhoto,
        addDocument,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addTransformer,
        updateTransformer,
        deleteTransformer,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addDriver,
        updateDriver,
        deleteDriver,
        markNotificationRead,
        getShipmentById,
        resetToDefaultData,
      }}
    >
      {children}
    </ShipmentContext.Provider>
  );
}

export function useShipments() {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipments must be used within a ShipmentProvider');
  }
  return context;
}
