const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    // console.log("in 1",password)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // console.log("in 2", hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

const comparePassword = async (password, hashedPassword) => {
  return  bcrypt.compare(password, hashedPassword);
};

module.exports = {comparePassword,hashPassword};
