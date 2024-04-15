import { UUID } from "crypto"

export type Diagram = {
    ArticleID: number,
    StorageDiagramName: UUID | string,
    Active: boolean
}