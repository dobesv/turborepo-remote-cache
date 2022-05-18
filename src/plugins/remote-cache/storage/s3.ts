import s3 from 's3-blob-store'
import aws from 'aws-sdk'

export interface S3Options {
  endpoint?: string
  bucket: string
}
export function createS3({ bucket, endpoint }: S3Options) {
  // Propagate "old" environment variables names to new ones for backwards compatibility
  for (const [oldName, newName] of Object.entries({
    S3_ACCESS_KEY: 'AWS_ACCESS_KEY_ID',
    S3_SECRET_KEY: 'AWS_SECRET_ACCESS_KEY',
    S3_REGION: 'AWS_REGION',
  })) {
    if (process.env[oldName] && !process.env[newName]) {
      process.env[newName] = process.env[oldName]
    }
  }

  const client = new aws.S3({
    ...(endpoint ? { endpoint: new aws.Endpoint(endpoint) } : {}),
    ...(process.env.NODE_ENV === 'test' ? { sslEnabled: false, s3ForcePathStyle: true } : {}),
  })

  const location = s3({
    client,
    bucket,
  })

  return location
}
