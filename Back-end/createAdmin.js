const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/user");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const pass = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email: "admin@dreamylayers.com",
      password: pass,
      role: "admin"
    });

    console.log("Admin Created Successfully");
    mongoose.disconnect();
  })
  .catch(err => console.log(err));
