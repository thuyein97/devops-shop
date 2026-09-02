const request = require("supertest");
const app = require("../src/app");

describe("products API", () => {
  test("returns product list", async () => {
    const response = await request(app).get("/api/products");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("returns a product", async () => {
    const response = await request(app).get("/api/products/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Laptop");
  });

  test("returns 404 for unknown product", async () => {
    const response = await request(app).get("/api/products/999");

    expect(response.statusCode).toBe(404);
  });
});
