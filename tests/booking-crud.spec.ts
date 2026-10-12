import { test, expect } from "../fixtures/api.fixtures";
import { createBookingPayload, updatedBookingPayload } from "../test-data/booking.data";
import {
    bookingSchema,
    createBookingResponseSchema
} from "../schemas/booking.schema";

test("Create, read, update, patch and delete a booking", async ({
    bookingApi,
    authApi
}) => {
    const token = await authApi.getToken();
    let bookingId: number | undefined;
    let deleted = false;

    try {
        // 1. Create
        const createResponse = await bookingApi.createBooking(
            createBookingPayload()
        );

        expect(createResponse.status()).toBe(200);

        const created = createBookingResponseSchema.parse(
            await createResponse.json()
        );

        bookingId = created.bookingid;
        expect(bookingId).toBeGreaterThan(0);

        // 2. Read
        const getResponse = await bookingApi.getBooking(bookingId);

        expect(getResponse.status()).toBe(200);

        const booking = bookingSchema.parse(await getResponse.json());

        expect(booking.firstname).toBe("Akash");
        expect(booking.lastname).toContain("Test");

        // 3. Full update
        const updatedPayload = updatedBookingPayload();

        const updateResponse = await bookingApi.updateBooking(
            bookingId,
            updatedPayload,
            token
        );

        expect(updateResponse.status()).toBe(200);

        const updated = bookingSchema.parse(await updateResponse.json());

        expect(updated.firstname).toBe(updatedPayload.firstname);
        expect(updated.totalprice).toBe(updatedPayload.totalprice);

        // 4. Partial update
        const patchResponse = await bookingApi.patchBooking(
            bookingId,
            { firstname: "PatchedAkash" },
            token
        );

        expect(patchResponse.status()).toBe(200);

        const patched = bookingSchema.parse(await patchResponse.json());

        expect(patched.firstname).toBe("PatchedAkash");
        expect(patched.lastname).toBe(updatedPayload.lastname);

        // 5. Delete
        const deleteResponse = await bookingApi.deleteBooking(
            bookingId,
            token
        );

        expect([200, 201, 204]).toContain(deleteResponse.status());
        deleted = true;

        // 6. Verify deletion
        const afterDelete = await bookingApi.getBooking(bookingId);

        expect(afterDelete.status()).toBe(404);
    } finally {
        // Cleanup if an earlier assertion failed
        if (bookingId !== undefined && !deleted) {
            await bookingApi.deleteBooking(bookingId, token);
        }
    }
});