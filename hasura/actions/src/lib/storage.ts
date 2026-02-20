import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import type { AppContext } from "../config/context";

let s3: S3Client | null = null;

function getS3(context: AppContext): S3Client {
  if (!s3) {
    s3 = new S3Client({
      endpoint: context.env.MINIO_ENDPOINT,
      region: "us-east-1",
      credentials: {
        accessKeyId: context.env.MINIO_ACCESS_KEY,
        secretAccessKey: context.env.MINIO_SECRET_KEY,
      },
      forcePathStyle: true,
    });
  }
  return s3;
}

export async function uploadFile(
  key: string,
  body: Buffer,
  contentType: string,
  context: AppContext,
): Promise<void> {
  const client = getS3(context);
  await client.send(
    new PutObjectCommand({
      Bucket: context.env.MINIO_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

export async function deleteFile(
  key: string,
  context: AppContext,
): Promise<void> {
  const client = getS3(context);
  await client.send(
    new DeleteObjectCommand({
      Bucket: context.env.MINIO_BUCKET,
      Key: key,
    }),
  );
}
