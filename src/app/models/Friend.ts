
export interface Friend {
    _id: string;
    username: string;
    email: string;
    photoUrl: string;
    comment: boolean;
    createdAt?: Date;
    connected?: boolean;
    status?:string;
    chatRoom:string;
}