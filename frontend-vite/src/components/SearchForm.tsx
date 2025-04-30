import React from 'react';
import { SearchLocation } from '../types';

interface SearchFormProps {
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
  searchLocation: SearchLocation;
  searchNearby: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchRadius,
  setSearchRadius,
  searchLocation,
  searchNearby
}) => {
  return (
    <div className="mb-8 pb-6 border-b border-zinc-600">
      <h2 className="text-xl font-semibold mb-4 text-white">Search Nearby Businesses</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-white">
          Search Radius (meters):
        </label>
        <input
          type="number"
          value={searchRadius}
          onChange={(e) => setSearchRadius(Number(e.target.value))}
          min="100"
          max="50000"
          className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
        />
      </div>
      <p className="mb-4 text-sm text-zinc-300">
        {searchLocation.latitude && searchLocation.longitude
          ? `Selected Location: ${searchLocation.latitude.toFixed(6)}, ${searchLocation.longitude.toFixed(6)}`
          : 'Click on the map to select a search location'}
      </p>
      <button
        onClick={searchNearby}
        disabled={!searchLocation.latitude || !searchLocation.longitude}
        className="w-full bg-green-600 text-white py-2 px-4 rounded font-medium hover:bg-green-700 disabled:bg-zinc-500 disabled:cursor-not-allowed transition"
      >
        Search Nearby
      </button>
    </div>
  );
};

export default SearchForm;