// middleware/validateAIRequest.js
module.exports = (req, res, next) => {
  if (!req.user.aiEnabled) {
    return res.status(403).json({
      status: "error",
      message: "AI features not enabled for this account",
    });
  }
  next();
};
