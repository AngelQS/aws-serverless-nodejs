'use strict';
import { v4 as uuid } from "uuid"
import { makeRequest } from "./src/http-client.js";
import { uploadFile } from "./src/modules/object-storage/object-storage.service.js";
import { formParser, peopleTranslatedKeys, updateObjectKeys } from "./src/utils.js";
import ImageRepository from "./src/repositories/image.repository.js"
import { AWSService } from "./src/modules/aws/aws.service.js";

export async function getSWPeople(event, context, callback) {
  console.log("event", event)
  const url = process.env.SWAPI_GET_PEOPLE_URL
  const method = "GET"
  const body = null
  const starWarsData = await makeRequest(url, method, body)
  const translatedData = starWarsData.body.results.map((item) => updateObjectKeys(item, peopleTranslatedKeys))
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      personas: translatedData
    }),
  };

  return callback(null, response)
}

export async function getSWPeopleById(event, context, callback) {
  console.log("event", event)
  const personId = event.queryStringParameters.person_id
  const url = String(process.env.SWAPI_GET_PEOPLE_BY_ID).replace("{person-id}", String(personId))
  const method = "GET"
  const body = null
  const starWarsData = await makeRequest(url, method, body)
  const translatedData = updateObjectKeys(starWarsData, peopleTranslatedKeys)
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      persona: translatedData.body
    }),
  };

  return callback(null, response)
}

export async function createPublicImageMySQL(event, context, callback) {
  console.log("event", event)
  const formData = await formParser(event)
  const file = formData.files[0]

  const file_path = "/images/public/" + uuid() + "-" + file.filename.filename.split(".")[0]

  const uploadFileRequest = {
    file_key: file_path,
    buffer: Buffer.from(file.content),
    mimetype: file.filename.mimeType
  }

  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 7);

  const temporaryURL = await uploadFile(uploadFileRequest)

  const createPublicImagePayload = {
    resource: formData.resource,
    description: formData.description,
    email: formData.email || null,
    filename: file.filename.filename,
    file_path: file_path,
    temporal_access_url: temporaryURL,
    temporal_access_url_expiration_date: expirationDate,
    created_at: new Date(),
    updated_at: new Date(),
    created_by: formData.email || null,
    updated_by: formData.email || null
  }

  const imageRepository = new ImageRepository()
  const createdImage = await imageRepository.createPublicImage(createPublicImagePayload)
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({
        message: 'OK',
        data: createdImage
      }),
  };

  return callback(null, response)
}

export async function getPublicImagesMySQL(event, context, callback) {
  console.log("event", event)

  const imageRepository = new ImageRepository()

  const images = await imageRepository.getPublicImages()
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({
        message: 'OK',
        data: images
      }),
  };

  return callback(null, response)
}

export async function deletePublicImagesMySQL(event, context, callback) {
  console.log("event", event)

  const imageRepository = new ImageRepository()

  await imageRepository.deletePublicImages()
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({
        message: 'OK'
      }),
  };

  return callback(null, response)
}

export async function createPublicImageDynamoDB(event, context, callback) {
  console.log("event", event)
  const formData = await formParser(event)
  const file = formData.files[0]

  const file_path = "/images/public/" + uuid() + "-" + file.filename.filename.split(".")[0]

  const uploadFileRequest = {
    file_key: file_path,
    buffer: Buffer.from(file.content),
    mimetype: file.filename.mimeType
  }

  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 7);

  const temporaryURL = await uploadFile(uploadFileRequest)

  const createPublicImagePayload = {
    resource: formData.resource,
    description: formData.description,
    email: formData.email || null,
    filename: file.filename.filename,
    file_path: file_path,
    temporal_access_url: temporaryURL,
    temporal_access_url_expiration_date: expirationDate.toString(),
    created_at: new Date().toString(),
    updated_at: new Date().toString(),
    created_by: formData.email || null,
    updated_by: formData.email || null
  }

  const awsService = new AWSService()
  const createdImage = await awsService.createImage(createPublicImagePayload)

  const response = {
    statusCode: 200,
    body: JSON.stringify({
        message: 'OK',
        data: createdImage
      }),
  };

  return callback(null, response)
}

export async function getPublicImagesDynamoDB(event, context, callback) {
  console.log("event", event)

  const awsService = new AWSService()
  const images = await awsService.getImages()

  const response = {
    statusCode: 200,
    body: JSON.stringify({
        message: 'OK',
        data: images
      }),
  };

  return callback(null, response)
}