const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');


router.post('/register', async (req, res) => {
  console.log("📩 Register body:", req.body);

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


    req.session.userId = newUser._id;
    req.session.username = newUser.username;
    req.session.email = newUser.email;

    console.log("✅ Session set after registration:", {
      userId: newUser._id,
      username: newUser.username
    });

    let feedback = 'Your BMI is normal.';
    if (bmi < 18.5) feedback = "You're underweight. Consider setting a weight gain goal.";
    else if (bmi >= 25) feedback = "You're overweight. Consider setting a weight loss goal.";


    res.json({
      message: 'User registered and logged in successfully',
      bmi: newUser.bmi,
      feedback
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Error saving user', error: error.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserProfile.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).send('Invalid credentials');
    }


    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email;

    console.log("✅ Session set after login:", {
      userId: user._id,
      username: user.username
    });

    res.redirect('/dashboard');
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).send('Login error');
  }
});

module.exports = router;
