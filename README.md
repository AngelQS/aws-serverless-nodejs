
# AWS Serverless con Node.js


A continuación se muestra la configuración de funciones en AWS Serverless con Node.js:

```bash
provider:
  name: aws
  runtime: nodejs18.x

functions:
  getSWPeopleById:
    handler: handler.getSWPeopleById
    timeout: 60
    events:
      - http:
          method: get
          path: /getSWPeopleById

  getSWPeople:
    handler: handler.getSWPeople
    timeout: 60
    events:
      - http:
          method: get
          path: /getSWPeople

  createPublicImageMySQL:
    handler: handler.createPublicImageMySQL
    timeout: 60
    events:
      - http:
          method: post
          path: /mysql/image/public

  getPublicImagesMySQL:
    handler: handler.getPublicImagesMySQL
    timeout: 60
    events:
      - http:
          method: get
          path: /mysql/image/public

  deletePublicImagesMySQL:
    handler: handler.deletePublicImagesMySQL
    timeout: 60
    events:
      - http:
          method: delete
          path: /mysql/image/public

  createPublicImageDynamoDB:
    handler: handler.createPublicImageDynamoDB
    timeout: 60
    events:
      - http:
          method: post
          path: dynamo/image/public

  getPublicImagesDynamoDB:
    handler: handler.getPublicImagesDynamoDB
    timeout: 60
    events:
      - http:
          method: get
          path: dynamo/image/public
```

## Funciones

Esta configuración contiene siete funciones diferentes que se pueden desplegar en AWS Lambda utilizando el framework Serverless. Las funciones están descritas a continuación:

### Función getSWPeopleById
Esta función maneja una solicitud HTTP GET en la ruta /getSWPeopleById y llama al manejador getSWPeopleById en el archivo handler.js. Esta función está diseñada para obtener un personaje de Star Wars por su identificador desde la API [swapi](https://swapi.py4e.com/). La función tiene un tiempo de espera de 60 segundos.

### Función getSWPeople
Esta función maneja una solicitud HTTP GET en la ruta /getSWPeople y llama al manejador getSWPeople en el archivo handler.js. Esta función está diseñada para obtener el listado de personajes de Star Wars de la API [swapi](https://swapi.py4e.com/) La función tiene un tiempo de espera de 60 segundos.


### Función createPublicImageMySQL
Esta función maneja una solicitud HTTP POST en la ruta `/mysql/image y llama al manejador createPublicImageMySQL en el archivo handler.js. Esta función está diseñada para crear una nueva imagen y almacenarla en una base de datos MySQL en AWS. La función tiene un tiempo de espera de 60 segundos.

### Función getPublicImagesMySQL

Esta función maneja una solicitud HTTP GET en la ruta /mysql/image/public y llama al manejador getPublicImagesMySQL en el archivo handler.js. Esta función está diseñada para recuperar imágenes almacenadas en una base de datos MySQL en AWS. La función tiene un tiempo de espera de 60 segundos.

### Función deletePublicImagesMySQL

Esta función maneja una solicitud HTTP DELETE en la ruta /mysql/image/public y llama al manejador deletePublicImagesMySQL en el archivo handler.js. Esta función está diseñada para eliminar imágenes de una base de datos MySQL en AWS. La función tiene un tiempo de espera de 60 segundos.

### Función createPublicImageDynamoDB

Esta función maneja una solicitud HTTP POST en la ruta /dynamo/image/public y llama al manejador createPublicImageDynamoDB en el archivo handler.js. Esta función está diseñada para crear una nueva imagen y almacenarla en una tabla DynamoDB en AWS. La función tiene un tiempo de espera de 60 segundos.

### Función getPublicImagesDynamoDB

Esta función maneja una solicitud HTTP GET en la ruta /dynamo/image/public y llama al manejador getPublicImagesDynamoDB en el archivo handler.js. Esta función está diseñada para recuperar imágenes almacenadas en una tabla DynamoDB en AWS. La función tiene un tiempo de espera de 60 segundos.

## Deployment

To deploy this project run

```bash
  npm run deploy
```

## API Reference

Root endpoint: ```http https://px38wcl3s4.execute-api.us-east-1.amazonaws.com/dev```

#### Get single person

```http
  GET {root-endpoint}/getSWPeopleById?person_id={person_id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `person_id` | `string` | **Required**. Person ID |

#### Get People

```http
  GET {root-endpoint}/getSWPeople
```

#### Create Public Image (MySQL)

```http
  POST {root-endpoint}/mysql/image/public
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `file` | `file` | **Required**. Image of any resource for swapi |
| `resource` | `string` | **Required**. Resource reference |
| `description` | `string` | **Required**. Image description |

#### Get Public Images (MySQL)

```http
  GET {root-endpoint}/mysql/image/public
```

#### Delete Public Images (MySQL)

```http
  DELETE {root-endpoint}/mysql/image/public
```

#### Create Public Image (DynamoDB)

```http
  POST {root-endpoint}/dynamo/image/public
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `file` | `file` | **Required**. Image of any resource for swapi |
| `resource` | `string` | **Required**. Resource reference |
| `description` | `string` | **Required**. Image description |

#### Get Public Images (DynamoDB)

```http
  POST {root-endpoint}/dynamo/image/public
```
