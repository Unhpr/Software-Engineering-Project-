const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');

// Register Route
router.post('/register', async (req, res) => {
  console.log("📝 Received register request body:", req.body);

  const { username, name, email, height, weight, targetWeight, password } = req.body;

  if (!username || !email || !height || !weight || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const bmi = weight / ((height / 100) ** 2);

  try {
    const newUser = new UserProfile({
      username,
      name,
      email,
      height,
      weight,
      password,
      bmi: parseFloat(bmi.toFixed(2)),
      targetWeight: targetWeight || null
    });

    await newUser.save();

    let feedback = 'Your BMI is normal.';
    if (bmi < 18.5) feedback = "You're underweight. Consider setting a weight gain goal.";
    else if (bmi >= 25) feedback = "You're overweight. Consider setting a weight loss goal.";

    res.json({
      message: 'User registered successfully',
      bmi: newUser.bmi,
      feedback
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving user', error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  console.log("🔐 Login attempt received:", req.body);

  const { email, password } = req.body;

  try {
    const user = await UserProfile.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).send('Invalid credentials');
    }

    // Save username in session
    req.session.username = user.username;

    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Login error');
  }
});

module.exports = router;
