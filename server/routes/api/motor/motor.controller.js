import * as allService from "../../../services/allService.js";
import ResponseHandler from "../../../utils/response.js";

export const createMotor = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { motor_name, tahun } = req.body;
    if (!motor_name || motor_name.trim() === "") {
      return response.fail400("Please insert motor name");
    }
    if (!tahun || tahun === null) {
      return response.fail400("Please insert year");
    }
    const motorNameCheck = await allService.motorService.getMotorNameCheck(
      motor_name
    );
    const yearMotorCheck = await allService.motorService.getMotorYearCheck(
      tahun
    );
    if (motorNameCheck && yearMotorCheck) {
      return response.fail400(
        "Motor with this name and year already exists in the data"
      );
    }
    const createNewMotor = await allService.motorService.create({
      motor_name,
      tahun,
    });
    return response.success201(createNewMotor);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getMotor = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const getDataMotor = await allService.motorService.getData();
    if (!getDataMotor) {
      return response.fail400("fail to get motor data");
    }
    return response.success200(getDataMotor);
  } catch (error) {
    return response.fail500(error.message);
  }
};
