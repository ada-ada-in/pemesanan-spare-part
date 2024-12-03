import ResponseHandler from "../utils/response.js";

const response = new ResponseHandler();

export class GenericServices {
  constructor(model) {
    this.model = model;
    this.item = null;
  }

  async create(data) {
    try {
      this.item = await this.model.create(data);
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async getSparePartByMotor(fieldName, fieldValue, model) {
    try {
      this.item = await this.model.findAll({
        where: {
          [fieldName]: fieldValue,
        },
      });
      this.item = this.item.map((record) => {
        const formattedDate = record.createdAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        const formattedUpdatedDate = record.updatedAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        return {
          ...record.toJSON(),
          createdAt: formattedDate,
          updatedAt: formattedUpdatedDate,
        };
      });
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async getDataByIdName(fieldName, fieldValue, model) {
    try {
      this.item = await this.model.findAll({
        where: {
          [fieldName]: fieldValue,
        },
        include: { model: model || null, as: "user" },
        order: [["createdAt", "DESC"]],
      });
      this.item = this.item.map((record) => {
        const formattedDate = record.createdAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        const formattedUpdatedDate = record.updatedAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        return {
          ...record.toJSON(),
          createdAt: formattedDate,
          updatedAt: formattedUpdatedDate,
        };
      });
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async getDataById(fieldName, fieldValue) {
    try {
      const records = await this.model.findAll({
        where: {
          [fieldName]: fieldValue,
        },
      });

      const formattedRecords = records.map((record) => {
        const formattedCreatedAt = record.createdAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        const formattedUpdatedAt = record.updatedAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);

        return {
          ...record.toJSON(),
          createdAt: formattedCreatedAt,
          updatedAt: formattedUpdatedAt,
        };
      });

      return formattedRecords;
    } catch (error) {
      response.fail500(error);
    }
  }

  async search(whereCondition, model) {
    try {
      this.item = await this.model.findAll({
        where: whereCondition,
        include: { model: model || null, as: "user" },
        order: [["createdAt", "ASC"]],
      });
      this.item = this.item.map((record) => {
        const formattedDate = record.createdAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        const formattedUpdatedDate = record.updatedAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        return {
          ...record.toJSON(),
          createdAt: formattedDate,
          updatedAt: formattedUpdatedDate,
        };
      });
      return this.item;
    } catch (error) {
      response.fail500(error.message);
    }
  }

  async getDataCartItem(fieldName, fieldValue, model1) {
    try {
      this.item = await this.model.findAll({
        where: {
          [fieldName]: fieldValue,
        },
        order: [["createdAt", "ASC"]],
        include: { model: model1, as: "sparepart" },
      });
      this.item = this.item.map((record) => {
        const formattedDate = record.createdAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        const formattedUpdatedDate = record.updatedAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        return {
          ...record.toJSON(),
          createdAt: formattedDate,
          updatedAt: formattedUpdatedDate,
        };
      });
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async getData() {
    try {
      this.item = await this.model.findAll({
        order: [["createdAt", "DESC"]],
      });
      this.item = this.item.map((record) => {
        const formattedDate = record.createdAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        const formattedUpdatedDate = record.updatedAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        return {
          ...record.toJSON(),
          createdAt: formattedDate,
          updatedAt: formattedUpdatedDate,
        };
      });
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async getDataAndOtherModel(model = null) {
    try {
      this.item = await this.model.findAll({
        order: [["createdAt", "DESC"]],
        include: {
          model: model,
        },
      });
      this.item = this.item.map((record) => {
        const formattedDate = record.createdAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        const formattedUpdatedDate = record.updatedAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        return {
          ...record.toJSON(),
          createdAt: formattedDate,
          updatedAt: formattedUpdatedDate,
        };
      });
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async getDataCount() {
    try {
      this.item = await this.model.count();
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async getDataCountByUser(id_user) {
    try {
      this.item = await this.model.count({
        where: { id_user: id_user },
      });
      return this.item;
    } catch (error) {
      return response.fail500(error);
    }
  }

  async getDataCountByData(id_user, isPaid) {
    try {
      this.item = await this.model.count({
        where: {
          id_user: id_user,
          isPaid: isPaid,
        },
      });
      return this.item;
    } catch (error) {
      return response.fail500(error);
    }
  }

  async getDataById(id) {
    try {
      this.item = await this.model.findOne({
        where: {
          id: id,
        },
      });
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async getRoleWhenUserLogin(id) {
    try {
      this.item = await this.model.findOne({
        where: {
          id: id,
        },
        attributes: ["role"],
      });
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
    aaaaaaaaaa;
  }

  async getNameCheck(fieldName, fieldValue) {
    try {
      this.item = await this.model.findOne({
        where: {
          [fieldName]: fieldValue,
        },
      });
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async ifExist(fieldName, fieldValue, fieldName2, fieldValue2) {
    try {
      this.item = await this.model.findOne({
        where: {
          [fieldName]: fieldValue,
          [fieldName2]: fieldValue2,
        },
      });
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async getNameCheckWithModels(fieldName, fieldValue, model) {
    try {
      this.item = await this.model.findOne({
        where: {
          [fieldName]: fieldValue,
        },
        include: {
          model: model,
          as: "user",
        },
      });
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async getPrimaryKeyCheck(fieldName, fieldValue) {
    try {
      this.item = await this.model.findByPk({
        where: {
          [fieldName]: fieldValue,
        },
      });
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async getId(id) {
    try {
      this.item = await this.model.findByPk(id);
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async delete(id) {
    try {
      this.item = await this.model.findOne({
        where: {
          id: id,
        },
      });
      await this.item.destroy();
      return this.item;
    } catch (error) {
      response.fail500(error.message);
    }
  }

  async update(data, id) {
    try {
      this.item = await this.model.findByPk(id);
      await this.item.update(data);
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }
}
