import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/database.js";
import { v6 as uuidv6 } from "uuid";
import { toTitleCase } from "../utils/textCase.js";
import MotorModels from "./motor.models.js";

class SparePartModels extends Model {}

SparePartModels.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv6,
      primaryKey: true,
      allowNull: false,
    },
    id_motor: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: MotorModels,
        key: "id",
      },
    },
    sparepart_name: {
      type: DataTypes.STRING(40),
      allowNull: false,
      set(value) {
        this.setDataValue("sparepart_name", toTitleCase(value));
      },
    },
    price: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "sparepart",
  }
);

MotorModels.hasMany(SparePartModels, { foreignKey: "id_motor" });
SparePartModels.belongsTo(MotorModels, { foreignKey: "id_motor" });

export default SparePartModels;
