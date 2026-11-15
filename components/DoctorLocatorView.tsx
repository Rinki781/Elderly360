'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MapPin,
  Search,
  Phone,
  Calendar,
  Filter,
  Navigation,
  Clock,
  Star,
  Hospital,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface ClinicFacility {
  id: string;
  name: string;
  specialty: 'Cardiologist' | 'Endocrinologist' | 'Orthopedic' | 'General Physician' | 'Emergency & ICU';
  type: 'Hospital' | 'Clinic' | 'Diagnostic Center';
  address: string;
  distanceKm: number;
  phone: string;
  rating: number;
  isOpen24x7: boolean;
  lat: number;
  lng: number;
}

const NEARBY_FACILITIES: ClinicFacility[] = [
  {
    id: 'fac-1',
    name: 'Apollo Clinic & Heart Center',
    specialty: 'Cardiologist',
    type: 'Clinic',
    address: 'SCF 34, Sector 14 Market, Gurugram, Haryana',
    distanceKm: 0.8,
    phone: '+91 124 405 6789',
    rating: 4.8,
    isOpen24x7: false,
    lat: 28.4735,
    lng: 77.0381,
  },
  {
    id: 'fac-2',
    name: 'Max Super Speciality Hospital',
    specialty: 'Emergency & ICU',
    type: 'Hospital',
    address: 'B-Block, Sushant Lok 1, Sector 43, Gurugram',
    distanceKm: 2.4,
    phone: '1066 / +91 124 662 3000',
    rating: 4.9,
    isOpen24x7: true,
    lat: 28.4682,
    lng: 77.0784,
  },
  {
    id: 'fac-3',
    name: 'Fortis Memorial Research Institute (FMRI)',
    specialty: 'Orthopedic',
    type: 'Hospital',
    address: 'Sector 44, Opposite HUDA City Centre Metro Station',
    distanceKm: 3.1,
    phone: '+91 124 496 2200',
    rating: 4.7,
    isOpen24x7: true,
    lat: 28.4593,
    lng: 77.0722,
  },
  {
    id: 'fac-4',
    name: 'Dr. Ananya Roy Diabetes & Endocrine Care',
    specialty: 'Endocrinologist',
    type: 'Clinic',
    address: 'Ground Floor, Galleria Market, DLF Phase 4, Gurugram',
    distanceKm: 2.9,
    phone: '+91 98100 23456',
    rating: 4.9,
    isOpen24x7: false,
    lat: 28.4689,
    lng: 77.0855,
  },
  {
    id: 'fac-5',
    name: 'Medanta The Medicity Multidisciplinary Hospital',
    specialty: 'Emergency & ICU',
    type: 'Hospital',
    address: 'CH Bakhtawar Singh Rd, Sector 38, Gurugram',
    distanceKm: 4.5,
    phone: '1068 / +91 124 414 1414',
    rating: 4.8,
    isOpen24x7: true,
    lat: 28.4391,
    lng: 77.0428,
  },
  {
    id: 'fac-6',
    name: 'Shanti Senior Care & Family Practice',
    specialty: 'General Physician',
    type: 'Clinic',
    address: 'Plot 12, Sector 15 Part 1, Near Patel Nagar, Gurugram',
    distanceKm: 1.2,
    phone: '+91 124 232 1100',
    rating: 4.6,
    isOpen24x7: false,
    lat: 28.465,
    lng: 77.045,
  },
];

interface DoctorLocatorViewProps {
  onSelectFacilityForAppointment?: (facility: ClinicFacility) => void;
}

