import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: import.meta.env.VITE_APP_ACCESSKEYID,
  secretAccessKey: import.meta.env.VITE_APP_SECRET_ACCESSKEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: import.meta.env.VITE_APP_BUCKET },
  region: import.meta.env.VITE_APP_REGION,
});

export { myBucket };
