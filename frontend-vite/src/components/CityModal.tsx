import React, { useState, useEffect } from "react";
import { City, Country } from "../types";

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (city: Omit<City, "id">) => Promise<void>;
  countries: Country[];
}

const CityModal: React.FC<CityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  countries,
}) => {
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [countryId, setCountryId] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setState("");
      setCountryId("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("City name is required");
      return;
    }

    if (!countryId) {
      setError("Country is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave({
        name,
        state: state || undefined,
        country_id: Number(countryId),
      });
      onClose();
    } catch {
      setError("Failed to save city. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Add New City</h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-2 bg-red-500 text-white rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-white mb-2">City Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-zinc-700 text-white rounded"
              placeholder="Enter city name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">State/Province</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-2 bg-zinc-700 text-white rounded"
              placeholder="Enter state or province (optional)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">Country *</label>
            <select
              value={countryId}
              onChange={(e) =>
                setCountryId(e.target.value ? Number(e.target.value) : "")
              }
              className="w-full p-2 bg-zinc-700 text-white rounded"
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-500 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save City"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CityModal;
