export enum UserRole {
    GUEST = 'GUEST',
    STAFF = 'STAFF',
    ADMIN = 'ADMIN'
}

export class User {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public passwordHash: string,
        public role: UserRole
    ) { }
}
