require('dotenv').config();  
const express = require('express');
const cors = require('cors');  
const connectDB = require('./config/db');  
const authRoutes = require('./routes/authRoutes'); 
const tourRoutes = require('./routes/tourRoutes');  
const bookingRoutes = require('./routes/bookingRoutes');  

const app = express();


connectDB();


const corsOptions = {
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  
};


app.use(cors(corsOptions)); 
app.use(express.json());  

// Routes
app.use('/auth', authRoutes);
app.use('/tours', tourRoutes);
app.use('/bookings', bookingRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
