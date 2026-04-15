import request from "supertest";
import app from "../server.js";

describe("Refresh Token Reuse Attack", () => {

  it("should detect reuse of refresh token after logout", async () => {

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

    // Logout (deletes token)
    await request(app)
      .post("/api/users/logout")
      .send({
        refreshToken
      });

    // Try to reuse same refresh token
    const res = await request(app)
      .post("/api/users/refresh")
      .set("Authorization", `Bearer ${refreshToken}`);

    console.log(res.body);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Token reuse detected. All sessions revoked.");
  });

});