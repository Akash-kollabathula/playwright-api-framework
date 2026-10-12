import type { APIRequestContext } from "@playwright/test";
import type { AuthRequest, AuthResponse } from "../types/booking.types";

export class AuthApi {
    constructor(private readonly request: APIRequestContext) {}

    async createToken(credentials: AuthRequest) {
        return this.request.post("/auth", {
            data: credentials
        });
    }

    async getToken(): Promise<string> {
        const username = process.env.API_USERNAME;
        const password = process.env.API_PASSWORD;

        if (!username || !password) {
            throw new Error("API credentials are missing from .env");
        }

        const response = await this.createToken({ username, password });

        if (!response.ok()) {
            throw new Error(
                `Token request failed with status ${response.status()}`
            );
        }

        const body = (await response.json()) as AuthResponse;

        if (!body.token) {
            throw new Error(
                `Authentication failed: ${body.reason ?? "No token returned"}`
            );
        }

        return body.token;
    }
}