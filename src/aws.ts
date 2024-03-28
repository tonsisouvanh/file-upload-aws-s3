import AWS from "aws-sdk";
// AWS configuration for access key and secret access key 
AWS.config.update({
  accessKeyId: import.meta.env.VITE_APP_ACCESSKEYID,
  secretAccessKey: import.meta.env.VITE_APP_SECRET_ACCESSKEY,
});

// Create S3 service object
const s3Bucket = new AWS.S3({
  params: { Bucket: import.meta.env.VITE_APP_BUCKET },
  region: import.meta.env.VITE_APP_REGION,
});

export { s3Bucket };
