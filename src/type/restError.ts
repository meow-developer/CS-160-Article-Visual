export abstract class RestError extends Error {
    abstract statusCode: number;
    abstract publicMessage: string;
}