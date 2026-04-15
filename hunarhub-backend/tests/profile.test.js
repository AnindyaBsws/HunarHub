import request from "supertest";
import app from "../server.js";

describe("profile API", () => {
    it("should access protected route with valid token", async () => {

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

        const accessToken = loginRes.body.accessToken;

        //Access Profile(Protected route by token)
        const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${accessToken}`);

        console.log(res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("user");


    });
});