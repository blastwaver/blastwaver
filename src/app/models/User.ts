
export interface User {
    _id?: string;
    googleId?: string;
    username: string;
    email: string;
    photoUrl: string;
    comment: string;
    cProfile?: boolean;
}