import React, { useState, useEffect } from "react";
import { Country } from "../types";

interface CountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (country: Omit<Country, "id">) => Promise<void>;
}

const CountryModal: React.FC<CountryModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setCode("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Country name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave({
        name,
        code: code || undefined,
      });
      onClose();
    } catch {
      setError("Failed to save country. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Add New Country
        </h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-2 bg-red-500 text-white rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-white mb-2">Country Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-zinc-700 text-white rounded"
              placeholder="Enter country name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">Country Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full p-2 bg-zinc-700 text-white rounded"
              placeholder="Enter country code (e.g., US, UK)"
              maxLength={2}
            />
            <small className="text-zinc-400">
              Two-letter country code (ISO 3166-1 alpha-2)
            </small>
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
              {isSubmitting ? "Saving..." : "Save Country"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CountryModal;
