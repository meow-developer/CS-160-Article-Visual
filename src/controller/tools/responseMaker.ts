import { RestResponse } from "../../type/restResponse.js"

export default class RestResponseMaker {
    public static makeSuccessResponse(data: {[key: string]: any} | string): RestResponse {
        return {
            success: true,
            errors: [],
            data: data
        }
    }

    public static makeErrorResponse(errors: Array<any>): RestResponse {
        return {
            success: false,
            errors: errors,
            data: {}
        }
    }
}