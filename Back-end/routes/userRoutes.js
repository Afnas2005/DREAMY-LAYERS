const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  register,
  login,
  getUsers,
  blockUser,
  unblockUser,
} = require("../controllers/userControl");
router.post("/register", register);
router.post("/login", login);

router.get("/", auth, getUsers);
router.put("/block/:id", auth, blockUser);
router.put("/unblock/:id", auth, unblockUser);

module.exports = router;