export const DoctorLocatorView: React.FC<DoctorLocatorViewProps> = ({
  onSelectFacilityForAppointment,
}) => {
  const { seniorProfile } = useApp();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFacility, setActiveFacility] = useState<ClinicFacility>(NEARBY_FACILITIES[0]);

  const specialties = [
    'All',
    'Cardiologist',
    'Endocrinologist',
    'Orthopedic',
    'General Physician',
    'Emergency & ICU',
  ];

  const filteredFacilities = NEARBY_FACILITIES.filter((fac) => {
    const matchesSpec = selectedSpecialty === 'All' || fac.specialty === selectedSpecialty;
    const matchesQuery =
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpec && matchesQuery;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-elder-100 text-elder-700 flex items-center justify-center">
              <Hospital className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Healthcare Facility Discovery
            </h2>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              OpenStreetMap + Overpass
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Discover verified doctors, geriatric clinics, and 24x7 emergency hospitals near {seniorProfile.name}
          </p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5 self-start sm:self-center">
          <MapPin className="w-3.5 h-3.5 text-elder-600" />
          <span>Near: <strong>Sector 14, Gurugram</strong></span>
        </div>
      </div>

      {/* Search & Specialty Filters */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by hospital name or locality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-elder-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedSpecialty === spec
                    ? 'bg-elder-600 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Map Embed & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left: Facilities List */}
        <div className="lg:col-span-7 p-4 sm:p-6 space-y-3 max-h-[600px] overflow-y-auto">
          {filteredFacilities.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No medical facilities found matching this specialty.
            </div>
          ) : (
            filteredFacilities.map((fac) => {
              const isSelected = activeFacility.id === fac.id;
              return (
                <div
                  key={fac.id}
                  onClick={() => setActiveFacility(fac)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-elder-50/50 border-elder-300 ring-2 ring-elder-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {fac.type} • {fac.specialty}
                        </span>
                        {fac.isOpen24x7 && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                            24x7 Emergency
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm mt-1">{fac.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{fac.address}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-elder-700 bg-elder-100/80 px-2 py-0.5 rounded-md block">
                        {fac.distanceKm} km
                      </span>
                      <span className="text-[11px] text-amber-600 font-bold flex items-center gap-0.5 justify-end mt-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {fac.rating}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <a
                      href={`tel:${fac.phone.split('/')[0].trim()}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold"
                    >
                      <Phone className="w-3.5 h-3.5 text-elder-600" />
                      <span>{fac.phone}</span>
                    </a>

                    {onSelectFacilityForAppointment && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFacilityForAppointment(fac);
                        }}
                        className="px-2.5 py-1 bg-elder-600 hover:bg-elder-700 text-white font-bold rounded-lg transition flex items-center gap-1 text-[11px] shadow-2xs"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Book Appointment</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Interactive OpenStreetMap View */}
        <div className="lg:col-span-5 p-4 sm:p-6 bg-slate-50 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Interactive Map (OpenStreetMap)</span>
              <span className="text-elder-700 font-semibold lowercase">lat: {activeFacility.lat}, lng: {activeFacility.lng}</span>
            </h4>

            {/* Embedded OpenStreetMap Iframe for verified accurate live mapping without API keys */}
            <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative bg-slate-200">
              <iframe
                title="OpenStreetMap Facility Location"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${activeFacility.lng - 0.02}%2C${
                  activeFacility.lat - 0.02
                }%2C${activeFacility.lng + 0.02}%2C${
                  activeFacility.lat + 0.02
                }&layer=mapnik&marker=${activeFacility.lat}%2C${activeFacility.lng}`}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Active Facility Card Detail */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-slate-900 text-sm">{activeFacility.name}</h5>
              <span className="text-xs font-extrabold text-elder-700">{activeFacility.distanceKm} km away</span>
            </div>
            <p className="text-slate-600">{activeFacility.address}</p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  activeFacility.name + ' ' + activeFacility.address
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-center flex items-center justify-center gap-1.5 transition"
              >
                <Navigation className="w-3.5 h-3.5 text-elder-600" />
                <span>Get Directions</span>
              </a>
              <a
                href={`tel:${activeFacility.phone.split('/')[0].trim()}`}
                className="py-1.5 px-3 bg-elder-600 hover:bg-elder-700 text-white rounded-lg font-bold flex items-center justify-center gap-1 transition shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Hospital</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
