import React from 'react';
import { City, Country, Filter } from '../types';
import LookupField from './LookupField';

interface FilterBarProps {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  cities: City[];
  countries: Country[];
  onAddCity: () => void;
  onAddCountry: () => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  cities,
  countries,
  onAddCity,
  onAddCountry,
  onApplyFilter,
  onClearFilter
}) => {
  const handleCityChange = (value: string) => {
    setFilter({ ...filter, city: value });
  };

  const handleCountryChange = (value: string) => {
    setFilter({ ...filter, country: value });
  };

  return (
    <div className="bg-zinc-800 p-4 rounded-lg mb-4">
      <h2 className="text-lg font-semibold mb-3 text-white">Filter Businesses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LookupField
          label="City"
          value={filter.city || ''}
          options={cities.map(city => ({ id: city.id, name: city.name }))}
          onChange={handleCityChange}
          onAddNew={onAddCity}
          placeholder="Filter by city"
        />
        
        <LookupField
          label="Country"
          value={filter.country || ''}
          options={countries.map(country => ({ id: country.id, name: country.name }))}
          onChange={handleCountryChange}
          onAddNew={onAddCountry}
          placeholder="Filter by country"
        />
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onClearFilter}
          className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-500 transition"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onApplyFilter}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default FilterBar;