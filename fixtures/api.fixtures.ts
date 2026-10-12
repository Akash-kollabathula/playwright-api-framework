import { test as base, expect } from "@playwright/test";
import { AuthApi } from "../api/auth.api";
import { BookingApi } from "../api/booking.api";

type ApiFixtures = {
    authApi: AuthApi;
    bookingApi: BookingApi;
};

export const test = base.extend<ApiFixtures>({
    authApi: async ({ request }, use) => {
        await use(new AuthApi(request));
    },

    bookingApi: async ({ request }, use) => {
        await use(new BookingApi(request));
    }
});

export { expect };