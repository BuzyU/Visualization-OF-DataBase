require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const categoryRoutes = require('./routes/category');
const entryRoutes = require('./routes/entry');
const serviceAccount = require(process.env.FIREBASE_CREDENTIALS);
const supabase = require('./supabase');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Public test route (no auth needed)
app.get('/ping', (req, res) => {
  res.send('Server is alive ✅');
});

// 🔐 Auth middleware (applies to everything below)
app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Missing or malformed token");
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.uid = decodedToken.uid;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).send("Invalid token");
  }
});

// ✅ Protected API routes
app.use('/api/category', categoryRoutes);
app.use('/api/entry', entryRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = supabase;
