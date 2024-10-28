import "dotenv/config";
import app from "./server/server.js";
import http from "http";
import express from "express";
import { sequelize } from "./server/configs/database.js";
import cors from "cors";
// import CartItemsModels from "./server/models/cartItems.models.js";
// import CartModels from "./server/models/cart.models.js";
// app.use(CartItemsModels);
// app.use(CartModels);

app.use(cors());
app.use(express.json());
app.get("/", async (req, res, next) => {
  return res.send("Okeee");
});

const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const start = async () => {
  try {
    // const database = await sequelize.sync({ alter: true });
    const database = await sequelize.sync();
    if (!database) {
      console.log("database cannot sync");
    } else {
      console.log("====================================================");
      console.log("Database Connected Successfully");
    }
    server.listen(PORT, () =>
      console.log(`🚀 [SERVER] is running on port http://localhost:${PORT}`)
    );
    console.log("===================================================");
  } catch (error) {
    console.error(`⚠️ [ERROR] ${error.message}`);
  }
};

start();
