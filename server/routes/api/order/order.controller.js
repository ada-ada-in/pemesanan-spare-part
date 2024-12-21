import * as allService from "../../../services/allService.js";
import ResponseHandler from "../../../utils/response.js";
import SparePartModels from "../../../models/sparePart.model.js";
import UsersModels from "../../../models/user.model.js";
import { toTransactionNumber } from "../../../utils/transaksiNumber.js";
import { Op } from "sequelize";

// USER
export const CreateOrder = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { spareParts } = req.body;
    const id = req.id;
    if (!Array.isArray(spareParts) || spareParts.length === 0) {
      return response.fail400("Please insert valid spare parts and quantities");
    }
    const transaksi_number = toTransactionNumber();
    const cart = await allService.CartService.create({
      id_user: id,
      transaksi_number: transaksi_number,
    });
    let totalPrice = 0;
    for (const item of spareParts) {
      const { id_sparepart, qty, harga } = item;
      if (!id_sparepart || id_sparepart.trim() === "") {
        return response.fail400("Please insert spare part ID");
      }
      if (!qty || qty <= 0) {
        return response.fail400(
          "Please insert a valid quantity for spare part"
        );
      }
      const sparePart = await allService.sparePartService.getNameCheck(
        "id",
        id_sparepart
      );
      if (!sparePart) {
        return response.fail400(
          `Cannot find spare part with ID: ${id_sparepart}`
        );
      }
      const total = sparePart.price * qty;
      await allService.CartItemService.create({
        id_cart: cart.id,
        id_sparepart: id_sparepart,
        qty,
        harga: total,
      });

      totalPrice += sparePart.price * qty;
    }

    cart.price_total = totalPrice;
    await cart.save();

    return response.success201(cart);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const CreateOrderAdmin = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { spareParts, id_user, isStatus, isPaid } = req.body;

    if (!Array.isArray(spareParts) || spareParts.length === 0) {
      return response.fail400("Please insert valid spare parts and quantities");
    }
    const trasactionNumber = toTransactionNumber();

    const cart = await allService.CartService.create({
      id_user: id_user,
      transaksi_number: trasactionNumber,
      isStatus: isStatus,
      isPaid: isPaid,
    });

    console.log(cart);

    let totalPrice = 0;

    for (const item of spareParts) {
      const { id_sparepart, qty } = item;

      if (!id_sparepart || id_sparepart.trim() === "") {
        return response.fail400("Please insert spare part ID");
      }
      if (!qty || qty <= 0) {
        return response.fail400(
          "Please insert a valid quantity for spare part"
        );
      }

      const sparePart = await allService.sparePartService.getNameCheck(
        "id",
        id_sparepart
      );

      if (!sparePart) {
        return response.fail400(
          `Cannot find spare part with ID: ${id_sparepart}`
        );
      }

      const total = sparePart.price * qty;

      await allService.CartItemService.create({
        id_cart: cart.id,
        id_user,
        id_sparepart,
        qty,
        harga: total,
      });

      totalPrice += total;
    }

    cart.price_total = totalPrice;
    await cart.save();

    return response.success201(cart);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getPembayaran = async (req, res) => {
  const response = new ResponseHandler(res);
  const id_user = req.id;
  console.log(id_user);
  try {
    const getDataPembayaran = await allService.CartService.getDataCountByUser(
      id_user
    );
    if (!getDataPembayaran) return response.fail400("cannot get data lunas");

    return response.success200(getDataPembayaran);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getPembayaranLunas = async (req, res) => {
  const response = new ResponseHandler(res);
  const id_user = req.id;
  console.log(id_user);
  try {
    const getDataPembayaranLunas =
      await allService.CartService.getDataCountByData(id_user, "lunas");
    if (!getDataPembayaranLunas)
      return response.fail400("cannot get data lunas");

    return response.success200(getDataPembayaranLunas);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getPembayaranBayarSebagian = async (req, res) => {
  const response = new ResponseHandler(res);
  const id_user = req.id;
  console.log(id_user);
  try {
    const getDataPembayaranBayarSebagian =
      await allService.CartService.getDataCountByData(
        id_user,
        "bayar-sebagian"
      );
    if (!getDataPembayaranBayarSebagian)
      return response.fail400("cannot get data bayar sebagian");

    return response.success200(getDataPembayaranBayarSebagian);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getPembayaranBelumBayar = async (req, res) => {
  const response = new ResponseHandler(res);
  const id_user = req.id;
  console.log(id_user);
  try {
    const getDataPembayaranBelumBayar =
      await allService.CartService.getDataCountByData(id_user, "belum-bayar");
    if (!getDataPembayaranBelumBayar)
      return response.fail400("cannot get data belum bayar");

    return response.success200(getDataPembayaranBelumBayar);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getOrderByUser = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const id = req.id;
    console.log(id);
    const userOrder = await allService.CartService.getDataByIdName(
      "id_user",
      id,
      UsersModels
    );
    if (!userOrder) {
      return response.fail400("cannot find order");
    }
    return response.success200(userOrder);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getOrderByCartItem = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { id_cart } = req.params;
    const userItem = await allService.CartItemService.getDataCartItem(
      "id_cart",
      id_cart,
      SparePartModels
    );
    if (!userItem) {
      return response.fail400("cannot find order");
    }
    return response.success200(userItem);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const uploadImage = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const filename = req.file.filename;
    const { id } = req.params;
    const isStatus = "inden";
    const isPaid = "diproses";
    const data = {
      image: filename,
      isStatus: isStatus,
      isPaid: isPaid,
    };
    const updatedImage = await allService.CartService.update(data, id);
    if (!updatedImage) {
      return response.fail400("Fail to update data");
    }
    return response.successUpdate200(data);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const deleteUserTransaction = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { id } = req.params;
    const deleteData = await allService.CartService.delete(id);
    if (!deleteData) return response.fail400("cannot delete data");
    return response.successDelete200(deleteData);
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return response.fail400("cannot delete data, foreign key constraint");
    }
    return response.fail500(error.message);
  }
};

//  ADMIN

export const getOrderByProses = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const diproses = "diproses";
    const prosesItem = await allService.CartService.getDataByIdName(
      "isPaid",
      diproses,
      UsersModels
    );
    if (!prosesItem) {
      return response.fail400("cannot find data with diproses");
    }
    return response.success200(prosesItem);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getOrderTransaksi = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const lunas = "lunas";
    const bayarSebagian = "bayar-sebagian";
    const prosesItem = await allService.CartService.getDataByIdName(
      "isPaid",
      { [Op.or]: [lunas, bayarSebagian] },
      UsersModels
    );
    if (!prosesItem) {
      return response.fail400("cannot find data with diproses");
    }
    return response.success200(prosesItem);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getOrderId = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { id } = req.params;
    const orderId = await allService.CartService.getNameCheckWithModels(
      "id",
      id,
      UsersModels
    );
    if (!orderId) {
      return response.fail400("cannot find data with diproses");
    }
    return response.success200(orderId);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getOrderProsesById = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { id_cart } = req.params;
    console.log(req.params);
    const findOrderById = await allService.CartItemService.getDataCartItem(
      "id_cart",
      id_cart,
      SparePartModels
    );
    if (!findOrderById) {
      return response.fail400("Fail to update data");
    }
    return response.successUpdate200(findOrderById);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const updateTransaksi = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { id } = req.params;
    const { isStatus, isPaid } = req.body;
    const data = {
      isStatus: isStatus,
      isPaid: isPaid,
    };
    const updatedImage = await allService.CartService.update(data, id);
    if (!updatedImage) {
      return response.fail400("Fail to update data");
    }
    return response.successUpdate200(data);
  } catch (error) {
    return response.fail500(error.message);
  }
};
