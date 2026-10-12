import { test, expect } from "../fixtures/api.fixtures";

test("Valid credentials should return an authentication token", async ({
    authApi
}) => {
    const response = await authApi.createToken({
        username: process.env.API_USERNAME!,
        password: process.env.API_PASSWORD!
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.token).toBeTruthy();
});

test("Invalid credentials should not return a token", async ({
    authApi
}) => {
    const response = await authApi.createToken({
        username: "invalid-user",
        password: "wrong-password"
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.token).toBeFalsy();
    expect(body.reason).toBe("Bad credentials");
});