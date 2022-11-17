import pkg from "aws-sdk";
const { S3 } = pkg;

export class S3Service {
  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
  }

  async upload(file) {
    const params = {
      Bucket: `${process.env.AWS_S3_BUCKET_NAME}/restaurants`,
      Key: file.name,
      Body: file.data,
    };
    const upload = await this.s3.upload(params).promise();

    return upload;
  }
}
