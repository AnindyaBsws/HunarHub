import request from "supertest";
import app from '../server.js';

describe("Login API", () => {
    it("should login user and return tokens", async () => {
        const email = `test${Date.now()}@example.com`;
        const password = '123456';

        //Register User
        await request(app).post("/api/users/register").send({
            name: "Test User",
            email,
            password
        });

        //Login User
        const res = await request(app)
            .post("/api/users/login")
            .send({
                email,
                password
            });
        
        console.log(res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");

    });
});