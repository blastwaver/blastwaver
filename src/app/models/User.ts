
export interface User {
    _id?: string;
    googleId: string;
    username: string;
    email: string;
    photoUrl: string;
    cProfile?: boolean;
    // favoriteColor?:string;
}