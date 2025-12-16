const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async ({ name, email, password }) => {
  const exist = await User.findOne({ email });
  if (exist) throw new Error("User already exists");

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });

  return { message: "User created" };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || user.isBlocked) throw new Error("Access denied");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token, user };
};

exports.getAll = async () => {
  return User.find({}, "-password");
};

exports.block = async (id) =>
  User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });

exports.unblock = async (id) =>
  User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
