import React from 'react';
import SearchForm from './SearchForm';
import { SearchLocation } from '../types';

interface SidebarProps {
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
  searchLocation: SearchLocation;
  searchNearby: () => void;
  onOpenAddBusinessModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  searchRadius,
  setSearchRadius,
  searchLocation,
  searchNearby,
  onOpenAddBusinessModal
}) => {
  return (
    <div className="w-80 flex-shrink-0 overflow-y-auto p-4 bg-zinc-800 rounded-lg">
      <SearchForm
        searchRadius={searchRadius}
        setSearchRadius={setSearchRadius}
        searchLocation={searchLocation}
        searchNearby={searchNearby}
      />
      
      <div className="mt-6">
        <button
          onClick={onOpenAddBusinessModal}
          className="w-full bg-green-600 text-white py-2 px-4 rounded font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Add New Business
        </button>
      </div>
    </div>
  );
};

export default Sidebar;