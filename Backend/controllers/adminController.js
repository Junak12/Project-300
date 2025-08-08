import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';

// API for Doctor adding
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imagefile = req.file;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 6) {  
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }

        // Optional: check if email already exists
        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (!imagefile) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }

        const imageUpload = await cloudinary.uploader.upload(imagefile.path, {
            resource_type: "image",
        });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            image: imageUrl,
            date: Date.now(),
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();
        res.status(201).json({ success: true, message: "Doctor added successfully", doctor: newDoctor });

    } catch (error) {
        console.error("Error in addDoctor:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ success: true, message: "Login successful", token });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }

    } catch (error) {
        console.error("Error in adminLogin:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// api for all docotors

const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.status(200).json({ success: true, doctors });
    } catch (error) {
        console.error("Error in allDoctors:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}              
export { addDoctor, loginAdmin, allDoctors };
