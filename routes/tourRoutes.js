const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController"); 
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");




router.get("/", tourController.getAllTours);
router.get("/:id", tourController.getTourById);
router.post("/", authMiddleware, isAdmin, tourController.createTour);
router.put("/:id", authMiddleware, isAdmin, tourController.updateTour);
router.delete("/:id", authMiddleware, isAdmin, tourController.deleteTour);

module.exports = router;
