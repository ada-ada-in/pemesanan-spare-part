import { Model, DataTypes } from "sequelize";
import { sequelize } from "../configs/database.js";
import { v6 as uuidv6 } from "uuid";

class MotorModels extends Model {}

MotorModels.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv6,
      primaryKey: true,
      allowNull: false,
    },
    motor_name: {
      type: DataTypes.STRING(40),
      allowNull: false,
      set(value) {
        this.setDataValue("motor_name", value.toLowerCase());
      },
    },
    tahun: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "motor",
  }
);

export default MotorModels;
