import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
// user k listing mei jo id hai vo id daalna hai
router.delete('/delete/:id', verifyToken, deleteListing);
// user k listing mei jo id hai vo id daalni hai
router.post('/update/:id', verifyToken, updateListing);
// same user k listing ki id daalni hai
router.get('/get/:id', getListing);
router.get('/get', getListings);

export default router;
