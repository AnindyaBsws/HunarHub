import request from "supertest";
import app from "../server.js";

describe("Logout API", () => {

  it("should logout user and invalidate refresh token", async () => {

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

    //  Logout
    const res = await request(app)
      .post("/api/users/logout")
      .send({
        refreshToken
      });

    console.log(res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

});