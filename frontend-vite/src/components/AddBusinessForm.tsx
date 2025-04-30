import React from 'react';
import { NewBusiness } from '../types';

interface AddBusinessFormProps {
  newBusiness: NewBusiness;
  setNewBusiness: (business: NewBusiness) => void;
  handleAddBusiness: (e: React.FormEvent) => void;
}

const AddBusinessForm: React.FC<AddBusinessFormProps> = ({
  newBusiness,
  setNewBusiness,
  handleAddBusiness
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBusiness({
      ...newBusiness,
      [name]: value
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Add New Business</h2>
      <form onSubmit={handleAddBusiness} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-white">Name:</label>
          <input
            type="text"
            name="name"
            value={newBusiness.name}
            onChange={handleChange}
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium text-white">Type:</label>
          <input
            type="text"
            name="type"
            value={newBusiness.type}
            onChange={handleChange}
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium text-white">Address:</label>
          <input
            type="text"
            name="address"
            value={newBusiness.address}
            onChange={handleChange}
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium text-white">City:</label>
          <input
            type="text"
            name="city"
            value={newBusiness.city}
            onChange={handleChange}
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium text-white">State:</label>
          <input
            type="text"
            name="state"
            value={newBusiness.state}
            onChange={handleChange}
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium text-white">Country:</label>
          <input
            type="text"
            name="country"
            value={newBusiness.country}
            onChange={handleChange}
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
          />
        </div>
        
        <div>
          <p className="text-sm text-zinc-300 mb-2">
            {newBusiness.latitude && newBusiness.longitude
              ? `Selected Location: ${newBusiness.latitude.toFixed(6)}, ${newBusiness.longitude.toFixed(6)}`
              : 'Click on the map to select a business location'}
          </p>
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded font-medium hover:bg-green-700 transition"
        >
          Add Business
        </button>
      </form>
    </div>
  );
};

export default AddBusinessForm;