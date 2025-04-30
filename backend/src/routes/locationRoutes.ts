import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Database } from "https://deno.land/x/sqlite3@0.11.1/mod.ts";
import {
  getAllCountries,
  getCountryById,
  addCountry,
  getAllCities,
  getCityById,
  addCity,
} from "../db/database.ts";

export const createLocationRouter = (db: Database) => {
  const router = new Router();

  router.get("/api/countries", (ctx) => {
    try {
      const countries = getAllCountries(db);
      ctx.response.body = countries;
    } catch (error) {
      console.error("Error fetching countries:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  });

  router.get("/api/countries/:id", (ctx) => {
    try {
      const id = parseInt(ctx.params.id || "0");
      const country = getCountryById(db, id);

      if (!country) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Country not found" };
        return;
      }

      ctx.response.body = country;
    } catch (error) {
      console.error("Error fetching country:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  });

  router.post("/api/countries", async (ctx) => {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      const { name, code } = body;

      if (!name) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Country name is required" };
        return;
      }

      const id = addCountry(db, name, code);
      const newCountry = getCountryById(db, Number(id));

      ctx.response.status = 201;
      ctx.response.body = newCountry;
    } catch (error) {
      console.error("Error adding country:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  });

  router.get("/api/cities", (ctx) => {
    try {
      const cities = getAllCities(db);
      ctx.response.body = cities;
    } catch (error) {
      console.error("Error fetching cities:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  });

  router.get("/api/cities/:id", (ctx) => {
    try {
      const id = parseInt(ctx.params.id || "0");
      const city = getCityById(db, id);

      if (!city) {
        ctx.response.status = 404;
        ctx.response.body = { error: "City not found" };
        return;
      }

      ctx.response.body = city;
    } catch (error) {
      console.error("Error fetching city:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  });

  router.post("/api/cities", async (ctx) => {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      const { name, country_id, state } = body;

      if (!name || !country_id) {
        ctx.response.status = 400;
        ctx.response.body = { error: "City name and country_id are required" };
        return;
      }

      const country = getCountryById(db, country_id);
      if (!country) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Country not found" };
        return;
      }

      const id = addCity(db, name, country_id, state);
      const newCity = getCityById(db, Number(id));

      ctx.response.status = 201;
      ctx.response.body = newCity;
    } catch (error) {
      console.error("Error adding city:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  });

  return router;
};
