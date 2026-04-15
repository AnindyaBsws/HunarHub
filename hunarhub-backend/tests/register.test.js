import request from "supertest";
import app from "../server.js";

describe("Register API", () => {

  it("should register a new user", async () => {

    const uniqueEmail = `test${Date.now()}@example.com`;

    const res = await request(app)
      .post("/api/users/register")
      .send({
        name: "Test User",
        email: uniqueEmail,
        password: "123456"
      });

    console.log(res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

});