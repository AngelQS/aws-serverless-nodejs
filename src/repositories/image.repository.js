import { Image } from "../models/image.models.js"

export default class ImageRepository {

    constructor() {}

    async getAllImages() {
        const images = await Image.findAll()
        
        return images
    }

    async getPublicImages() {
        const images = await Image.findAll({
            where: {
                scope: "public"
            }
        })

        return images
    }

    async deletePublicImages() {
        await Image.destroy({
            where: {
                scope: "public"
            },
            truncate: true
        })
    }

    async createPublicImage(createPublicImagePayload) {
        const image = await Image.create({
            resource: createPublicImagePayload.resource,
            description: createPublicImagePayload.description,
            email: createPublicImagePayload.email,
            filename: createPublicImagePayload.filename,
            file_path: createPublicImagePayload.file_path,
            temporal_access_url: createPublicImagePayload.temporal_access_url,
            temporal_access_url_expiration_date: createPublicImagePayload.temporal_access_url_expiration_date,
            scope: "public",
            created_at: createPublicImagePayload.created_at,
            updated_at: createPublicImagePayload.updated_at,
            created_by: createPublicImagePayload.created_by,
            updated_by: createPublicImagePayload.updated_by
        })

        return image
    }
}