import { DataTypes } from "sequelize"
import { sequelize } from "../mysql-db.js"

export const Image = sequelize.define("Image", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    resource:DataTypes.STRING,
    description: DataTypes.STRING,
    email: DataTypes.STRING,
    filename: DataTypes.STRING,
    file_path: DataTypes.STRING,
    temporal_access_url: DataTypes.STRING,
    temporal_access_url_expiration_date: DataTypes.DATE,
    scope: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
        
}, { tableName: "images", timestamps: false })