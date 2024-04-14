import { UUID } from "crypto"

export type Article = {
    Title: string,
    StorageArticleUUID: UUID | string,
    Active: boolean,
    ArticleID?: number,
    PdfFileSummary: string
}