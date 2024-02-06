const sendErrorResponse = (res, err) => {
  res.status(500).json({
    status: "failed",
    message: err.message,
  });
};

module.exports = sendErrorResponse;
