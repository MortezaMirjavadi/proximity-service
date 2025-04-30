import React from 'react';
import { Business } from '../types';
import BusinessCard from './BusinessCard';

interface BusinessListProps {
  businesses: Business[];
  setMapCenter: (center: [number, number]) => void;
  onShowBusinessDetails: (business: Business) => void;
}

const BusinessList: React.FC<BusinessListProps> = ({ 
  businesses, 
  setMapCenter,
  onShowBusinessDetails
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-zinc-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Businesses</h2>
      <div className="flex flex-col gap-4 pr-2">
        {businesses.length === 0 ? (
          <p className="text-zinc-400 text-center py-4">No businesses found</p>
        ) : (
          businesses.map((business) => (
            <BusinessCard
              key={business.business_id}
              business={business}
              onClick={() => setMapCenter([business.latitude, business.longitude])}
              onShowDetails={() => onShowBusinessDetails(business)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BusinessList;