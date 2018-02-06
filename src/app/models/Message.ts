export interface Message {
    type: string;
    room: string;
    time: Date;
    message: string;
    content?: any;
}