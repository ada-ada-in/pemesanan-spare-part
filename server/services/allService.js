import { GenericServices } from "./genericService.js";
import UsersModels from "../models/user.model.js";
import MotorModels from "../models/motor.models.js";

export const authService = new GenericServices(UsersModels);
export const motorService = new GenericServices(MotorModels);
