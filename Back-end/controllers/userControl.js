const userService = require("../services/userService")

exports.register = async (req, res) => {
  try {
    const result = await userService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await userService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const users = await userService.getAll();
  res.json(users);
};

exports.blockUser = async (req, res) => {
  const user = await userService.block(req.params.id);
  res.json(user);
};

exports.unblockUser = async (req, res) => {
  const user = await userService.unblock(req.params.id);
  res.json(user);
};
