import React from 'react';
import { Business } from '../types';
import { getBusinessImage } from '../utils/businessImages';
import Modal from './Modal';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

interface BusinessDetailModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
}

const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({ business, isOpen, onClose }) => {
  if (!business) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={business.name}>
      <div className="flex flex-col gap-4">
        <img 
          src={getBusinessImage(business.type)} 
          alt={business.name} 
          className="w-full h-64 object-cover rounded-lg"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-lg font-semibold text-green-500 mb-2">Business Information</h4>
            <div className="space-y-2">
              <p><span className="font-medium text-white">Type:</span> {business.type}</p>
              {business.address && <p><span className="font-medium text-white">Address:</span> {business.address}</p>}
              {business.city && <p><span className="font-medium text-white">City:</span> {business.city}</p>}
              {business.state && <p><span className="font-medium text-white">State:</span> {business.state}</p>}
              {business.country && <p><span className="font-medium text-white">Country:</span> {business.country}</p>}
              {business.distance !== undefined && (
                <p><span className="font-medium text-white">Distance:</span> {(business.distance / 1000).toFixed(2)} km</p>
              )}
            </div>
          </div>
          
          <div className="h-64">
            <h4 className="text-lg font-semibold text-green-500 mb-2">Location</h4>
            <div className="h-full rounded-lg overflow-hidden">
              <MapContainer
                center={[business.latitude, business.longitude]}
                zoom={15}
                className="h-full w-full"
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[business.latitude, business.longitude]} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BusinessDetailModal;