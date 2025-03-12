require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;
const cors = require('cors'); 
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000; 

const corsOptions = {
  origin: 'https://anime-fox.netlify.app',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('/api/create-checkout-session', cors(corsOptions));
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

const stripeRoutes = require('./routes/stripeRoutes');
app.use('/api', stripeRoutes);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectat la MongoDB Atlas"))
.catch(err => console.error("❌ Eroare la conectare:", err));

app.listen(PORT, () => {
  console.log(`Serverul rulează pe ${PORT}`);
});


