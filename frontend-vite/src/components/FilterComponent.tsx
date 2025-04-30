import React, { useState, useEffect } from "react";
import { City, Country, Filter, Business } from "../types";

interface FilterComponentProps {
  cities: City[];
  countries: Country[];
  onFilter: (filter: Filter) => void;
  onAddCity: () => void;
  onAddCountry: () => void;
  setMapCenter: (center: [number, number]) => void;
  businesses: Business[];
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  cities,
  countries,
  onFilter,
  onAddCity,
  onAddCountry,
  setMapCenter,
  businesses,
}) => {
  const [filter, setFilter] = useState<Filter>({});
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  useEffect(() => {
    if (businesses.length > 0) {
      calculateCenterOfBusinesses(businesses);
    }
  }, [businesses]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);

    const newFilter = {
      ...filter,
      country: countryId || undefined,
    };

    setFilter(newFilter);
    onFilter(newFilter);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;

    const newFilter = {
      ...filter,
      city: cityId || undefined,
    };

    setFilter(newFilter);
    onFilter(newFilter);
  };

  const resetFilters = () => {
    setFilter({});
    setSelectedCountry("");
    onFilter({});
  };

  const calculateCenterOfBusinesses = (businessList: Business[]) => {
    if (businessList.length === 0) return;

    if (businessList.length === 1) {
      setMapCenter([businessList[0].latitude, businessList[0].longitude]);
      return;
    }

    let sumLat = 0;
    let sumLng = 0;

    businessList.forEach((business) => {
      sumLat += business.latitude;
      sumLng += business.longitude;
    });

    const avgLat = sumLat / businessList.length;
    const avgLng = sumLng / businessList.length;

    setMapCenter([avgLat, avgLng]);
  };

  const filteredCities = selectedCountry
    ? cities.filter((city) => city.country_id === parseInt(selectedCountry))
    : cities;

  return (
    <div className="bg-zinc-800 p-4 rounded-lg mb-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Filter Businesses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Country</label>
              <div className="flex gap-2">
                <select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className="flex-1 p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id.toString()}>
                      {country.name} {country.code ? `(${country.code})` : ""}
                    </option>
                  ))}
                </select>
                <button
                  onClick={onAddCountry}
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
              <label className="block mb-1 text-sm font-medium">City</label>
              <div className="flex gap-2">
                <select
                  value={filter.city || ""}
                  onChange={handleCityChange}
                  className="flex-1 p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                >
                  <option value="">All Cities</option>
                  {filteredCities.map((city) => (
                    <option key={city.id} value={city.id.toString()}>
                      {city.name} {city.state ? `(${city.state})` : ""}
                    </option>
                  ))}
                </select>
                <button
                  onClick={onAddCity}
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
        </div>

        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-500 transition mt-4 md:mt-0"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterComponent;
