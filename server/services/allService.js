import { GenericServices } from "./genericService.js";
import UsersModels from "../models/user.model.js";

export const authService = new GenericServices(UsersModels);
