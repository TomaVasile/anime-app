const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require("path");
const User = require('../models/user');

const signup = async (req, res) => {
  const { username, email, password, accountType } = req.body;

  if (!username || !email || !password) {
    return res.status(422).json({ message: 'Toate câmpurile sunt obligatorii' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email-ul este deja folosit' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, accountType: accountType || 'simple' });
    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: 'Yahoo',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    const mailOptions = {
      from: process.env.EMAIL,
      to: email, 
      subject: 'Confirmare înregistrare',
      text: 'Înregistrarea ta a fost realizată cu succes!',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Eroare la trimiterea emailului:', error);
      } else {
        console.log('Email trimis:', info.response);
      }
    });

    res.status(201).json({ message: 'Utilizator înregistrat cu succes' });
  } catch (err) {
    res.status(500).json({ message: 'Eroare la înregistrare' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email și parola sunt obligatorii' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, accountType: user.accountType, isAdmin: user.isAdmin, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      userId: user._id,
      accountType: user.accountType,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const avatarUrl = user.avatar
  ? `https://anime-fox.netlify.app/user-avatar/${user.avatar}`
  : "https://anime-fox.netlify.app/user-avatar/avatar.jpg"; 
  
    res.json({
      userId: user._id,
      username: user.username,
      email: user.email,
      accountType: user.accountType,
      isAdmin: user.isAdmin,
      avatar: avatarUrl,
    });
  } catch (error) {
    console.error("Eroare la obținerea utilizatorului:", error);
    res.status(500).json({ message: "Eroare server" });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Avatarul este obligatoriu!' });
    }

    const userId = req.body.userId;  
    const avatar = `/user-avatar/${req.file.filename}`;  

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }

    user.avatar = avatar;
    await user.save();

    return res.status(200).json({
      message: 'Avatarul a fost actualizat cu succes!',
      avatar: avatar,
      userId: user._id,
    });
  } catch (error) {
    console.error('Eroare la încărcarea avatarului:', error);
    return res.status(500).json({ message: 'Eroare la încărcarea avatarului' });
  }
};

module.exports = { signup, login, getUserProfile, uploadAvatar };