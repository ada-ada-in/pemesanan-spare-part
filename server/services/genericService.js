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

  async getDataByIdName(fieldName, fieldValue, model) {
    try {
      this.item = await this.model.findAll({
        where: {
          [fieldName]: fieldValue,
        },
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
