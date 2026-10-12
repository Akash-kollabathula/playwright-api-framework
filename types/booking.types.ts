export type BookingDates = {
    checkin: string;
    checkout: string;
};

export type BookingRequest = {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds?: string;
};

export type BookingResponse = BookingRequest & {
    bookingid: number;
};

export type BookingId = {
    bookingid: number;
};

export type AuthRequest = {
    username: string;
    password: string;
};

export type AuthResponse = {
    token?: string;
    reason?: string;
};