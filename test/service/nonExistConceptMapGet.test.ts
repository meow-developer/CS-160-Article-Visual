import { Request } from "express";
import NonExistConceptMapGet from "../../src/service/nonExistConceptMapGet";

describe("NonExistConceptMapGet", () => {
    describe("getArticleFromStorage", () => {
        const ARTICLE_ID = 34;
        const nonExistConceptMapGet = new NonExistConceptMapGet(ARTICLE_ID, {} as Request);
    });

});
