'use client';

import React, { useEffect, useRef, useState, useId } from 'react';
import { Shipment } from '@/types';
import {
  MapPin,
  Truck,
  Zap,
  Clock,
  ExternalLink,
  Layers,
  Crosshair,
  Maximize2,
  Minimize2,
  Globe,
  ChevronDown,
  Navigation,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import Link from 'next/link';

interface InteractiveTrackingMapProps {
  shipments: Shipment[];
  selectedShipmentId?: string;
  onSelectShipment?: (shipment: Shipment) => void;
  compact?: boolean;
}

type MapLayerType = 'googleRoad' | 'googleSat' | 'googleTerrain' | 'osm';

export function InteractiveTrackingMap({
  shipments,
  selectedShipmentId,
  onSelectShipment,
  compact = false,
}: InteractiveTrackingMapProps) {
  const mapContainerId = useId().replace(/:/g, '_') + '_map';
  const mapRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const layersGroupRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const [activeShipment, setActiveShipment] = useState<Shipment | null>(
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0] || null
  );
  const [mapLayer, setMapLayer] = useState<MapLayerType>('googleRoad');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Sync active shipment when selectedShipmentId prop changes
  useEffect(() => {
    if (selectedShipmentId) {
      const found = shipments.find((s) => s.id === selectedShipmentId);
      if (found) setActiveShipment(found);
    }
  }, [selectedShipmentId, shipments]);

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined') return;
      const L = (await import('leaflet')).default;
      leafletRef.current = L;

      const container = document.getElementById(mapContainerId);
      if (!container) return;

      // Clean up if instance already exists
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // Center around Java / Indonesia coordinates by default
      const defaultCenter: [number, number] = activeShipment
        ? [activeShipment.currentLocation.lat, activeShipment.currentLocation.lng]
        : [-2.5, 117.8];
      const defaultZoom = activeShipment ? 7 : 5;

      const map = L.map(container, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false, // We will use custom Google Maps styled buttons
        attributionControl: false,
      });

      // Attribution control bottom right (clean)
      L.control
        .attribution({
          position: 'bottomleft',
          prefix: '<span class="text-[10px] text-slate-500 font-sans">© Google Maps Data</span>',
        })
        .addTo(map);

      // Add Tile Layer
      const tileUrl = getTileUrl('googleRoad');
      const tile = L.tileLayer(tileUrl, {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }).addTo(map);

      tileLayerRef.current = tile;

      // Group for markers and polylines
      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;

      mapRef.current = map;
      if (isMounted) setIsMapReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapContainerId]);

  // Helper to get Tile URL
  const getTileUrl = (type: MapLayerType) => {
    switch (type) {
      case 'googleSat':
        // Google Satellite with road labels (Hybrid)
        return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      case 'googleTerrain':
        // Google Terrain
        return 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
      case 'osm':
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      case 'googleRoad':
      default:
        // Google Roadmap (Detailed streets, highways, toll roads, POIs)
        return 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    }
  };

  // Change Map Layer
  const switchMapLayer = (type: MapLayerType) => {
    setMapLayer(type);
    if (!mapRef.current || !leafletRef.current) return;
    const L = leafletRef.current;

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    const newTile = L.tileLayer(getTileUrl(type), {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(mapRef.current);

    tileLayerRef.current = newTile;
  };

  // Update Markers & Polylines whenever shipments, activeShipment, or mapReady changes
  useEffect(() => {
    if (!isMapReady || !mapRef.current || !leafletRef.current || !layersGroupRef.current) return;
    const L = leafletRef.current;
    const map = mapRef.current;
    const group = layersGroupRef.current;

    group.clearLayers();

    if (shipments.length === 0) return;

    // Factory Origin Coordinates (Jl. Agarindo No.10, Bunder, Kec. Cikupa, Kabupaten Tangerang, Banten 15560)
    const factoryLat = -6.2366;
    const factoryLng = 106.5085;

    // Render Origin Marker (Factory Hub)
    const originIcon = L.divIcon({
      className: 'custom-origin-icon',
      html: `
        <div class="flex items-center gap-1.5 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-auto">
          <div class="relative flex items-center justify-center">
            <div class="w-7 h-7 rounded-full bg-emerald-500/30 animate-ping absolute"></div>
            <div class="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>
            </div>
          </div>
          <div class="px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold shadow-md whitespace-nowrap border border-slate-700">
            Pabrik Trafo Cikupa (Tangerang)
          </div>
        </div>
      `,
      iconSize: [160, 32],
      iconAnchor: [14, 16],
    });

    const originMarker = L.marker([factoryLat, factoryLng], { icon: originIcon });
    originMarker.bindPopup(`
      <div class="p-2.5 font-sans text-xs min-w-[220px]">
        <div class="font-bold text-slate-900 flex items-center gap-1.5 text-sm mb-1">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          Main Transformer Plant (Origin)
        </div>
        <p class="text-slate-600 text-[11px] leading-relaxed">
          Jl. Agarindo No.10, Bunder, Kec. Cikupa, Kabupaten Tangerang, Banten 15560
        </p>
      </div>
    `);
    group.addLayer(originMarker);

    // Render All Shipments
    shipments.forEach((s) => {
      const isSelected = activeShipment?.id === s.id;
      const isLate = s.isDelayed || s.currentStatus === 'DELAYED';
      const truckLat = s.currentLocation.lat;
      const truckLng = s.currentLocation.lng;
      const destLat = s.customer.latitude || s.currentLocation.lat;
      const destLng = s.customer.longitude || s.currentLocation.lng;

      // 1. Truck Marker (Live GPS Position)
      const truckIcon = L.divIcon({
        className: 'custom-truck-icon',
        html: `
          <div class="group relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none transition-transform duration-200 ${
            isSelected ? 'scale-110 z-30' : 'hover:scale-105 z-10'
          }">
            <!-- Ping radar ring -->
            <div class="absolute -top-1 w-9 h-9 rounded-full ${
              isLate ? 'bg-red-500/30' : isSelected ? 'bg-blue-500/40' : 'bg-emerald-500/25'
            } animate-ping"></div>

            <!-- Header Badge (Plate or ID) -->
            <div class="px-2 py-0.5 rounded-full ${
              isSelected
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40 border border-blue-300 font-extrabold'
                : isLate
                ? 'bg-red-600 text-white font-bold border border-red-300'
                : 'bg-slate-900/90 text-white font-bold border border-slate-700'
            } text-[10px] tracking-tight whitespace-nowrap flex items-center gap-1 shadow-lg mb-1">
              <span>${s.vehicle?.plateNumber || s.id}</span>
              ${s.currentLocation.speedKmH ? `<span class="text-emerald-300">• ${s.currentLocation.speedKmH} km/h</span>` : ''}
            </div>

            <!-- Central Truck Circle Pin -->
            <div class="w-8 h-8 rounded-full ${
              isLate
                ? 'bg-red-600 text-white shadow-red-500/40'
                : isSelected
                ? 'bg-blue-600 text-white shadow-blue-500/40 ring-4 ring-blue-400/30'
                : 'bg-slate-800 text-amber-400'
            } flex items-center justify-center shadow-xl border-2 border-white">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
            </div>
          </div>
        `,
        iconSize: [110, 50],
        iconAnchor: [55, 30],
      });

      const truckMarker = L.marker([truckLat, truckLng], { icon: truckIcon });

      // Click Marker handler
      truckMarker.on('click', () => {
        setActiveShipment(s);
        if (onSelectShipment) onSelectShipment(s);
      });

      // Tooltip / Popup
      truckMarker.bindPopup(`
        <div class="p-3 font-sans text-xs min-w-[240px] space-y-2">
          <div class="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span class="font-extrabold text-blue-600 text-sm">${s.id}</span>
            <span class="px-2 py-0.5 rounded-full ${isLate ? 'bg-red-50 text-red-700 font-bold' : 'bg-slate-100 text-slate-700 font-bold'} text-[10px]">
              ${s.currentStatus}
            </span>
          </div>
          <div class="text-slate-900 font-bold text-xs">${s.transformer.transformerNumber} (${s.transformer.capacityKVA} kVA)</div>
          <div class="text-slate-600 text-[11px] flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${s.currentLocation.landmark || s.currentLocation.city}</span>
          </div>
          <div class="text-slate-600 text-[11px]">
            Tujuan: <strong class="text-slate-800">${s.destinationCity} (${s.customer.companyName})</strong>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span class="text-slate-400 text-[10px]">${s.vendor.name.split('PT ')[1] || s.vendor.name}</span>
            <a href="/dashboard/shipments/${s.id}" class="text-blue-600 hover:underline font-bold text-[11px]">Lihat Detail →</a>
          </div>
        </div>
      `);

      group.addLayer(truckMarker);

      // 2. If this is the currently selected active shipment, also render Destination Pin and Route Polyline!
      if (isSelected) {
        // Destination Substation Pin
        const destIcon = L.divIcon({
          className: 'custom-dest-icon',
          html: `
            <div class="flex items-center gap-1.5 -translate-x-1/2 -translate-y-1/2 select-none">
              <div class="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div class="px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold shadow-md whitespace-nowrap border border-slate-700">
                Tujuan: ${s.destinationCity}
              </div>
            </div>
          `,
          iconSize: [160, 32],
          iconAnchor: [14, 16],
        });

        const destMarker = L.marker([destLat, destLng], { icon: destIcon });
        destMarker.bindPopup(`
          <div class="p-2.5 font-sans text-xs min-w-[220px]">
            <div class="font-bold text-slate-900 text-sm mb-0.5">${s.customer.companyName}</div>
            <div class="text-slate-600 text-[11px] mb-2">${s.customer.address}</div>
            <div class="text-blue-600 font-bold text-[10px]">Lokasi Gardu Induk Penerima Trafo</div>
          </div>
        `);
        group.addLayer(destMarker);

        // Polyline Route: Completed Path (Factory to Current Truck Position)
        const completedRoute = L.polyline(
          [
            [factoryLat, factoryLng],
            [truckLat, truckLng],
          ],
          {
            color: '#2563eb', // Blue
            weight: 5,
            opacity: 0.85,
            lineJoin: 'round',
          }
        );
        group.addLayer(completedRoute);

        // Polyline Route: Remaining Path (Current Truck Position to Destination)
        const remainingRoute = L.polyline(
          [
            [truckLat, truckLng],
            [destLat, destLng],
          ],
          {
            color: '#0ea5e9', // Cyan
            weight: 4,
            dashArray: '8, 8',
            opacity: 0.9,
            lineJoin: 'round',
          }
        );
        group.addLayer(remainingRoute);
      }
    });
  }, [isMapReady, shipments, activeShipment, onSelectShipment]);

  // Zoom In / Zoom Out Controls
  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut();
  };

  // Center on Active Shipment
  const handleFocusActive = () => {
    if (mapRef.current && activeShipment) {
      mapRef.current.flyTo(
        [activeShipment.currentLocation.lat, activeShipment.currentLocation.lng],
        11,
        { duration: 1.2 }
      );
    }
  };

  // Center to whole Indonesia overview
  const handleResetIndonesia = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([-2.5, 117.8], 5, { duration: 1.5 });
    }
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-slate-300 shadow-xl transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none h-screen w-screen'
          : compact
          ? 'h-[440px]'
          : 'h-[580px]'
      }`}
    >
      {/* Leaflet DOM Node */}
      <div id={mapContainerId} className="w-full h-full z-0 bg-slate-200" />

      {/* TOP-LEFT OVERLAY: Live GPS Tracker Header & Layer Switcher */}
      <div className="absolute top-4 left-4 z-20 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        {/* Status Badge */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl px-3.5 py-2 shadow-lg flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          </div>
          <div>
            <div className="text-[11px] font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Google Maps Live Tracking</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
                {shipments.length} Armada Aktif
              </span>
            </div>
            <div className="text-[10px] text-slate-500 hidden sm:block">
              Pantau rute dan kecepatan GPS secara real-time
            </div>
          </div>
        </div>

        {/* Map Layer Switcher (Google Style) */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl p-1 shadow-lg flex items-center gap-1">
          <button
            onClick={() => switchMapLayer('googleRoad')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapLayer === 'googleRoad'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="Peta Standar Google Maps (Jalan, Tol, Kota)"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Peta</span>
          </button>

          <button
            onClick={() => switchMapLayer('googleSat')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapLayer === 'googleSat'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="Citra Satelit Google (Foto Udara Resolusi Tinggi)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Satelit</span>
          </button>

          <button
            onClick={() => switchMapLayer('googleTerrain')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapLayer === 'googleTerrain'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="Peta Topografi & Kontur Wilayah"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Topografi</span>
          </button>
        </div>
      </div>

      {/* TOP-RIGHT OVERLAY: Camera Actions & Fullscreen */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={handleFocusActive}
          className="bg-white/95 backdrop-blur-md border border-slate-200/80 hover:bg-white text-slate-800 px-3 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all cursor-pointer hover:border-blue-400"
          title="Fokuskan Kamera ke Armada yang Dipilih"
        >
          <Crosshair className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Fokus Armada</span>
        </button>

        <button
          onClick={handleResetIndonesia}
          className="bg-white/95 backdrop-blur-md border border-slate-200/80 hover:bg-white text-slate-800 px-3 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
          title="Tampilan Penuh Seluruh Indonesia"
        >
          <Globe className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Nusantara</span>
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="bg-white/95 backdrop-blur-md border border-slate-200/80 hover:bg-white text-slate-800 p-2 rounded-xl shadow-lg transition-all cursor-pointer"
          title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* BOTTOM-LEFT: Custom Google Maps Zoom Controls */}
      <div className="absolute bottom-6 left-4 z-20 flex flex-col bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-lg overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors font-bold text-base cursor-pointer border-b border-slate-200/80 flex items-center justify-center w-9 h-9"
          title="Perbesar Peta (Zoom In)"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors font-bold text-base cursor-pointer flex items-center justify-center w-9 h-9"
          title="Perkecil Peta (Zoom Out)"
        >
          −
        </button>
      </div>

      {/* BOTTOM-RIGHT: Selected Shipment Google Maps Style Card */}
      {activeShipment && (
        <div className="absolute bottom-4 right-4 z-20 w-80 sm:w-96 max-w-[calc(100vw-32px)]">
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-2xl p-4 text-slate-900 transition-all">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-blue-600">{activeShipment.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                    {activeShipment.transformer.capacityKVA} kVA
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 mt-0.5 truncate max-w-[220px]">
                  {activeShipment.customer.companyName}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    activeShipment.isDelayed
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {activeShipment.currentStatus}
                </span>

                <button
                  onClick={() => setIsCardCollapsed(!isCardCollapsed)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isCardCollapsed ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Collapsible Body */}
            {!isCardCollapsed && (
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" /> Posisi Live:
                  </span>
                  <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                    {activeShipment.currentLocation.landmark || activeShipment.currentLocation.city}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-500" /> Armada & Plat:
                  </span>
                  <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                    {activeShipment.vehicle?.plateNumber || 'Armada Standby'} ({activeShipment.vendor.name.split('PT ')[1] || activeShipment.vendor.name})
                  </span>
                </div>

                {activeShipment.driver && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-emerald-500" /> Pengemudi:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {activeShipment.driver.name} ({activeShipment.driver.phone})
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> Estimasi Tiba:
                  </span>
                  <span className="font-bold text-emerald-600">{activeShipment.expectedDeliveryDate}</span>
                </div>

                {activeShipment.isDelayed && (
                  <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-800 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block">Status Terlambat (Delay)</strong>
                      <span>{activeShipment.delayReason || 'Mengalami penundaan rute perjalanan.'}</span>
                    </div>
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    GPS: {activeShipment.currentLocation.lat.toFixed(4)}, {activeShipment.currentLocation.lng.toFixed(4)}
                  </span>
                  <Link
                    href={`/dashboard/shipments/${activeShipment.id}`}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline"
                  >
                    Buka Rincian <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
