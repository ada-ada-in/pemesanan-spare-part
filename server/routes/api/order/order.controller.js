import * as allService from "../../../services/allService.js";
import { toTitleCase } from "../../../utils/textCase.js";
import ResponseHandler from "../../../utils/response.js";

export const CreateOrder = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { id_sparepart, quantity } = req.body;
    const id = req.id;
    if (!id_sparepart || id_sparepart.trim() === "") {
      return response.fail400("Please insert spare part name");
    }
    if (!quantity || quantity === null) {
      return response.fail400("Please insert quantity");
    }
    let cart = await allService.CartService.getDataById(id);
    if (!cart) {
      cart = await allService.CartService.create({
        id: id,
      });
    }

    const createNewMotor = await allService.motorService.create({
      motor_name: formattedTitleCase,
      tahun: parseInt(tahun),
    });
    return response.success201(createNewMotor);
  } catch (error) {
    return response.fail500(error.message);
  }
};
