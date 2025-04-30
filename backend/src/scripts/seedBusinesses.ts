import { Database } from "https://deno.land/x/sqlite3@0.11.1/mod.ts";
import { addBusiness } from "../db/database.ts";
import { QuadTreeNode } from "../models/QuadTree.ts";

const businessTypes = [
  "Restaurant",
  "Cafe",
  "Bar",
  "Hotel",
  "Grocery Store",
  "Gym",
  "Salon",
  "Bakery",
  "Pharmacy",
  "Bookstore",
  "Electronics Store",
  "Clothing Store",
  "Coffee Shop",
  "Fast Food",
  "Fine Dining",
  "Pizza Place",
  "Sushi Restaurant",
  "Italian Restaurant",
  "Mexican Restaurant",
  "Chinese Restaurant",
];

const cities = [
  {
    name: "San Francisco",
    state: "CA",
    country: "USA",
    lat: 37.7749,
    lng: -122.4194,
  },
  { name: "New York", state: "NY", country: "USA", lat: 40.7128, lng: -74.006 },
  {
    name: "Los Angeles",
    state: "CA",
    country: "USA",
    lat: 34.0522,
    lng: -118.2437,
  },
  { name: "Chicago", state: "IL", country: "USA", lat: 41.8781, lng: -87.6298 },
  {
    name: "Seattle",
    state: "WA",
    country: "USA",
    lat: 47.6062,
    lng: -122.3321,
  },
  { name: "Austin", state: "TX", country: "USA", lat: 30.2672, lng: -97.7431 },
  { name: "Boston", state: "MA", country: "USA", lat: 42.3601, lng: -71.0589 },
  { name: "Denver", state: "CO", country: "USA", lat: 39.7392, lng: -104.9903 },
  {
    name: "Portland",
    state: "OR",
    country: "USA",
    lat: 45.5051,
    lng: -122.675,
  },
  { name: "Miami", state: "FL", country: "USA", lat: 25.7617, lng: -80.1918 },
];

const streetNames = [
  "Main St",
  "Oak Ave",
  "Maple St",
  "Washington Ave",
  "Park Blvd",
  "Market St",
  "Broadway",
  "1st Ave",
  "Highland Dr",
  "Sunset Blvd",
  "Lake St",
  "River Rd",
  "Mountain View Dr",
  "Ocean Ave",
  "Forest Ln",
  "Elm St",
  "Pine St",
  "Cedar Ave",
  "Willow Dr",
  "Magnolia Blvd",
];

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const randomElement = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

const generateBusinessName = (type: string): string => {
  const adjectives = [
    "Golden",
    "Blue",
    "Green",
    "Red",
    "Silver",
    "Royal",
    "Urban",
    "Coastal",
    "Mountain",
    "Sunny",
  ];
  const nouns = [
    "Star",
    "Moon",
    "Sun",
    "Garden",
    "River",
    "Ocean",
    "Forest",
    "Meadow",
    "Valley",
    "Peak",
  ];

  // 50% chance to use format "The [Adjective] [Noun]"
  if (Math.random() > 0.5) {
    return `The ${randomElement(adjectives)} ${randomElement(nouns)} ${type}`;
  }

  // 30% chance to use format "[Name]'s [Type]"
  if (Math.random() > 0.3) {
    const names = [
      "Joe",
      "Maria",
      "John",
      "Sarah",
      "Mike",
      "Emma",
      "David",
      "Lisa",
      "Tom",
      "Anna",
    ];
    return `${randomElement(names)}'s ${type}`;
  }

  // 20% chance to use format "[Adjective] [Type]"
  return `${randomElement(adjectives)} ${type}`;
};

const generateAddress = (cityData: (typeof cities)[0]): string => {
  const number = Math.floor(random(100, 9999));
  const street = randomElement(streetNames);
  return `${number} ${street}`;
};

const generateCoordinate = (
  centerLat: number,
  centerLng: number,
  radiusKm: number = 5
): [number, number] => {
  const angle = random(0, 2 * Math.PI);
  const distance = random(0, 1) * radiusKm;

  const latOffset = (distance * Math.cos(angle)) / 111;
  const lngOffset =
    (distance * Math.sin(angle)) /
    (111 * Math.cos((centerLat * Math.PI) / 180));

  return [centerLat + latOffset, centerLng + lngOffset];
};

export const seedBusinesses = async (
  db: Database,
  quadtree: QuadTreeNode,
  count: number = 200
) => {
  console.log(`Seeding database with ${count} businesses...`);

  for (let i = 0; i < count; i++) {
    const city = randomElement(cities);

    const type = randomElement(businessTypes);

    const name = generateBusinessName(type);

    const address = generateAddress(city);

    const [latitude, longitude] = generateCoordinate(city.lat, city.lng);

    const id = addBusiness(
      db,
      name,
      type,
      address,
      city.name,
      city.state,
      city.country,
      latitude,
      longitude
    );

    quadtree.insert({
      id,
      x: longitude,
      y: latitude,
      data: {
        id,
        name,
        type,
        address,
        city: city.name,
        state: city.state,
        country: city.country,
        latitude,
        longitude,
      },
    });

    if ((i + 1) % 20 === 0) {
      console.log(`Added ${i + 1} businesses...`);
    }
  }

  console.log(`Successfully added ${count} businesses to the database.`);
};
