import { test, expect } from "../fixtures/api.fixtures";
import { createBookingPayload } from "../test-data/booking.data";

test("Request for a nonexistent booking returns 404", async ({
    bookingApi
}) => {
    const response = await bookingApi.getBooking(0);

    expect(response.status()).toBe(404);
});

test("Invalid token cannot update an existing booking", async ({
    bookingApi,
    authApi
}) => {
    const token = await authApi.getToken();
    const createResponse = await bookingApi.createBooking(
        createBookingPayload()
    );

    expect(createResponse.status()).toBe(200);

    const body = await createResponse.json();
    const bookingId: number = body.bookingid;

    try {
        const response = await bookingApi.updateBooking(
            bookingId,
            createBookingPayload(),
            "invalid-token"
        );

        expect(response.status()).toBe(403);
    } finally {
        await bookingApi.deleteBooking(bookingId, token);
    }
});