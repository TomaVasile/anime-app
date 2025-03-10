require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000; 

const corsOptions = {
  origin: 'https://anime-fox.netlify.app/',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-images", express.static(path.join(__dirname, "..", "frontend", "public", "api-images")));
app.use("/user-avatar", express.static(path.join(__dirname, "..", "frontend", "public", "user-avatar")));


const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

const animeRoutes = require('./routes/animeRoutes');
app.use("/api", animeRoutes);

const protectedRoutes = require('./routes/protectedRoutes');
app.use('/api', protectedRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api', paymentRoutes);

const stripeWebHook = require('./routes/stripeWebHook');
app.use('/api', stripeWebHook);

mongoose.connect('mongodb://localhost:27017/animeDB')
  .then(() => console.log('Successful connection to MongoDB'))
  .catch((error) => console.log('Connection error MongoDB:', error));

app.listen(PORT, () => {
  console.log(`Serverul rulează pe ${PORT}`);
});


