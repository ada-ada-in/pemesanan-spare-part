class ResponseHandler {
  constructor(res) {
    this.res = res;
  }

  success200(data) {
    this.res.status(200).json({
      status: {
        code: 200,
        message: "Success: Data retrieved successfully",
      },
      data,
    });
  }

  successUpdate200(data) {
    this.res.status(200).json({
      status: {
        code: 200,
        message: "Success: Data updated successfully",
      },
      data,
    });
  }

  successDelete200(data) {
    this.res.status(200).json({
      status: {
        code: 200,
        message: data,
      },
    });
  }

  success201(data) {
    this.res.status(201).json({
      status: {
        code: 201,
        message: "Success: Data created successfully",
      },
      data,
    });
  }

  fail400(message) {
    this.res.status(400).json({
      status: {
        code: 400,
        message: `Client Error: ${message}`,
      },
      data: null,
    });
  }

  fail401(message = "Unauthorized Access!") {
    this.res.status(401).json({
      status: {
        code: 401,
        message: `Client Error: ${message}`,
      },
      data: null,
    });
  }

  fail403(message = "Access Forbidden!") {
    this.res.status(403).json({
      status: {
        code: 403,
        message: `Client Error: ${message}`,
      },
      data: null,
    });
  }

  fail404(message = "Resource not found!") {
    this.res.status(404).json({
      status: {
        code: 404,
        message: `Client Error: ${message}`,
      },
      data: null,
    });
  }

  fail405(message = "Request method not allowed!") {
    this.res.status(405).json({
      status: {
        code: 405,
        message: `Client Error: ${message}`,
      },
      data: null,
    });
  }

  fail500(error) {
    this.res.status(500).json({
      status: {
        code: 500,
        message: `Server Error: ${error}`,
      },
    });
  }
}

export default ResponseHandler;
