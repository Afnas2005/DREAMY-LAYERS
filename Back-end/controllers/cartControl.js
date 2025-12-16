const cartService = require("../services/cartService");

exports.getCart = async (req, res) => {
  const cart = await cartService.get(req.params.userId);
  res.json(cart);
};

exports.add = async (req, res) => {
  const items = await cartService.add(req.params.userId, req.body.product);
  res.json(items);
};

exports.remove = async (req, res) => {
  const items = await cartService.remove(
    req.params.userId,
    req.params.productId
  );
  res.json(items);
};

exports.decrease = async (req, res) => {
  const items = await cartService.decrease(
    req.params.userId,
    req.body.productId
  );
  res.json(items);
};
