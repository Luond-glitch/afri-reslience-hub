const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    await transporter.sendMail({
      from: `"ARHICA" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to ARHICA Newsletter',
      html: `
        <h3>Thank you for subscribing!</h3>
        <p>You are now part of the ARHICA community.</p>
        <p>We will keep you updated on our initiatives.</p>
      `
    });

    res.json({ message: 'Subscription email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Email sending failed' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
