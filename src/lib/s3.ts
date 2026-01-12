import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true, // Required for MinIO and other S3-compatible services
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'business-control'

export async function uploadToS3(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `uploads/${uuidv4()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  )

  // Return a URL that can be used to access the file
  // For production, this would be a CDN URL or signed URL
  if (process.env.S3_ENDPOINT?.includes('localhost')) {
    return `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${key}`
  }

  return `https://${BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`
}

export async function getSignedUploadUrl(fileName: string, contentType: string): Promise<{
  uploadUrl: string
  fileUrl: string
}> {
  const key = `uploads/${uuidv4()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

  const fileUrl = process.env.S3_ENDPOINT?.includes('localhost')
    ? `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${key}`
    : `https://${BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`

  return { uploadUrl, fileUrl }
}

export async function getSignedDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  return getSignedUrl(s3Client, command, { expiresIn: 3600 })
}
