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

  async getEmailOne(email) {
    try {
      this.item = await this.model.findOne({
        where: {
          email: email,
        },
      });
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async getMotorNameCheck(data) {
    try {
      this.item = await this.model.findOne({
        where: {
          motor_name: data,
        },
      });
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async getMotorYearCheck(data) {
    try {
      this.item = await this.model.findOne({
        where: {
          tahun: data,
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
      this.item = await this.model.update(data, {
        where: { id: id },
      });
      if (updatedRows === 0) {
        response.fail400("updated fails");
      }
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }
}
