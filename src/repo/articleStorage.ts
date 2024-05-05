import { open } from 'node:fs/promises';
import { ReadStream } from "fs";
import { S3Client, GetObjectCommand, DeleteObjectCommand, PutObjectCommand, S3ServiceException } from "@aws-sdk/client-s3";
import { PathLike } from 'node:fs';

export default class ArticleStorage {
    public static instance: ArticleStorage;
    private s3Client: S3Client;
    private bucketName: string = "";

    private constructor() {
        const awsBucketConfig = this.loadEnvBucketConfig();
        this.bucketName = awsBucketConfig[0];
        this.s3Client = new S3Client({
            region: awsBucketConfig[1]
        });
    }

    public static getInstance(): ArticleStorage {
        if (!this.instance) {
            this.instance = new ArticleStorage();
        }
        return this.instance;
    }


    private async articleFileToStream(articlePath: PathLike): Promise<ReadStream> {
        const file = await open(articlePath, 'r');
        return file.createReadStream();
    }

    public async saveArticle(
        articleUUID: string,
        articleFilePath: PathLike
    ) {

        /**
         * @see {@link https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_PutObject_section.html}
         */
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: articleUUID,
            Body: await this.articleFileToStream(articleFilePath)
        });

        await this.s3Client.send(command);

    }

    public async deleteArticle(articleUUID: string) {
        /**
         * @see {@link https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_DeleteObject_section.html}
         */
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: articleUUID,
        });

        await this.s3Client.send(command);
    }

    public async getArticle(articleUUID: string): Promise<Uint8Array> {
        /**
         * @see {@link https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_GetObject_section.html}
         */
        const command: GetObjectCommand = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: articleUUID,
        });

        const response = await this.s3Client.send(command);
        const responseByteArray = await response.Body?.transformToByteArray();
        return responseByteArray!;
    }

    private loadEnvBucketConfig() {
        const ARTICLE_BUCKET_NAME_ENV_KEY = "AWS_ARTICLE_BUCKET_NAME";
        const ARTICLE_BUCKET_REGION_ENV_KEY = "AWS_ARTICLE_BUCKET_REGION";

        const envBucketName = process.env[ARTICLE_BUCKET_NAME_ENV_KEY];
        const envBucketRegion = process.env[ARTICLE_BUCKET_REGION_ENV_KEY];

        if (!envBucketName || !envBucketRegion) {
            throw new Error("Missing AWS environment variables");
        }

        return [
            envBucketName,
            envBucketRegion
        ]
    }
}