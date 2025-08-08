import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import {v2 as cloudinary} from 'cloudinary';

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Please provide all required fields" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters long" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Email is already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        return res.json({ success: true, message: "User registered successfully", token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error during registration" });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid email or password' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error during login" });
    }
};

//api to get userProfile data

const getProfile = async(req, res) => {
    try {
        const {userId} = req.user;
        const userData = await userModel.findById(userId).select('-password');
        res.json({success:true, userData});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message});
    }
}

//api to update userProfile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;  // from auth middleware
    const { name, phone, address, dob, gender } = req.body;  // from request body
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data is missing for update" });
    }

    // parse address if it's a JSON string (optional)
    let parsedAddress;
    try {
      parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
    } catch {
      parsedAddress = address; // fallback if parse fails
    }

    // update user fields
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    });

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image',
      });
      const imageUrl = imageUpload.secure_url;

      // update user with image URL (use findByIdAndUpdate, NOT findByIdAndDelete)
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    res.json({ success: true, message:"Profile updated Successfully" });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



export { registerUser, loginUser, getProfile, updateProfile };
