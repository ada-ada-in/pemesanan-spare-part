import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/database.js";
import { v6 as uuidv6 } from "uuid";
import CartModels from "./cart.models.js";
import SparePartModels from "./sparePart.model.js";

class CartItemsModels extends Model {}

CartItemsModels.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv6,
      primaryKey: true,
      allowNull: false,
    },
    id_cart: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: CartModels,
        key: "id",
      },
    },
    id_sparepart: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: SparePartModels,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "cartitems",
  }
);

CartModels.hasMany(CartItemsModels, { foreignKey: "id_cart" });
CartItemsModels.belongsTo(CartModels, { foreignKey: "id_cart" });
SparePartModels.hasMany(CartItemsModels, { foreignKey: "id_sparepart" });
CartItemsModels.belongsTo(SparePartModels, { foreignKey: "id_sparepart" });

export default CartItemsModels;
