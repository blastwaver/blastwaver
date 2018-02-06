export interface Message {
    from: string;
    to: string | Array<string>;
    type: string;
    message: string;
    read?: boolean;
    contents?: any;
}