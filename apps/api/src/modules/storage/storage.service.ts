import { Injectable } from '@nestjs/common'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable()
export class StorageService {
	private readonly s3 = new S3Client({
		region: process.env.S3_REGION || 'us-east-1',
		endpoint: process.env.S3_ENDPOINT,
		forcePathStyle: (process.env.S3_FORCE_PATH_STYLE || 'true') === 'true',
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
		},
	})

	async presignPut(key: string, contentType = 'application/octet-stream') {
		const bucket = process.env.S3_BUCKET || 'evidence'
		const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType })
		const url = await getSignedUrl(this.s3, command, { expiresIn: 300 })
		return { url, bucket, key }
	}
}