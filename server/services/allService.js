import { GenericServices } from "./genericService.js";
import UsersModels from "../models/user.model.js";
import MotorModels from "../models/motor.models.js";
import SparePartModels from "../models/sparePart.model.js";
import CartModels from "../models/cart.models.js";
import CartItemsModels from "../models/cartItems.models.js";

export const authService = new GenericServices(UsersModels);
export const motorService = new GenericServices(MotorModels);
export const sparePartService = new GenericServices(SparePartModels);
export const CartService = new GenericServices(CartModels);
export const CartItemService = new GenericServices(CartItemsModels);
