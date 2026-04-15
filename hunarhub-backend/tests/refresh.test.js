import request from "supertest";
import app from "../server.js";

describe("Refresh Token API", () => {

  it("should generate new access token using refresh token", async () => {

    const email = `test${Date.now()}@example.com`;
    const password = "123456";

    // Register
    await request(app)
      .post("/api/users/register")
      .send({
        name: "Test User",
        email,
        password
      });

    // Login
    const loginRes = await request(app)
      .post("/api/users/login")
      .send({
        email,
        password
      });

    const refreshToken = loginRes.body.refreshToken;

    // Refresh
    const res = await request(app)
      .post("/api/users/refresh")
      .set("Authorization", `Bearer ${refreshToken}`);

    console.log(res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

});