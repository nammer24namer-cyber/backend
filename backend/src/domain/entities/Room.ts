export enum RoomStatus {
    AVAILABLE = 'AVAILABLE',
    OCCUPIED = 'OCCUPIED',
    MAINTENANCE = 'MAINTENANCE',
    DIRTY = 'DIRTY'
}

export class RoomType {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public capacity: number,
        public basePrice: number
    ) { }
}

export class Room {
    constructor(
        public id: number,
        public roomNumber: string,
        public type: RoomType,
        public status: RoomStatus = RoomStatus.AVAILABLE
    ) { }

    isAvailable(): boolean {
        return this.status === RoomStatus.AVAILABLE;
    }
}
