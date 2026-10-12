import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    testDir: "./tests",
    timeout: 30_000,
    expect: {
        timeout: 5_000
    },
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : undefined,

    reporter: [
        ["list"],
        ["html", { outputFolder: "playwright-report", open: "never" }]
    ],

    use: {
        baseURL:
            process.env.BASE_URL ??
            "https://restful-booker.herokuapp.com",
        extraHTTPHeaders: {
            Accept: "application/json"
        },
        trace: "retain-on-failure"
    }
});