import ResponseHandler from "./response.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const response = new ResponseHandler(res);
  const token = req.headers.authorization?.split(" ")[1];
  if (token == null) {
    return response.fail401();
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return response.fail403(err.message);
    }
    req.id = decoded.id;
    req.role = decoded.role;
    next();
  });
};
