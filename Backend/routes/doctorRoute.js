import express from 'express';
import { doctorList } from '../controllers/doctorController.js'; // ✅ FIXED: added .js extension
import authAdmin from '../middleware/authAdmin.js';

const doctorrouter = express.Router();

// Route: GET /api/doctor/list
doctorrouter.get('/list', doctorList);

export default doctorrouter;
