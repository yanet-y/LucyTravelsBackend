require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require("./routes/bookingRoutes");
const cors = require('cors');


const app = express();


connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tours', tourRoutes);
app.use("/bookings", bookingRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));