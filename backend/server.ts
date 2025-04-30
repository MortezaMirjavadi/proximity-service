import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { initDatabase, getAllBusinesses } from "./src/db/database.ts";
import { createWorldQuadTree } from "./src/models/QuadTree.ts";
import { createBusinessRouter } from "./src/routes/businessRoutes.ts";
import { createLocationRouter } from "./src/routes/locationRoutes.ts";
import { seedBusinesses } from "./src/scripts/seedBusinesses.ts";
import { seedLocations } from "./src/scripts/seedLocations.ts";

const db = initDatabase();

// Create the QuadTree
const quadtree = createWorldQuadTree();

// Load existing businesses into QuadTree
const businesses = getAllBusinesses(db);
for (const business of businesses) {
  quadtree.insert({
    id: business.business_id,
    x: business.longitude,
    y: business.latitude,
    data: business,
  });
}

const app = new Application();

app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }

  await next();
});

// Create admin router for seeding data
const adminRouter = new Router();
adminRouter.post("/admin/seed/businesses", async (ctx) => {
  try {
    const body = await ctx.request.body({ type: "json" }).value;
    const count = body.count || 200;

    await seedBusinesses(db, quadtree, count);

    ctx.response.status = 200;
    ctx.response.body = { message: `Successfully seeded ${count} businesses` };
  } catch (error) {
    console.error("Error seeding database:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

adminRouter.post("/admin/seed/locations", async (ctx) => {
  try {
    await seedLocations(db);

    ctx.response.status = 200;
    ctx.response.body = { message: "Successfully seeded countries and cities" };
  } catch (error) {
    console.error("Error seeding locations:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

const businessRouter = createBusinessRouter(db, quadtree);
const locationRouter = createLocationRouter(db);

app.use(businessRouter.routes());
app.use(businessRouter.allowedMethods());
app.use(locationRouter.routes());
app.use(locationRouter.allowedMethods());
app.use(adminRouter.routes());
app.use(adminRouter.allowedMethods());

const port = 8000;
console.log(`Server running on http://localhost:${port}`);
await app.listen({ port });
