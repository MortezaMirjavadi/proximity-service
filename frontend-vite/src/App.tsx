import { useState, useEffect } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import BusinessList from "./components/BusinessList";
import MapComponent from "./components/MapComponent";
import BusinessDetailModal from "./components/BusinessDetailModal";
import AddBusinessModal from "./components/AddBusinessModal";
import FilterComponent from "./components/FilterComponent";
import CityModal from "./components/CityModal";
import CountryModal from "./components/CountryModal";

import {
  Business,
  SearchLocation,
  NewBusiness,
  City,
  Country,
  Filter,
} from "./types";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    37.7749, -122.4194,
  ]);
  const [searchLocation, setSearchLocation] = useState<SearchLocation>({
    latitude: null,
    longitude: null,
  });
  const [searchRadius, setSearchRadius] = useState<number>(5000);

  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);

  useEffect(() => {
    fetchBusinesses();
    fetchCities();
    fetchCountries();
  }, []);

  useEffect(() => {
    setFilteredBusinesses(businesses);
  }, [businesses]);

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get("/api/businesses");
      setBusinesses(response.data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get("/api/cities");
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get("/api/countries");
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setCountries([]);
    }
  };

  const searchNearby = async () => {
    if (!searchLocation.latitude || !searchLocation.longitude) {
      alert("Please select a location to search around");
      return;
    }

    try {
      const response = await axios.get("/v1/search/nearby", {
        params: {
          latitude: searchLocation.latitude,
          longitude: searchLocation.longitude,
          radius: searchRadius,
        },
      });

      if (response.data && response.data.businesses) {
        setBusinesses(response.data.businesses);
        setMapCenter([searchLocation.latitude, searchLocation.longitude]);
      }
    } catch (error) {
      console.error("Error searching nearby businesses:", error);
    }
  };

  const handleAddBusiness = async (business: NewBusiness) => {
    try {
      await axios.post("/api/business", business);
      fetchBusinesses();
      return Promise.resolve();
    } catch (error) {
      console.error("Error adding business:", error);
      return Promise.reject(error);
    }
  };

  const handleAddCity = async (city: Omit<City, "id">) => {
    try {
      const response = await axios.post("/api/cities", city);
      const newCity = response.data;
      setCities([...cities, newCity]);
      return Promise.resolve();
    } catch (error) {
      console.error("Error adding city:", error);
      return Promise.reject(error);
    }
  };

  const handleAddCountry = async (country: Omit<Country, "id">) => {
    try {
      const response = await axios.post("/api/countries", country);
      const newCountry = response.data;
      setCountries([...countries, newCountry]);
      return Promise.resolve();
    } catch (error) {
      console.error("Error adding country:", error);
      return Promise.reject(error);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSearchLocation({ latitude: lat, longitude: lng });
    setSelectedLocation([lat, lng]);
  };

  const handleShowBusinessDetails = (business: Business) => {
    setSelectedBusiness(business);
    setIsDetailModalOpen(true);
  };

  const handleFilter = (filter: Filter) => {
    let filtered = [...businesses];

    if (filter.country) {
      const countryId = parseInt(filter.country);
      filtered = filtered.filter((business) => {
        const city = cities.find((c) => c.name === business.city);
        return city?.country_id === countryId;
      });
    }

    if (filter.city) {
      const cityId = parseInt(filter.city);
      const city = cities.find((c) => c.id === cityId);
      if (city) {
        filtered = filtered.filter((business) => business.city === city.name);
      }
    }

    setFilteredBusinesses(filtered);
  };

  return (
    <div className="min-h-screen p-6 bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
          <Sidebar
            searchRadius={searchRadius}
            setSearchRadius={setSearchRadius}
            searchLocation={searchLocation}
            searchNearby={searchNearby}
            onOpenAddBusinessModal={() => setIsAddModalOpen(true)}
          />

          <div className="flex-1 flex flex-col h-full">
            <FilterComponent
              cities={cities}
              countries={countries}
              onFilter={handleFilter}
              onAddCity={() => setIsCityModalOpen(true)}
              onAddCountry={() => setIsCountryModalOpen(true)}
              setMapCenter={setMapCenter}
              businesses={filteredBusinesses}
            />

            <div className="flex-1 flex flex-col lg:flex-row gap-6">
              <BusinessList
                businesses={filteredBusinesses}
                setMapCenter={setMapCenter}
                onShowBusinessDetails={handleShowBusinessDetails}
              />

              <MapComponent
                mapCenter={mapCenter}
                businesses={filteredBusinesses}
                searchLocation={searchLocation}
                selectedLocation={selectedLocation}
                onLocationSelect={handleLocationSelect}
              />
            </div>
          </div>
        </div>

        <BusinessDetailModal
          business={selectedBusiness}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />

        <AddBusinessModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddBusiness={handleAddBusiness}
          cities={cities}
          countries={countries}
          onAddCity={() => setIsCityModalOpen(true)}
          onAddCountry={() => setIsCountryModalOpen(true)}
        />

        <CityModal
          isOpen={isCityModalOpen}
          onClose={() => setIsCityModalOpen(false)}
          onSave={handleAddCity}
          countries={countries}
        />

        <CountryModal
          isOpen={isCountryModalOpen}
          onClose={() => setIsCountryModalOpen(false)}
          onSave={handleAddCountry}
        />
      </div>
    </div>
  );
}

export default App;
