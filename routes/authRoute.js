const express = require("express");
const {requireSignIn, isAdmin} = require('../middlewares/authMiddleware')


const {
  registerController,
  loginController,
  forgotPasswordController,
  updateProfileController,
  getOrdersContoller,
  getAllOrdersController,
  orderStatusController,
} = require("../controllers/authController");

//router object
const router = express.Router();

//routing

//Register || MEthod POST
router.post("/register", registerController);

//Login || Method POST
router.post('/login',loginController );

//Forgot Password || POST
router.post('/forgot-password',forgotPasswordController)

//protected User route auth
router.get('/user-auth', requireSignIn , (req,res)=>{
  res.status(200).send({ok:true});
})

//protected Admin route auth
router.get('/admin-auth', requireSignIn, isAdmin , (req,res)=>{
  res.status(200).send({ok:true});
})


//update profile
router.put("/profile", requireSignIn, updateProfileController);


//orders
router.get('/orders',requireSignIn,getOrdersContoller)


//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);


module.exports = router;
