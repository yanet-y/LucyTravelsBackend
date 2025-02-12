const express = require("express");
const router = express.Router();
const {  bookTour,  getUserBookings, cancelBooking,  getAllBookings,  getBookingById } = require("../controllers/bookingController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");


router.post("/", authMiddleware, bookTour);


router.get("/user", authMiddleware, getUserBookings);


router.delete("/:id", authMiddleware, cancelBooking);


router.get("/all", authMiddleware, isAdmin, getAllBookings);

router.get("/:id", authMiddleware, isAdmin, getBookingById);



module.exports = router;
