import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/database.js";
import { v6 as uuidv6 } from "uuid";
import MotorModels from "./motor.models.js";
import SparePartModels from "./sparePart.model.js";
import UsersModels from "./user.model.js";

class CartModels extends Model {}

CartModels.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv6,
      primaryKey: true,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UsersModels,
        key: "id",
      },
    },
    price_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM(["inden", "sudah-datang", "lunas"]),
      allowNull: false,
      defaultValue: "inden",
    },
  },
  {
    sequelize,
    modelName: "cart",
  }
);

UsersModels.hasMany(CartModels, { foreignKey: "id_user" });
CartModels.belongsTo(UsersModels, { foreignKey: "id_user" });

export default CartModels;
