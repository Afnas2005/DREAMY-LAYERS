const Wishlist = require("../models/Wishlist");

exports.get = async (userId) =>
  (await Wishlist.findOne({ userId })) || { items: [] };

exports.add = async (userId, product) => {
  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId,
      items: [{ ...product, productId: product._id }],
    });
  } else {
    const existingItem = wishlist.items.find(
      (item) => item.productId.toString() === product._id.toString()
    );

    if (!existingItem) {
      wishlist.items.push({ ...product, productId: product._id });
    }
  }

  await wishlist.save();
  return wishlist.items;
};

exports.remove = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ userId });
  wishlist.items = wishlist.items.filter(
    (i) => i.productId.toString() !== productId
  );
  await wishlist.save();
  return wishlist.items;
};
