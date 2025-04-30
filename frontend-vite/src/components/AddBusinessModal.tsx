import React, { useState } from "react";
import { NewBusiness, City, Country } from "../types";
import Modal from "./Modal";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBusiness: (business: NewBusiness) => Promise<void>;
  cities: City[];
  countries: Country[];
  onAddCity: () => void;
  onAddCountry: () => void;
}

function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const AddBusinessModal: React.FC<AddBusinessModalProps> = ({
  isOpen,
  onClose,
  onAddBusiness,
  cities,
  countries,
  onAddCity,
  onAddCountry,
}) => {
  const [newBusiness, setNewBusiness] = useState<NewBusiness>({
    name: "",
    type: "",
    address: "",
    city: "",
    state: "",
    country: "",
    latitude: null,
    longitude: null,
  });
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredCities = selectedCountry
    ? cities.filter((city) => city.country_id === selectedCountry)
    : cities;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewBusiness({
      ...newBusiness,
      [name]: value,
    });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryId = parseInt(e.target.value);
    setSelectedCountry(countryId || null);

    if (countryId) {
      const country = countries.find((c) => c.id === countryId);
      if (country) {
        setNewBusiness({
          ...newBusiness,
          country: country.name,
        });
      }
    } else {
      setNewBusiness({
        ...newBusiness,
        country: "",
      });
    }

    setSelectedCity(null);
    setNewBusiness({
      ...newBusiness,
      city: "",
      state: "",
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = parseInt(e.target.value);
    setSelectedCity(cityId || null);

    if (cityId) {
      const city = cities.find((c) => c.id === cityId);
      if (city) {
        setNewBusiness({
          ...newBusiness,
          city: city.name,
          state: city.state || "",
        });
      }
    } else {
      setNewBusiness({
        ...newBusiness,
        city: "",
        state: "",
      });
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setNewBusiness({
      ...newBusiness,
      latitude: lat,
      longitude: lng,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newBusiness.name.trim()) {
      newErrors.name = "Business name is required";
    }

    if (!newBusiness.type.trim()) {
      newErrors.type = "Business type is required";
    }

    if (!newBusiness.latitude || !newBusiness.longitude) {
      newErrors.location = "Please select a location on the map";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddBusiness(newBusiness);

      setNewBusiness({
        name: "",
        type: "",
        address: "",
        city: "",
        state: "",
        country: "",
        latitude: null,
        longitude: null,
      });
      setSelectedCountry(null);
      setSelectedCity(null);
      onClose();
    } catch (error) {
      console.error("Error adding business:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Business">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-white">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={newBusiness.name}
                onChange={handleChange}
                className={`w-full p-2 bg-zinc-700 border rounded text-white ${
                  errors.name ? "border-red-500" : "border-zinc-600"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-white">
                Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="type"
                value={newBusiness.type}
                onChange={handleChange}
                className={`w-full p-2 bg-zinc-700 border rounded text-white ${
                  errors.type ? "border-red-500" : "border-zinc-600"
                }`}
              />
              {errors.type && (
                <p className="mt-1 text-sm text-red-500">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-white">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={newBusiness.address}
                onChange={handleChange}
                className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-white">
                Country
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedCountry || ""}
                  onChange={handleCountryChange}
                  className="flex-1 p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                >
                  <option value="">Select a Country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name} {country.code ? `(${country.code})` : ""}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddCountry();
                  }}
                  className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  title="Add New Country"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-white">City</label>
              <div className="flex gap-2">
                <select
                  value={selectedCity || ""}
                  onChange={handleCityChange}
                  className="flex-1 p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  disabled={!selectedCountry}
                >
                  <option value="">Select a City</option>
                  {filteredCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} {city.state ? `(${city.state})` : ""}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddCity();
                  }}
                  className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  title="Add New City"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-white">
                Location <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-zinc-400 mb-2">
                Click on the map to select a location
              </p>
              <div className="h-64 rounded-lg overflow-hidden">
                <MapContainer
                  center={[37.7749, -122.4194]}
                  zoom={13}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {newBusiness.latitude && newBusiness.longitude && (
                    <Marker
                      position={[newBusiness.latitude, newBusiness.longitude]}
                    />
                  )}

                  <LocationMarker onLocationSelect={handleLocationSelect} />
                </MapContainer>
              </div>

              <p className="mt-2 text-sm text-zinc-300">
                {newBusiness.latitude && newBusiness.longitude
                  ? `Selected Location: ${newBusiness.latitude.toFixed(
                      6
                    )}, ${newBusiness.longitude.toFixed(6)}`
                  : "No location selected"}
              </p>
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">{errors.location}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-zinc-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-500 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-green-800 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Business"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBusinessModal;
