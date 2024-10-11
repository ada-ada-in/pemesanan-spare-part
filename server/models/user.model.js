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
      type: DataTypes.STRING(50),
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
    },
  },
  {
    sequelize,
    modelName: "users",
  }
);

export default UsersModels;
