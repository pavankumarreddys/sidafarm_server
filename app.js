const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./v1/routes/authRoutes');
const vehicleRoutes = require('./v1/routes/vehicleRoutes')
const deliveryPointRoutes = require('./v1/routes/deliveryPointRoutes')
dotenv.config();
const app = express();

connectDB(); // Connect to MongoDB

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles',vehicleRoutes );
app.use('/api/v1/delivery', deliveryPointRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
