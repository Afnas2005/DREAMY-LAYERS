const Cart = require("../models/Cart");

exports.get = async (userId) => {
  const cart = await Cart.findOne({ userId });
  return cart || { items: [] };
};

exports.add = async (userId, product) => {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [{ ...product, productId: product._id, quantity: 1 }],
    });
  } else {
    const index = cart.items.findIndex(
      (i) => i.productId.toString() === product._id
    );

    if (index > -1) cart.items[index].quantity += 1;
    else cart.items.push({ ...product, productId: product._id, quantity: 1 });
  }

  await cart.save();
  return cart.items;
};

exports.remove = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  
  if (!cart) {
    return [];
  }
  
  cart.items = cart.items.filter(
    (i) => i.productId.toString() !== productId
  );
  await cart.save();
  return cart.items;
};

exports.decrease = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  
  if (!cart) {
    return [];
  }
  
  const item = cart.items.find(
    (i) => i.productId.toString() === productId
  );

  if (item && item.quantity > 1) item.quantity--;
  await cart.save();
  return cart.items;
};
