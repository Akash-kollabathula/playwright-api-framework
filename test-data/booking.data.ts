import type { BookingRequest } from "../types/booking.types";

export function createBookingPayload(): BookingRequest {
    return {
        firstname: "Akash",
        lastname: `Test${Date.now()}`,
        totalprice: 1500,
        depositpaid: true,
        bookingdates: {
            checkin: "2027-01-10",
            checkout: "2027-01-15"
        },
        additionalneeds: "Breakfast"
    };
}

export function updatedBookingPayload(): BookingRequest {
    return {
        firstname: "UpdatedAkash",
        lastname: `Updated${Date.now()}`,
        totalprice: 2000,
        depositpaid: false,
        bookingdates: {
            checkin: "2027-02-10",
            checkout: "2027-02-15"
        },
        additionalneeds: "Lunch"
    };
}