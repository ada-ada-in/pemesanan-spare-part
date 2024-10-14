import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/database.js";
import { v6 as uuidv6 } from "uuid";
import {
  toLowerCase,
  toCapitalizeFirstWordCase,
  toTitleCase,
} from "../utils/textCase.js";

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
      set(value) {
        this.setDataValue("name", toTitleCase(value));
      },
    },
    email: {
      type: DataTypes.STRING(60),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value) {
        this.setDataValue("email", toLowerCase(value));
      },
    },
    alamat: {
      type: DataTypes.STRING(60),
      allowNull: true,
      set(value) {
        this.setDataValue("alamat", toCapitalizeFirstWordCase(value));
      },
    },
    no_hp: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "Datang",
    },
    role: {
      type: DataTypes.ENUM(["admin", "user"]),
      allowNull: false,
      set(value) {
        this.setDataValue("role", toLowerCase(value));
      },
    },
  },
  {
    sequelize,
    modelName: "users",
  }
);

export default UsersModels;
