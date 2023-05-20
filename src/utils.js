import Busboy from "busboy";
import { AllowedImageMimetypes } from '../src/common/constants/allowed-image-mimetype.constant.js'

export const peopleTranslatedKeys = {
    "starships": "naves_estelares",
    "edited": "editado",
    "name": "nombre",
    "created": "creado",
    "url": "url",
    "gender": "genero",
    "vehicles": "vehiculos",
    "skin_color": "color_de_piel",
    "hair_color": "color_de_cabello",
    "height": "alto",
    "eye_color": "color_de_ojos",
    "mass": "masa",
    "films": "peliculas",
    "species": "especies",
    "homeworld": "mundo_natal",
    "birth_year": "ano_de_nacimiento"
}

export function updateObjectKeys(obj, translatedKeys) {
    const data = JSON.stringify(obj);
    const mappedData = data.replace(/\"([^\"]+)\":/g, (match, name) => {
      return `"${translatedKeys[name] || name}":`;
    });
    return JSON.parse(mappedData);
}

export const formParser = async (event) =>
  new Promise((resolve, reject) => {
    const busboy = Busboy({
        headers: {
            'content-type':
            event.headers['content-type'] || event.headers['Content-Type']
        }
    });

    const result = {
        files: []
    };

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const uploadFile = {}
        file.on('data', data => {
            uploadFile.content = data
        });
        file.on('end', () => {
            if (uploadFile.content) {
                uploadFile.filename = filename
                uploadFile.contentType = mimetype
                uploadFile.encoding = encoding
                uploadFile.fieldname = fieldname
                result.files.push(uploadFile)
            }
        })
    })

    busboy.on('field', (fieldname, value) => {
        result[fieldname] = value
    });

    busboy.on('error', error => {
        reject(error)
    })

    busboy.on('finish', () => {
        resolve(result);
    })

    busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary')
    busboy.end()
})

export function isNullOrUndefined(target) {
    if (Array.isArray(target)) return target.length === 0;

    return target === null || target === undefined;
}

export function areNullOrUndefined(...targets) {
    // If _switch variable is false, objects are not null or undefined
    let _switch = false;

    targets.forEach((target) => {
      if (this.isNullOrUndefined(target)) return true;
    });

    return _switch;
}

export function validateMimetype(fileMimetype) {
    if (!AllowedImageMimetypes.includes(fileMimetype.toString())) {
        throw new Error("invalid mimetype")
    }
}