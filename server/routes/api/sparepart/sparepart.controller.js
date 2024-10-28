import * as allService from "../../../services/allService.js";
import { toTitleCase } from "../../../utils/textCase.js";
import ResponseHandler from "../../../utils/response.js";
import MotorModels from "../../../models/motor.models.js";

export const getCountSparePart = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const getCount = await allService.sparePartService.getDataCount();
    if (!getCount) {
      return response.fail400("Cannot count all sparepart");
    }
    return response.success200(getCount);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const createSparePart = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { id_motor, sparepart_name, price } = req.body;
    if (!sparepart_name || sparepart_name.trim() === "") {
      return response.fail400("Please insert sparepart name");
    }
    if (!id_motor || id_motor === null) {
      return response.fail400("Please insert motor name");
    }
    const spartPartNameCheck = await allService.sparePartService.getNameCheck(
      "sparepart_name",
      sparepart_name
    );
    const priceCheck = await allService.sparePartService.getNameCheck(
      "price",
      price
    );
    if (spartPartNameCheck && priceCheck) {
      return response.fail400(
        "Spare Part with this name and price already exists in the data"
      );
    }
    const formattedTitleCase = toTitleCase(sparepart_name);
    const createNewSparePart = await allService.sparePartService.create({
      sparepart_name: formattedTitleCase,
      price: parseInt(price),
      id_motor: id_motor,
    });
    return response.success201(createNewSparePart);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getSparePart = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const getSparePartData =
      await allService.sparePartService.getDataAndOtherModel(MotorModels);
    if (!getSparePartData || getSparePartData == null) {
      return response.fail400("fail to get spare part data");
    }
    return response.success200(getSparePartData);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getSparePartById = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { id } = req.params;
    const getDataIdSparePart = await allService.sparePartService.getDataById(
      id
    );
    if (!getDataIdSparePart) {
      return response.fail400("fail to get spare part data");
    }
    return response.success200(getDataIdSparePart);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getSparePartByHarga = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { id } = req.params;
    const getDataIdSparePart = await allService.sparePartService.getNameCheck(
      "id",
      id
    );
    if (!getDataIdSparePart) {
      return response.fail400("fail to get price spare part");
    }
    return response.success200(getDataIdSparePart);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const getSparePartByMotorId = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { id_motor } = req.params;
    const getDataIdSparePart =
      await allService.sparePartService.getSparePartByMotor(
        "id_motor",
        id_motor
      );
    if (!getDataIdSparePart || getDataIdSparePart.length === 0) {
      return response.fail400("fail to get spare part data");
    }
    return response.success200(getDataIdSparePart);
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const deleteSparePart = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { id } = req.params;
    const deleteDataSparePart = await allService.sparePartService.delete(id);
    if (!deleteDataSparePart) {
      return response.fail404("Spare part data not found");
    }
    return response.successDelete200("Deleted success");
  } catch (error) {
    return response.fail500(error.message);
  }
};

export const updateSparePart = async (req, res) => {
  const response = new ResponseHandler(res);
  try {
    const { id } = req.params;
    const { id_motor, sparepart_name, price } = req.body;
    const formatedSparePartName = toTitleCase(sparepart_name);
    const data = {
      id_motor: id_motor,
      sparepart_name: formatedSparePartName,
      price: parseInt(price),
    };
    const updatedSparePartData = allService.sparePartService.update(data, id);
    if (!updatedSparePartData) {
      return response.fail400("Fail to update data");
    }
    return response.successUpdate200(data);
  } catch (error) {
    return response.fail500(error.message);
  }
};
