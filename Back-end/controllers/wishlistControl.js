const wishlistService = require("../services/wishlistService");

exports.get = async (req, res) => {
  const data = await wishlistService.get(req.params.userId);
  res.json(data);
};

exports.add = async (req, res) => {
  const items = await wishlistService.add(req.params.userId, req.body.product);
  res.json(items);
};

exports.remove = async (req, res) => {
  const items = await wishlistService.remove(
    req.params.userId,
    req.params.productId
  );
  res.json(items);
};
