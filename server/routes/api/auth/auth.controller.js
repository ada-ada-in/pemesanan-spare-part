import * as allService from "../../../services/allService.js";
import ResponseHandler from "../../../utils/response.js";
import { encrypt } from "../../../utils/encrypt.js";

const response = new ResponseHandler();

export const register = async (req, res) => {
  try {
    const { name, email, password, confPassword, role, alamat, no_hp } =
      req.body;
    if (password !== confPassword) {
      return response.fail400("password doesn't match");
    }
    if (!email) {
      return response.fail400("please input email");
    }
    const encryptedPassword = encrypt(password);
    const registerUser = await allService.ucapanServices.create({
      name,
      email,
      password: encryptedPassword,
      role,
      alamat,
      no_hp,
    });
    return response.success201(registerUser);
  } catch (error) {
    return response.fail500(error.message);
  }
};
