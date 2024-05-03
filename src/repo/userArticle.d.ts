import { UUID } from "crypto"

export type UserArticle = {
    ArticleId?: number,
    UserUUID: UUID | string
}