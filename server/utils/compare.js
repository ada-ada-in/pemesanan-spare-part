import bcrypt from "bcrypt";
import ResponseHandler from "./response.js";

export const compare = (password, comparePassowrd) => {
  const response = new ResponseHandler();
  const passwordMatch = bcrypt.compare(password, comparePassowrd);
  if (!passwordMatch) {
    return response.fail400("password doesn't same");
  }
  return passwordMatch;
};
