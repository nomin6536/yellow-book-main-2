/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Business } from '@yellow/contract';

// Fix default marker icons in Next.js/Next13

const customIcon = new L.Icon({
  iconUrl: '/map.png',
  iconSize: [40, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});


function MapController({ points, selected }: { points: [number, number][]; selected?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (selected) {
      map.setView(selected, 200);
    } else if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, points, selected]);
  return null;
}

export default function MapIsland({ businesses, selectedBusiness }: { businesses: Business[]; selectedBusiness?: Business }) {
  const points = businesses
    .map((b) => {
      const lat = (b as any).latitude ?? (b as any).lat;
      const lng = (b as any).longitude ?? (b as any).lng;
      if (typeof lat === 'number' && typeof lng === 'number') return [lat, lng] as [number, number];
      return null;
    })
    .filter(Boolean) as [number, number][];

  const defaultCenter: [number, number] = [47.918209, 106.917199];
  const selectedPoint = selectedBusiness && typeof (selectedBusiness as any).latitude === 'number' && typeof (selectedBusiness as any).longitude === 'number'
    ? [(selectedBusiness as any).latitude, (selectedBusiness as any).longitude] as [number, number]
    : undefined;

  const center: [number, number] = selectedPoint ?? (points.length ? points[0] : defaultCenter);

  return (
    <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
{points.map((p, i) => (
       <Marker key={i} position={p} icon={customIcon}>
          <Popup>
            <div className="text-sm">
              <strong>{businesses[i].name}</strong>
              <div className="text-xs">{businesses[i].address ?? ''}</div>
            </div>
          </Popup>
        </Marker>
      ))}
      <MapController points={points} selected={selectedPoint} />
    </MapContainer>
  );
}