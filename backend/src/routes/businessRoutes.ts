import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Database } from "https://deno.land/x/sqlite3@0.11.1/mod.ts";
import { QuadTreeNode } from "../models/QuadTree.ts";
import { addBusiness } from "../db/database.ts";
import { calculateDistance } from "../utils/geoUtils.ts";

export const createBusinessRouter = (db: Database, quadtree: QuadTreeNode) => {
  const router = new Router();

  router.post("/api/business", async (ctx) => {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      const { name, type, address, city, state, country, latitude, longitude } =
        body;

      if (!name || !type || latitude === undefined || longitude === undefined) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Missing required fields" };
        return;
      }

      const id = addBusiness(
        db,
        name,
        type,
        address || "",
        city || "",
        state || "",
        country || "",
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
          city,
          state,
          country,
          latitude,
          longitude,
        },
      });

      ctx.response.status = 201;
      ctx.response.body = {
        id,
        name,
        type,
        address,
        city,
        state,
        country,
        latitude,
        longitude,
      };
    } catch (error) {
      console.error("Error adding business:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  });

  router.get("/api/businesses", (ctx) => {
    try {
      const businesses = db.prepare("SELECT * FROM businesses").all();
      ctx.response.body = businesses;
    } catch (error) {
      console.error("Error fetching businesses:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  });

  router.get("/v1/search/nearby", (ctx) => {
    try {
      const params = ctx.request.url.searchParams;
      const lat = parseFloat(params.get("latitude") || "0");
      const lng = parseFloat(params.get("longitude") || "0");

      // Default radius is 5000 meters (about 3 miles)
      const radiusInMeters = parseInt(params.get("radius") || "5000");

      const radius = radiusInMeters / 1000;

      if (isNaN(lat) || isNaN(lng)) {
        ctx.response.status = 400;
        ctx.response.body = {
          error: "Invalid parameters",
          message: "Latitude and longitude must be valid decimal numbers",
        };
        return;
      }

      // 1 degree of latitude is approximately 111 km
      const latDegrees = radius / 111;
      // 1 degree of longitude varies with latitude, but we'll use an approximation
      const lngDegrees = radius / (111 * Math.cos((lat * Math.PI) / 180));

      const range = {
        x: lng,
        y: lat,
        width: lngDegrees,
        height: latDegrees,
      };

      const points = quadtree.query(range);

      const nearbyBusinesses = points
        .map((point) => {
          const business = point.data;
          const distance = calculateDistance(
            lat,
            lng,
            business.latitude,
            business.longitude
          );
          const distanceInMeters = distance * 1000;
          return { ...business, distance: distanceInMeters };
        })
        .filter((business) => business.distance <= radiusInMeters)
        .sort((a, b) => a.distance - b.distance);

      ctx.response.body = {
        total: nearbyBusinesses.length,
        businesses: nearbyBusinesses,
      };
    } catch (error) {
      console.error("Error finding nearby businesses:", error);
      ctx.response.status = 500;
      ctx.response.body = {
        error: "Internal server error",
        message: "An unexpected error occurred while processing your request",
      };
    }
  });

  return router;
};
