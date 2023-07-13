const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(
        `Connected to  mongo successfully at host: ${data.connection.host}`
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;
