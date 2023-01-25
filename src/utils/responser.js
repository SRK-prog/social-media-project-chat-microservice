class Responser {
  constructor(response) {
    this.response = response;
  }
  send({ message, status = 200, success = true, response = "", error }) {
    const resObj = { message, response, success };
    if (error) resObj.error = error;
    this.response.status(status).json(resObj);
  }
  error(err) {
    if (typeof err === "string") err = { error: err };
    err = err || {};
    this.response.status(err.status || 500).json({
      message: err.message || "Internal server error!",
      error: err.error || err.message || "",
      success: false,
    });
  }
}

module.exports = Responser;
