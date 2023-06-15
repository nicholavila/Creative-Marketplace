import s3 from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const Bucket = process.env.NEXT_PUBLIC_AWS_AWS_BUCKET_NAME;

export const uploadFileToS3 = async (file: File) => {
  const Body = (await file.arrayBuffer()) as Buffer;

  const command = new PutObjectCommand({
    Bucket,
    Key: file.name,
    Body
  });

  try {
  } catch (error) {}
};
