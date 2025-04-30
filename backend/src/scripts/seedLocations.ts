import { Database } from "https://deno.land/x/sqlite3@0.11.1/mod.ts";
import { addCountry, addCity } from "../db/database.ts";

const countries = [
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "UK" },
  { name: "France", code: "FR" },
  { name: "Germany", code: "DE" },
  { name: "Canada", code: "CA" },
  { name: "Australia", code: "AU" },
  { name: "Japan", code: "JP" },
  { name: "China", code: "CN" },
  { name: "India", code: "IN" },
  { name: "Brazil", code: "BR" },
];

const cities = [
  { name: "San Francisco", state: "CA", country: "United States" },
  { name: "New York", state: "NY", country: "United States" },
  { name: "Los Angeles", state: "CA", country: "United States" },
  { name: "Chicago", state: "IL", country: "United States" },
  { name: "Seattle", state: "WA", country: "United States" },
  { name: "Austin", state: "TX", country: "United States" },
  { name: "Boston", state: "MA", country: "United States" },
  { name: "Denver", state: "CO", country: "United States" },
  { name: "Portland", state: "OR", country: "United States" },
  { name: "Miami", state: "FL", country: "United States" },
  { name: "London", state: "", country: "United Kingdom" },
  { name: "Manchester", state: "", country: "United Kingdom" },
  { name: "Paris", state: "", country: "France" },
  { name: "Lyon", state: "", country: "France" },
  { name: "Berlin", state: "", country: "Germany" },
  { name: "Munich", state: "", country: "Germany" },
  { name: "Toronto", state: "ON", country: "Canada" },
  { name: "Vancouver", state: "BC", country: "Canada" },
  { name: "Sydney", state: "NSW", country: "Australia" },
  { name: "Melbourne", state: "VIC", country: "Australia" },
];

export const seedLocations = async (db: Database) => {
  console.log("Seeding countries and cities...");

  const countryIds: Record<string, number> = {};

  for (const country of countries) {
    const id = addCountry(db, country.name, country.code);
    countryIds[country.name] = Number(id);
    console.log(`Added country: ${country.name}`);
  }

  for (const city of cities) {
    const countryId = countryIds[city.country];
    if (countryId) {
      addCity(db, city.name, countryId, city.state);
      console.log(`Added city: ${city.name}, ${city.country}`);
    } else {
      console.warn(`Country not found for city: ${city.name}, ${city.country}`);
    }
  }

  console.log("Successfully seeded countries and cities.");
};
