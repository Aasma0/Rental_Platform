const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoute = require('./src/routes/UserRoute');
const categoryRoutes = require('./src/routes/categoryRoute');
const propertyRoutes = require('./src/routes/PropertyRoute');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;

// Connect to the database
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRoute);
app.use('/api/category', categoryRoutes);
app.use('/api/property', propertyRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});