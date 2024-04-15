export type RestResponse = {
    success: boolean;
    errors: Array<any>;
    data: {[key: string]: any} | string;
}