const Tour = require("../models/Tour");

// Get all tours
exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.status(200).json(tours);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get tour by Id
exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) {
            return res.status(404).json({ message: "Tour not found" });
        }
        res.status(200).json(tour);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//Create Tour

exports.createTour = async (req, res) => {
    try {
        const { name, description, price, duration, destination, image } = req.body;

        
        if (!name || !description || !price || !duration || !destination || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newTour = new Tour({ name, description, price, duration, destination, image });
        const savedTour = await newTour.save();
        res.status(201).json(savedTour);
    } catch (error) {
        res.status(500).json({ message: "Error creating tour", error });
    }
};

// Update a tour 
exports.updateTour = async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedTour) {
            return res.status(404).json({ message: "Tour not found" });
        }
        res.status(200).json(updatedTour);
    } catch (error) {
        res.status(500).json({ message: "Error updating tour", error });
    }
};

// Delete a tour 
exports.deleteTour = async (req, res) => {
    try {
        const deletedTour = await Tour.findByIdAndDelete(req.params.id);
        if (!deletedTour) {
            return res.status(404).json({ message: "Tour not found" });
        }
        res.status(200).json({ message: "Tour deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting tour", error });
    }
};
