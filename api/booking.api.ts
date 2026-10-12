import type { APIRequestContext } from "@playwright/test";
import type { BookingRequest } from "../types/booking.types";

export class BookingApi {
    constructor(private readonly request: APIRequestContext) {}

    async getBookingIds(params?: {
        firstname?: string;
        lastname?: string;
        checkin?: string;
        checkout?: string;
    }) {
        return this.request.get("/booking", { params });
    }

    async getBooking(id: number) {
        return this.request.get(`/booking/${id}`);
    }

    async createBooking(data: BookingRequest) {
        return this.request.post("/booking", { data });
    }

    async updateBooking(id: number, data: BookingRequest, token: string) {
        return this.request.put(`/booking/${id}`, {
            data,
            headers: {
                Cookie: `token=${token}`
            }
        });
    }

    async patchBooking(
        id: number,
        data: Partial<BookingRequest>,
        token: string
    ) {
        return this.request.patch(`/booking/${id}`, {
            data,
            headers: {
                Cookie: `token=${token}`
            }
        });
    }

    async deleteBooking(id: number, token: string) {
        return this.request.delete(`/booking/${id}`, {
            headers: {
                Cookie: `token=${token}`
            }
        });
    }
}