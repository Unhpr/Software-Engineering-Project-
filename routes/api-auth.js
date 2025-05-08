const express = require('express');
const router = express.Router();

console.log("Attempting to load UserProfile model...");
try {
  const UserProfile = require('../models/UserProfile');
  console.log("UserProfile model loaded successfully.");
  
  router.post('/register', async (req, res) => {
    const { username, name, email, height, weight, targetWeight } = req.body;
    if (!username || !email || !height || !weight) {
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
} catch (err) {
  console.error("Failed to load UserProfile model:", err.message);
}

module.exports = router;
