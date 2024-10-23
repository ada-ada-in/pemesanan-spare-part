import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/database.js";
import { v6 as uuidv6 } from "uuid";
import UsersModels from "./user.model.js";
import { toTransactionNumber } from "../utils/transaksiNumber.js";

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
    transaksi_number: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: toTransactionNumber(),
    },
    price_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM(["belum-bayar", "inden", "sudah-datang", "lunas"]),
      allowNull: false,
      defaultValue: "belum-bayar",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
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
