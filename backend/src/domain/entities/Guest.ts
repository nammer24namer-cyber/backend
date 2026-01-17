import { User, UserRole } from './User';

export class Guest extends User {
    constructor(
        id: number,
        name: string,
        email: string,
        passwordHash: string,
        public phoneNumber: string,
        public passportNumber: string
    ) {
        super(id, name, email, passwordHash, UserRole.GUEST);
    }
}
