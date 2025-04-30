import React from "react";
import { Business } from "../types";
import { getBusinessImage } from "../utils/businessImages";

interface BusinessCardProps {
  business: Business;
  onClick: () => void;
  onShowDetails: () => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onClick,
  onShowDetails,
}) => {
  return (
    <div
      className="bg-zinc-800 rounded-lg p-4 shadow-md flex flex-col gap-3 cursor-pointer hover:bg-zinc-700 transition"
      onClick={onClick}
    >
      <img
        src={getBusinessImage(business.type)}
        alt={business.name}
        className="w-full h-36 object-cover rounded"
      />
      <h3 className="text-lg font-semibold text-green-500 m-0">
        {business.name}
      </h3>
      <p className="text-sm text-zinc-300 m-0">
        <span className="font-medium text-white">Type:</span> {business.type}
      </p>
      {business.address && (
        <p className="text-sm text-zinc-300 m-0">
          <span className="font-medium text-white">Address:</span>{" "}
          {business.address}
        </p>
      )}
      {business.city && (
        <p className="text-sm text-zinc-300 m-0">
          <span className="font-medium text-white">City:</span> {business.city}
        </p>
      )}
      {business.distance !== undefined && (
        <p className="text-sm text-zinc-300 m-0">
          <span className="font-medium text-white">Distance:</span>{" "}
          {(business.distance / 1000).toFixed(2)} km
        </p>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onShowDetails();
        }}
        className="mt-2 bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 transition"
      >
        View Details
      </button>
    </div>
  );
};

export default BusinessCard;
