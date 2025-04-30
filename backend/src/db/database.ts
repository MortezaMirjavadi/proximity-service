import { Database } from "https://deno.land/x/sqlite3@0.11.1/mod.ts";

export const initDatabase = (): Database => {
  const db = new Database("./businesses.db");

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS businesses (
      business_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state TEXT,
      country TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS countries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      state TEXT,
      country_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (country_id) REFERENCES countries(id)
    )
  `);

  return db;
};

export const getAllBusinesses = (db: Database) => {
  return db.prepare("SELECT * FROM businesses").all() as {
    business_id: number;
    name: string;
    type: string;
    address: string;
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  }[];
};

export const addBusiness = (
  db: Database,
  name: string,
  type: string,
  address: string,
  city: string,
  state: string,
  country: string,
  latitude: number,
  longitude: number
) => {
  const stmt = db.prepare(
    "INSERT INTO businesses (name, type, address, city, state, country, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  stmt.run([name, type, address, city, state, country, latitude, longitude]);
  return db.lastInsertRowId;
};

export const getAllCountries = (db: Database) => {
  return db.prepare("SELECT * FROM countries").all() as {
    id: number;
    name: string;
    code: string;
  }[];
};

export const getCountryById = (db: Database, id: number) => {
  return db.prepare("SELECT * FROM countries WHERE id = ?").get(id) as
    | {
        id: number;
        name: string;
        code: string;
      }
    | undefined;
};

export const addCountry = (db: Database, name: string, code?: string) => {
  const stmt = db.prepare("INSERT INTO countries (name, code) VALUES (?, ?)");
  stmt.run([name, code || null]);
  return db.lastInsertRowId;
};

export const getAllCities = (db: Database) => {
  return db
    .prepare(
      `
    SELECT c.*, co.name as country_name 
    FROM cities c
    JOIN countries co ON c.country_id = co.id
  `
    )
    .all() as {
    id: number;
    name: string;
    state: string;
    country_id: number;
    country_name: string;
  }[];
};

export const getCityById = (db: Database, id: number) => {
  return db
    .prepare(
      `
    SELECT c.*, co.name as country_name 
    FROM cities c
    JOIN countries co ON c.country_id = co.id
    WHERE c.id = ?
  `
    )
    .get(id) as
    | {
        id: number;
        name: string;
        state: string;
        country_id: number;
        country_name: string;
      }
    | undefined;
};

export const addCity = (
  db: Database,
  name: string,
  country_id: number,
  state?: string
) => {
  const stmt = db.prepare(
    "INSERT INTO cities (name, country_id, state) VALUES (?, ?, ?)"
  );
  stmt.run([name, country_id, state || null]);
  return db.lastInsertRowId;
};
