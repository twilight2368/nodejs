const mongoose = require('mongoose');
const bcrypt = require("bcrypt");


const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  job: String,
  password: String,
});

customerSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

customerSchema.statics.login = async function (name, password) {
  const user = await this.findOne({ name });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("noexisted email");
};


module.exports = mongoose.model('customers', customerSchema);