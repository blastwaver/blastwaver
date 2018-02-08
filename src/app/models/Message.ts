export interface Message {
    _id?: string;
    from: string;
    to: string|Array<string>;
    type: string;
    message: string;
    read?: boolean;
    contents?: any;
}