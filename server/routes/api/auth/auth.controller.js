import * as allService from "../../../services/allService.js";
import jwt from "jsonwebtoken";
import ResponseHandler from "../../../utils/response.js";
import { encrypt } from "../../../utils/encrypt.js";
import { compare } from "../../../utils/compare.js";
import {
  toCapitalizeFirstWordCase,
  toTitleCase,
} from "../../../utils/textCase.js";
import { tokenBlacklist } from "../../../utils/blacklist.js";

export const register = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { name, email, password, confPassword, role, alamat, no_hp } =
      req.body;
    console.log(req.body);
    if (password !== confPassword) {
      return response.fail400("password doesn't match");
    }
    if (!email) {
      return response.fail400("please input email");
    }
    const existingEmail = await allService.authService.getNameCheck(
      "email",
      email
    );
    if (existingEmail) {
      return response.fail400("email has registered");
    }
    const formattedName = toTitleCase(name);
    const formattedAlamat = toCapitalizeFirstWordCase(alamat);
    const encryptedPassword = await encrypt(password);
    const registerUser = await allService.authService.create({
      name: formattedName,
      email,
      password: encryptedPassword,
      role,
      alamat: formattedAlamat,
      no_hp,
    });
    return response.success201(registerUser);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getCountAccount = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const getAllUser = await allService.authService.getDataCount();
    if (!getAllUser) {
      return response.fail400("Cannot count all user");
    }
    return response.success200(getAllUser);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getAccount = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const getAllUser = await allService.authService.getData();
    if (!getAllUser) {
      return response.fail400("Cannot count all user");
    }
    return response.success200(getAllUser);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getUserById = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { id } = req.params;
    const getUserById = await allService.authService.getDataById(id);
    if (!getUserById) {
      return response.fail400("Cannot get user id");
    }
    return response.success200(getUserById);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const deleteAccount = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { id } = req.params;
    const deleteUser = await allService.authService.delete(id);
    if (!deleteUser) {
      return response.fail400("Cannot delete user");
    }
    return response.success200(deleteUser);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const updateAccount = async (req, res) => {
  const response = new ResponseHandler(res);
  const { id } = req.params;
  const { name, email, alamat, no_hp, role, password, confPassword } = req.body;
  if (password !== confPassword) {
    return response.fail400("Password doesn't match");
  }
  const encryptedPassword = await encrypt(password);
  const data = {
    name: name,
    email: email,
    alamat: alamat,
    no_hp: parseInt(no_hp),
    role: role,
    password: encryptedPassword,
  };
  try {
    const updatedAccount = await allService.authService.update(data, id);
    if (!updatedAccount) {
      return response.fail400("Cannot count all user");
    }
    return response.success201(updatedAccount);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const login = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { email, password } = req.body;
    const user = await allService.authService.getNameCheck("email", email);
    if (!user) {
      return response.fail400("incorect email or password");
    }
    const secretKey = process.env.SECRET_KEY;
    const payload = {
      id: user.id,
      role: user.role,
    };
    await compare(password, user.password);
    const token = jwt.sign(payload, secretKey, {
      expiresIn: "3d",
    });
    return response.success201(token);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const logout = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const getToken = req.headers.authorization?.split(" ")[1];
    if (getToken) {
      tokenBlacklist.add(token);
      return response.success200("Logout successful");
    }
    return response.fail400("Token not provided");
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getRoleWhenLogin = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const id = req.id;
    const getRoleWhenUserLogin =
      await allService.authService.getRoleWhenUserLogin(id);
    if (!getRoleWhenUserLogin) {
      return response.fail400("id is undifiend");
    }
    return response.success200(getRoleWhenUserLogin);
  } catch (error) {
    return response.fail500(error.message);
  }
};
