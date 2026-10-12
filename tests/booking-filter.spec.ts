import { test, expect } from "../fixtures/api.fixtures";
import { createBookingPayload } from "../test-data/booking.data";

test("Filter bookings by first and last name", async ({
    bookingApi,
    authApi
}) => {
    const token = await authApi.getToken();
    const payload = createBookingPayload();

    const createResponse = await bookingApi.createBooking(payload);

    expect(createResponse.status()).toBe(200);

    const created = await createResponse.json();
    const bookingId: number = created.bookingid;

    try {
        const response = await bookingApi.getBookingIds({
            firstname: payload.firstname,
            lastname: payload.lastname
        });

        expect(response.status()).toBe(200);

        const results = (await response.json()) as {
            bookingid: number;
        }[];

        expect(results.some(item => item.bookingid === bookingId)).toBe(true);
    } finally {
        await bookingApi.deleteBooking(bookingId, token);
    }
});