const Booking = require("../models/Booking");
const Tour = require("../models/Tour");
const sendEmail = require("../utils/emailService");
const mongoose = require("mongoose");
const User = require("../models/User"); 

// Book a Tour

exports.bookTour = async (req, res) => {
  try {
    const { fullName, tourId, tourDate } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const userEmail = user.email;
    
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found" });
    }

    if (!mongoose.isValidObjectId(tourId)) {
      return res.status(400).json({ message: "Invalid tour ID format" });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const booking = new Booking({
      user: userId,
      fullName,
      tour: tourId,
      tourDate,
    });

    await booking.save();

    
    const subject = "Tour Booking Confirmation";
    const text = `Hello ${fullName},\n\nYour booking for the "${tour.name}" tour on ${tourDate} has been confirmed.\n\nThank you for booking with us!`;
    await sendEmail(userEmail, subject, text); 

    res.status(201).json({ message: "Booking successful. Confirmation email sent.", booking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Error booking tour", error });
  }
};


// Get Bookings for User
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching bookings for user:", userId);

    const bookings = await Booking.find({ user: userId })
      .populate("tour")
      .populate("user", "name email");

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// Get All Bookings(Admin)
exports.getAllBookings = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    console.log("Fetching all bookings for admin");

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("tour");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// Get a Booking by ID (Admin)
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID format" });
    }


    const booking = await Booking.findById(id)
      .populate("user", "name email")
      .populate("tour");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ message: "Error fetching booking details", error });
  }
};

// Cancel a Booking 
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID format" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

   
    if (booking.user.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error canceling booking", error });
  }
};
