const sendErrorResponse = (res, status, err) => {
  res.status(status).json({
    status: "failed",
    message: err.message,
  });
};

module.exports = sendErrorResponse;
