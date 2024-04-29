import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { open } from 'node:fs/promises';
import "dotenv/config";

class DiagramStorage {
    /**
     * @type {DiagramStorage}
     */
    static instance;
    bucketName = "";
    s3Client;

    constructor() {
        const awsBucketConfig = this._loadEnvBucketConfig();
        this.bucketName = awsBucketConfig[0];
        this.s3Client = new S3Client({
            region: awsBucketConfig[1]
        });
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new DiagramStorage();
        }
        return this.instance;
    }

    _loadEnvBucketConfig() {
        const DIAGRAM_BUCKET_REGION_ENV_KEY = "AWS_DIAGRAM_BUCKET_REGION";
        const DIAGRAM_BUCKET_NAME_ENV_KEY = "AWS_DIAGRAM_BUCKET_NAME";

        const envBucketRegion  = process.env[DIAGRAM_BUCKET_REGION_ENV_KEY];
        const envBucketName = process.env[DIAGRAM_BUCKET_NAME_ENV_KEY];

        if (!envBucketName || !envBucketRegion) {
            throw new Error("Missing AWS environment variables");
        }

        return [
            envBucketName,
            envBucketRegion
        ]
    }

    /**
     * @param {string} storageDiagramUUID
     */
    async getDiagram(storageDiagramUUID) {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: storageDiagramUUID,
        });

        const response = await this.s3Client.send(command);
        const responseStream = await response.Body?.transformToWebStream();
        return responseStream;
    }

    /**
     * @param {import("fs").PathLike} diagramPath
     */
    async diagramFileToStream(diagramPath) {
        const file = await open(diagramPath, 'r');
        return file.createReadStream();
    }

    /**
     * @param {string | import('crypto').UUID} diagramUUID
     * @param {string} diagramFilePath
     */
    async saveDiagram(diagramUUID, diagramFilePath) {

        /**
         * @see {@link https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_PutObject_section.html}
         */
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: diagramUUID + ".mdd",
            Body: await this.diagramFileToStream(diagramFilePath)
        });

        await this.s3Client.send(command);

    }

    /**
     * @param {string | import('crypto').UUID} diagramUUID
     */
    async deleteDiagram(diagramUUID) {
        /**
         * @see {@link https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_DeleteObject_section.html}
         */
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: diagramUUID,
        });

        await this.s3Client.send(command);
    }
}

export default DiagramStorage;
