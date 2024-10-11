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
      return res.status(500).json({
        status: {
          code: 500,
          message: `Server Error: ${error}`,
        },
      });
    }
  }

  async getData() {
    try {
      this.item = await this.model.findAll();
      return this.item;
    } catch (error) {
      response.fail500(error);
    }
  }

  async getEmailOne(email) {
    try {
      this.item = await this.model.findAll({
        where: {
          email: email,
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
      this.item = await this.model.destroy(id);
      return this.item;
    } catch (error) {
      response.fail500(error);
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
