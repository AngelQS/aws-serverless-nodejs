import { validateMimetype } from "../../utils.js"
import { AWSService } from "../aws/aws.service.js"

export async function uploadFile(uploadFileRequest) {
    const { file_key, buffer, mimetype } = uploadFileRequest

    validateMimetype(mimetype)

    const uploadFilePayload = {
        file_key: file_key,
        buffer: buffer,
        mimetype: mimetype
    }

    const awsService = new AWSService()
    const temporaryURL = await awsService.uploadFile(uploadFilePayload)
    return temporaryURL
}