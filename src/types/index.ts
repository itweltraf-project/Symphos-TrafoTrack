export type UserRole = 'SUPER_ADMIN' | 'MARKETING' | 'VENDOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  vendorId?: string;
  avatar?: string;
  department?: string;
}

export interface ExpeditionVendor {
  id: string;
  name: string;
  code: string;
  pic: string;
  phone: string;
  email: string;
  address: string;
  totalShipments: number;
  onTimeRate: number; // percentage, e.g. 96.5
  delayedCount: number;
  avgDeliveryHours: number;
  podCompletionRate: number;
  active: boolean;
  rating: number; // e.g. 4.8
  fleetCount: number;
  badge?: string;
}

export interface Transformer {
  id: string;
  transformerNumber: string; // e.g. TRF-2500-001
  serialNumber: string; // e.g. SN-2026-XF8821
  type: string;
  capacityKVA: number; // 500, 1000, 1600, 2500, 3000
  weightKg: number;
  dimensions: {
    length: number; // mm
    width: number;
    height: number;
  };
  oilType: string;
  voltageRating: string;
  productionCompletionDate: string;
  coolingType: string; // ONAN, ONAF
}

export interface Customer {
  id: string;
  companyName: string;
  customerPic: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export interface Driver {
  id: string;
  vendorId: string;
  name: string;
  phone: string;
  simNumber: string;
  simType: 'BII Umum' | 'BII' | 'BI';
  emergencyContact: string;
  status: 'Available' | 'On Duty' | 'Rest';
  avatar?: string;
}

export interface Vehicle {
  id: string;
  vendorId: string;
  plateNumber: string;
  type: 'Tronton Lowbed' | 'Multi-Axle Heavy Hauler' | 'Trailer Flatbed 40ft' | 'Tronton Wingbox';
  brand: string;
  model: string;
  capacityTons: number;
  dimensions: {
    length: number; // meters
    width: number;
    height: number;
  };
  gpsId: string;
  status: 'In Transit' | 'Ready' | 'Maintenance';
}

export interface PreDeliveryInspection {
  bushingCondition: 'Good' | 'Minor Scratches' | 'Damaged';
  radiatorCondition: 'Good' | 'Bent Fins' | 'Damaged';
  conservatorCondition: 'Good' | 'Dented' | 'Damaged';
  accessoriesCondition: 'Good' | 'Complete' | 'Missing Parts';
  oilLeakage: boolean;
  rustOrDamage: boolean;
  overallCondition: 'Good' | 'Minor Damage' | 'Major Damage';
  inspectedBy: string;
  inspectedAt: string;
  notes?: string;
  photos: {
    title: string;
    url: string;
  }[];
}

export type ShipmentStatus =
  | 'SHIPMENT_CREATED'
  | 'WAITING_PICKUP'
  | 'VEHICLE_ASSIGNED'
  | 'DRIVER_ASSIGNED'
  | 'PICKUP'
  | 'LOADED'
  | 'DEPARTED'
  | 'IN_TRANSIT'
  | 'AT_TRANSIT_HUB'
  | 'APPROACHING_DESTINATION'
  | 'ARRIVED'
  | 'UNLOADING'
  | 'DELIVERED'
  | 'POD_UPLOADED'
  | 'COMPLETED'
  | 'DELAYED';

export interface TrackingMilestone {
  id: string;
  step: number; // 1 to 15
  status: ShipmentStatus;
  title: string;
  timestamp: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  updatedBy: string;
  role: string;
  notes?: string;
  photoUrl?: string;
}

export interface ProofOfDelivery {
  actualArrivalDate: string;
  actualArrivalTime: string;
  receiverName: string;
  receiverPosition: string;
  receiverPhone: string;
  deliveryNotes: string;
  deliveryCondition: 'Good / Sempurna' | 'Minor Packaging Damage' | 'Incident Reported';
  signatureUrl: string;
  podDocumentUrl: string;
  photos: {
    title: string;
    url: string;
  }[];
  submittedAt: string;
  submittedBy: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'Surat Jalan' | 'Delivery Order' | 'STNK / KIR' | 'SIM Driver' | 'Asuransi Pengiriman' | 'Lainnya';
  fileSize: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  category: 'Pre-Inspection' | 'Loading' | 'In Transit' | 'Unloading' | 'Customer Handover' | 'Incident';
  url: string;
  timestamp: string;
  location: string;
  uploadedBy: string;
}

export interface ActivityLogItem {
  id: string;
  user: string;
  role: string;
  action: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
}

export interface Shipment {
  id: string; // e.g. SHP-2026-0801
  deliveryOrderNo: string;
  salesOrderNo: string;
  poNumber: string;
  
  transformerId: string;
  transformer: Transformer;

  customerId: string;
  customer: Customer;

  vendorId: string;
  vendor: ExpeditionVendor;

  driverId?: string;
  driver?: Driver;

  vehicleId?: string;
  vehicle?: Vehicle;

  currentStatus: ShipmentStatus;
  previousStatus?: ShipmentStatus;
  
  shipmentDate: string;
  departureDate?: string;
  expectedDeliveryDate: string; // ETA ISO string
  actualDeliveryDate?: string;

  originCity: string;
  originAddress: string;
  destinationCity: string;
  destinationAddress: string;

  currentLocation: {
    city: string;
    province: string;
    landmark: string;
    lat: number;
    lng: number;
    speedKmH?: number;
    lastUpdatedAt: string;
  };

  distanceKm: number;
  remainingKm: number;
  
  isDelayed: boolean;
  delayMinutes?: number;
  delayReason?: string;
  delayActionTaken?: string;

  preDeliveryInspection: PreDeliveryInspection;
  trackingHistory: TrackingMilestone[];
  documents: DocumentItem[];
  photos: PhotoItem[];
  pod?: ProofOfDelivery;
  activityLogs: ActivityLogItem[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'delay' | 'success';
  shipmentId?: string;
  timestamp: string;
  isRead: boolean;
  targetRole?: 'ALL' | 'MARKETING' | 'VENDOR';
  vendorId?: string;
}
