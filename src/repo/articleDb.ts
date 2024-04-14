import { Prisma, PrismaClient } from '@prisma/client'

export default class ArticleDb {
    private static instance: ArticleDb;
    private db = new PrismaClient();

    private constructor() {

    }

    public static getInstance() {
        if (!ArticleDb.instance) {
            ArticleDb.instance = new ArticleDb();
        }
        return ArticleDb.instance;
    }

    public async insertArticle(article: Prisma.ArticlesCreateInput) {
        const articleCreate = await this.db.articles.create({
            "data": {
                "Title": article.Title,
                "StorageArticleUUID": article.StorageArticleUUID,
                "PdfFileSummary": article.PdfFileSummary,
                "Active": article.Active
            }
        })
        
        return articleCreate.ArticleID;
    }

    public async updateArticle(articleId: Prisma.ArticlesWhereUniqueInput["ArticleID"], 
                                article: Prisma.ArticlesUpdateInput) {
        await this.db.articles.update({
            "where": {
                "ArticleID": articleId
            },
            "data": {
                "Title": article.Title,
                "StorageArticleUUID": article.StorageArticleUUID,
                "Active": article.Active
            }
        })
    }
    public async getArticleById(articleId: Prisma.ArticlesWhereUniqueInput["ArticleID"]) {
        return await this.db.articles.findUnique({
            "where": {
                "ArticleID": articleId
            }
        })
    }
    public async countArticleByStorageUUID(storageArticleUUID: Prisma.ArticlesWhereUniqueInput["StorageArticleUUID"]) {
        return await this.db.articles.count({
            "where": {
                "StorageArticleUUID": storageArticleUUID
            }
        })
    }

    public async countArticleByArticleId(articleId: Prisma.ArticlesWhereUniqueInput["ArticleID"]) {
        return await this.db.articles.count({
            "where": {
                "ArticleID": articleId
            }
        })
    }

    public async deleteArticleById(articleId: Prisma.ArticlesDeleteArgs["where"]["ArticleID"]) {
        await this.db.articles.delete({
            "where": {
                "ArticleID": articleId
            }
        })
    }
    public async deleteArticleByStorageUUID(storageArticleUUID: Prisma.ArticlesDeleteArgs["where"]["StorageArticleUUID"]) {
        await this.db.articles.delete({
            "where": {
                "StorageArticleUUID": storageArticleUUID
            }
        })
    }
    public async getArticles(limit: number = 10) {
        return await this.db.articles.findMany({
            take: limit
        });
    }
}