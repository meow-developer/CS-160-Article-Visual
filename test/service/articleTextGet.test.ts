import ArticleTextGet from "../../src/service/articleTextGet";

describe("ArticleTextGet", ()=>{
    describe("get", ()=>{
        it("should return text from pdf", async ()=>{
            const ARTICLE_ID = 34;
            const articleTextGet = new ArticleTextGet(ARTICLE_ID);

            const result = await articleTextGet.get();
            console.log(result)

        }, 10000)
    })
})