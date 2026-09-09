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
  markNotificationRead: (id: string) => void;
  getShipmentById: (id: string) => Shipment | undefined;
  resetToDefaultData: () => void;
}

const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

export function ShipmentProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, isVendor } = useAuth();

  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [vendors, setVendors] = useState<ExpeditionVendor[]>(initialVendors);
  const [customers] = useState<Customer[]>(initialCustomers);
  const [transformers] = useState<Transformer[]>(initialTransformers);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(initialActivityLogs);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedShipments = localStorage.getItem('trafo_shipments');
      if (savedShipments) setShipments(JSON.parse(savedShipments));

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

  const resetToDefaultData = () => {
    localStorage.removeItem('trafo_shipments');
    localStorage.removeItem('trafo_notifications');
    localStorage.removeItem('trafo_activity_logs');
    setShipments(initialShipments);
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
