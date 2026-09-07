import type { ChangeEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const LOCATIONS = [
  { name: 'Atlanta, Georgia', code: 'ATL' },
  { name: 'Lagos, Nigeria', code: 'LOS' },
  { name: 'Abuja, Nigeria', code: 'ABV' },
  { name: 'London, UK', code: 'LHR' },
  { name: 'Los Angeles, California', code: 'LAX' },
  { name: 'New York, NY (JFK)', code: 'JFK' },
  { name: 'New York, NY (EWR)', code: 'EWR' },
  { name: 'Chicago, Illinois', code: 'ORD' },
  { name: 'Dallas, Texas', code: 'DFW' },
  { name: 'Denver, Colorado', code: 'DEN' },
  { name: 'San Francisco, California', code: 'SFO' },
  { name: 'Seattle, Washington', code: 'SEA' },
  { name: 'Las Vegas, Nevada', code: 'LAS' },
  { name: 'Orlando, Florida', code: 'MCO' },
  { name: 'Miami, Florida', code: 'MIA' },
  { name: 'Boston, Massachusetts', code: 'BOS' },
  { name: 'Houston, Texas', code: 'IAH' },
  { name: 'Paris, France', code: 'CDG' },
  { name: 'Tokyo, Japan (Haneda)', code: 'HND' },
  { name: 'Tokyo, Japan (Narita)', code: 'NRT' },
  { name: 'Dubai, UAE', code: 'DXB' },
  { name: 'Singapore', code: 'SIN' },
  { name: 'Frankfurt, Germany', code: 'FRA' },
  { name: 'Amsterdam, Netherlands', code: 'AMS' },
  { name: 'Toronto, Canada', code: 'YYZ' },
  { name: 'Sydney, Australia', code: 'SYD' },
  { name: 'Istanbul, Turkey', code: 'IST' },
  { name: 'Seoul, South Korea', code: 'ICN' },
  { name: 'Madrid, Spain', code: 'MAD' },
  { name: 'Rome, Italy', code: 'FCO' }
];

interface CityAutocompleteProps {
  label: string;
  value: string; // The IATA code
  onChange: (iataCode: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function CityAutocomplete({ label, value, onChange, placeholder = 'City or Airport', required = false }: CityAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Initialize query with the matched location name if value is provided
  useEffect(() => {
    if (value) {
      const match = LOCATIONS.find(loc => loc.code === value);
      if (match) {
        setQuery(`${match.name} (${match.code})`);
      }
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset query if they didn't select a valid option and closed it, optionally
        // For now, let it be.
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLocations = LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(query.toLowerCase()) || 
    loc.code.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (loc: { name: string; code: string }) => {
    setQuery(`${loc.name} (${loc.code})`);
    onChange(loc.code);
    setIsOpen(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    // If they type, clear the actual form value until they select
    onChange('');
  };

  return (
    <div className="space-y-1 relative" ref={wrapperRef}>
      <label className="text-xs font-semibold text-slate-500 uppercase">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder={placeholder} 
          value={query} 
          onChange={handleInputChange} 
          onFocus={() => setIsOpen(true)}
          required={required && !value} // Ensure it validates if empty
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-blue-950 focus:ring-1 focus:ring-blue-950 outline-none text-slate-800" 
        />
      </div>
      {isOpen && query && filteredLocations.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredLocations.map((loc) => (
            <li 
              key={loc.code} 
              onClick={() => handleSelect(loc)}
              className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center text-sm"
            >
              <span className="font-medium text-slate-700">{loc.name}</span>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{loc.code}</span>
            </li>
          ))}
        </ul>
      )}
      {isOpen && query && filteredLocations.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-4 text-center text-sm text-slate-500">
          No matches found
        </div>
      )}
    </div>
  );
}
