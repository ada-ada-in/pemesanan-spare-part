import * as allService from "../../../services/allService.js";
import ResponseHandler from "../../../utils/response.js";
import { encrypt } from "../../../utils/encrypt.js";

export const register = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { name, email, password, confPassword, role, alamat, no_hp } =
      req.body;
    if (password !== confPassword) {
      return response.fail400("password doesn't match");
    }
    if (!email) {
      return response.fail400("please input email");
    }
    const existingEmail = await allService.ucapanServices.getEmailOne(email);
    if (existingEmail) {
      return response.fail400("email has registered");
    }
    const encryptedPassword = await encrypt(password);
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
