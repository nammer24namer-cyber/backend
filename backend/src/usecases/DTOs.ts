export interface CreateBookingDTO {
    guestId: number;
    roomId: number;
    checkInDate: string; // ISO Date string
    checkOutDate: string; // ISO Date string
}
