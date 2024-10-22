import * as allService from "../../../services/allService.js";
import ResponseHandler from "../../../utils/response.js";

export const CreateOrder = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { spareParts } = req.body;
    console.log(req.body);
    const id = req.id;
    if (!Array.isArray(spareParts) || spareParts.length === 0) {
      return response.fail400("Please insert valid spare parts and quantities");
    }
    const cart = await allService.CartService.create({
      id_user: id,
    });
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
      await allService.CartItemService.create({
        id_cart: cart.id,
        id_sparepart: id_sparepart,
        qty,
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
