const userModel = require('../models/userModel')
const orderModel = require("../models/orderModel");
const {hashPassword,comparePassword} = require('../helpers/authHelper');
const JWT = require('jsonwebtoken');

// Import Nodemailer
const nodemailer = require("nodemailer");

// for registration.............................................................................
const registerController = async (req, res) => {
    console.log("asdfghjk");
  try {

        const {name,email,password,phone,address,answer} = req.body

        // Validation 
        if (!name){
            return res.send({message: 'Name is Require'})
        }
        if (!email){
            return res.send({message: 'email is Require'})
        }
        if (!password){
            return res.send({message: 'password is Require'})
        }
        if (!phone){
            return res.send({message: 'phone is Require'})
        }
        if (!address){
            return res.send({message: 'address is Require'})
        }
        if (!answer){
            return res.send({message: 'answer is Require'})
        }

        //check user
        const existingUser = await userModel.findOne({email})

        //existing user
        if(existingUser){
            return res.status(200).send({
                success:false ,
                message:'Already Registered , Plrease Login',
            })
        }

        //register user 
        // console.log("password", password);
        const hashedPassword = await hashPassword(password);
        // console.log("hashedPassword",hashedPassword);
        //save
        const user = await new userModel({name,email,phone,address,password:hashedPassword,answer}).save();

    const transporter = nodemailer.createTransport({
      service: "Gmail", // Use your email service provider
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Define email options (e.g., recipient, subject, text)
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Welcome to MEcommerce",
      text: `Dear ${name},
      \n
        We are thrilled to have you join our MEcommerce. Your registration is successful, and you are now part of our community. Feel free to explore and make the most of our services. Should you have any questions or need assistance, don't hesitate to reach out.
        \n
        Welcome aboard!
        \n\n
        Best regards,\n
        MECommerece Team`,
    };

    // Send email using the transporter and mail options
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        
      }
    });
    
        res.status(201).send({
            success:true,
            message:'User Registered Successfully',
            user,
        });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration ",
      error,
    });
  }
};


//for login...................................................................................
const loginController = async (req,res) => {

    try {
        const {email,password} = req.body
        
        //validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'Invalid email & password'
            })
        }

        //check user
        const user = await userModel.findOne({email})
        if (!user) {
            return res.status(404).send({
                success:false,
                message:'Email not registerd',
            })
        }

        const match = await comparePassword(password,user.password)
        if (!match) {
            return res.status(200).send({
                success:false,
                message:'invalid password',
            })
            
        }

        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET,{expiresIn:'7d'});
        res.status(200).send({
            success:true,
            message:'login successfully',
            user:{
                _id: user._id,
                name:user.name,
                email:user.email, 
                phone:user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });

    }catch (error) {
        console.log(error);
        res.status(500).send({
            success:fale,
            message:'Error in login',
            error,
        })
    }
};


//forgot Password................................................................................

const forgotPasswordController = async (req,res) => {

    try {

        const {email,answer,newPassword} = req.body

        if (!email) {
            res.status(400).send({message:'Email is require'})
        }
        if (!answer) {
            res.status(400).send({message:'answer is require'})
        }
        if (!newPassword) {
            res.status(400).send({message:'NewPassword is require'})
        }

        //check
        const user = await userModel.findOne({email,answer})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Wrong email or Answer",
            })
        }

        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success:true,
            message:'Password Reset successfully'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Somthing went wrong',
            error
        })
    }


}

//update prfole
const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    // if (password && password.length < 6) {
    //   return res.json({ error: "Passsword is required and 6 character long" });
    // }
    
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Update profile",
      error,
    });
  }
};

//orders
const getOrdersContoller = async(req,res) => {
    try {
        const orders = await orderModel
          .find({ buyer: req.user._id })
          .populate("products", "-photo")
          .populate("buyer", "name");
        res.json(orders); 
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error While Getting Order",
            error,
        })
    }
}



//All orders
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};



module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  updateProfileController,
  getOrdersContoller,
  getAllOrdersController,
  orderStatusController,
};
