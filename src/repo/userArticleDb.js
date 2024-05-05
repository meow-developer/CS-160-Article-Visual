// @ts-nocheck
import { Prisma } from '@prisma/client'
import prismaClient from './db.js';

class UserArticleDb {
    /**
     * @type {UserArticleDb}
     */
    static instance;
    db = prismaClient;

    constructor() {
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new UserArticleDb();
        }
        return this.instance;
    }

    /**
     * @param {number | undefined} articleId
     * @param {string} userId
     */
    async countUserArticlesId(articleId, userId) {
        return await this.db.userArticle.count({
            where: {
                "ArticleId": articleId,
                "UserUUID": userId
            }
        })
    }
}
export default UserArticleDb;