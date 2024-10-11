import ResponseHandler from "./response.js";

export const verifyToken = (req, res, next) => {
  const response = new ResponseHandler();
  const token = req.headers.authorization?.split(" ")[1];
  if (token && tokenBlacklist.has(token)) {
    return response.fail400("Token has been logged out.");
  }
  if (!token) {
    return response.fail401();
  }
  next();
};
