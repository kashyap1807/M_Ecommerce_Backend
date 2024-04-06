const express = require("express");
const dotenv = require("dotenv");
//morgan
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const cors = require("cors");

// const path = require("path")

// dot env
dotenv.config();

//PORT
const PORT = process.env.PORT || 8080;

//Mongo Connection
connectDB();

//rest obj
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// app.use(express.static(path.join(__dirname, "../client/build")));

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category",categoryRoutes);
app.use("/api/v1/product", productRoutes);


app.listen(PORT, () => {
  console.log(`server ${process.env.DEV_MODE} running on ${PORT}`);
});
