const request = require("supertest");
const app = require("../src/app");

describe("health endpoint", () => {
  test("returns UP", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("UP");
    expect(response.body.service).toBe("devops-shop");
  });
});
