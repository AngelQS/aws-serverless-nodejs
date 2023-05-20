import aws from 'aws-sdk';
import { v4 as uuid } from "uuid"
import { isNullOrUndefined } from '../../utils.js';
import { AWSS3ErrorCode } from '../../common/constants/aws-s3-error-code.constant.js'
import { AWSS3ErrorMessage  } from '../../common/constants/aws-s3-error-message.constant.js'
const { S3, DynamoDB } = aws

export class AWSService {
  s3
  dynamoDB
  bucketName

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
    this.dynamoDB = new DynamoDB({
      region: process.env.AWS_S3_BUCKET_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    })
    this.s3 = new S3({
      region: process.env.AWS_S3_BUCKET_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
  }

  async uploadFile(uploadFilePayload) {
    try {
      const uploadObjectParams = {
        Bucket: this.bucketName,
        Key: uploadFilePayload.file_key,
        Body: uploadFilePayload.buffer,
        ContentType: uploadFilePayload.mimetype
      };

      await this.s3.upload(uploadObjectParams).promise();

      const temporaryURL = await this.s3.getSignedUrlPromise("getObject", {
        Bucket: this.bucketName,
        Key: uploadObjectParams.Key,
        Expires: 604800, // 7 days in seconds
      })

      return temporaryURL
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFile(fileKey) {
    try {
      const getObjectParams = {
        Bucket: this.bucketName,
        Key: fileKey,
      };

      // Searching if object exists
      await this.s3.headObject(getObjectParams).promise();

      return this.s3.getObject(getObjectParams).promise();
    } catch (error) {
      if (!isNullOrUndefined(error['code'])) {
        if (error && error.code === AWSS3ErrorCode.NOT_FOUND) {
          throw new Error(AWSS3ErrorMessage.NOT_FOUND)
        } else if (error && error.code === AWSS3ErrorCode.FORBIDDEN) {
          throw new Error(AWSS3ErrorMessage.FORBIDDEN)
        } else {
          throw new Error(AWSS3ErrorCode.ERROR)
        }
      }
      throw error;
    }
  }

  async deleteFile(fileKey) {
    try {
      const deleteObjectParams = {
        Bucket: this.bucketName,
        Key: fileKey,
      };

      // Searching is object exists
      await this.s3.headObject(deleteObjectParams).promise();

      return this.s3.deleteObject(deleteObjectParams).promise();
    } catch (error) {
      if (!CommonUtil.isNullOrUndefined(error['code'])) {
        if (error && error.code === AWSS3ErrorCode.NOT_FOUND) {
          throw new Error(AWSS3ErrorMessage.NOT_FOUND)
        } else if (error && error.code === AWSS3ErrorCode.FORBIDDEN) {
          throw new Error(AWSS3ErrorMessage.FORBIDDEN)
        } else {
          throw new Error(AWSS3ErrorCode.ERROR);
        }
      }
      throw error;
    }
  }

  async deleteFolder(folderName) {
    try {
      const listObjectsParams = {
        Bucket: this.bucketName,
        Prefix: folderName,
      };

      const objectList = await this.s3
        .listObjectsV2(listObjectsParams)
        .promise();

      const deleteObjectsParams = {
        Bucket: this.bucketName,
        Delete: {
          Objects: objectList.Contents.map((file) => ({ Key: file.Key })),
        },
      };

      return this.s3.deleteObjects(deleteObjectsParams).promise();
    } catch (error) {
      if (!CommonUtil.isNullOrUndefined(error['code'])) {
        if (error && error.code === AWSS3ErrorCode.NOT_FOUND) {
          throw new Error(AWSS3ErrorMessage.NOT_FOUND)
        } else if (error && error.code === AWSS3ErrorCode.FORBIDDEN) {
          throw new Error(AWSS3ErrorMessage.FORBIDDEN)
        } else {
          throw new Error(AWSS3ErrorCode.ERROR)
        }
      }
      throw error;
    }
  }

  async createImage(createImagePayload) {
    const item = {}
    item["id"] = { S: uuid() }
    item["resource"] = { S: createImagePayload.resource }
    item["description"] = { S: createImagePayload.description }
    if (!isNullOrUndefined(createImagePayload.email)) {
      item["email"] = { S: createImagePayload.email }
    }
    item["filename"] = { S: createImagePayload.filename }
    item["file_path"] = { S: createImagePayload.file_path },
    item["temporal_access_url"] = { S: createImagePayload.temporal_access_url },
    item["temporal_access_url_expiration_date"] = { S: createImagePayload.temporal_access_url_expiration_date },
    item["scope_"] = { S: "public" }
    item["created_at"] = { S: createImagePayload.created_at }
    item["updated_at"] = { S: createImagePayload.updated_at }
    if (!isNullOrUndefined(createImagePayload.created_by)) {
      item["created_by"] = { S: createImagePayload.created_by }
    }
    if (!isNullOrUndefined(createImagePayload.updated_by)) {
      item["updated_by"] = { S: createImagePayload.updated_by }
    }
    
    console.log("item to be created", item)
    const putItemInput = {
      TableName: "images",
      Item: item
    }

    const image = await this.dynamoDB.putItem(putItemInput).promise()

    return image
  }

  async getImages() {
    const scanInput = {
      TableName: "images",
      FilterExpression: "scope_ = :sco",
      ExpressionAttributeValues : {
        ":sco": { S: "public" }
      }
    }

    const images = await this.dynamoDB.scan(scanInput).promise()

    return images
  }
}