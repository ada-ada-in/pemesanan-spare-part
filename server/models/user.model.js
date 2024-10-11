import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/database.js";
import { v6 as uuidv6 } from "uuid";

class UsersModels extends Model {}

UsersModels.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv6,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(60),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value) {
        this.setDataValue("email", value.toLowerCase());
      },
    },
    alamat: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    no_hp: {
      type: DataTypes.BIGINT(15),
      allowNull: true,
    },
    password: {
      type: DataTypes.ENUM(["Datang", "Berhalangan"]),
      allowNull: false,
      defaultValue: "Datang",
    },
    role: {
      type: DataTypes(["admin", "user"]),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ucapan",
  }
);

export default UsersModels;
