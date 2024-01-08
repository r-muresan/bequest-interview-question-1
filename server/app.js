// server.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const secretKey = 'ABCSFSSG'; 
app.use(cors());
app.use(bodyParser.json());


const users = [
  {
    id: 1,
    name: 'Soumya',
    email: 'soumya@gmail.com',
    password: '12345678',
    assetId: '1234A', 
    backup: [],
  },
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.sendStatus(401);


  jwt.verify(token, secretKey, (err, user) => {
   
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Registration endpoint
app.post('/register', (req, res) => {
  const { name, email, password, assetId } = req.body;
const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Create a new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    assetId, // Set assetId from the request
    backup: [],
  };

  // Add the new user to the list
  users.push(newUser);

  res.json({ message: 'Registration successful', user: newUser });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.sendStatus(401);

  const accessToken = jwt.sign(user, secretKey);
  res.json({ accessToken });
});

// View endpoint (requires authentication)
app.get('/view', authenticateToken, (req, res) => {
  // console.log(req.user)
  const { id, name, email, assetId, backup} = req.user;
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    res.json(users[userIndex])

  }else{
    res.json({ id, name, email, assetId ,backup});

  }
});

// Edit endpoint (requires authentication)
app.put('/edit', authenticateToken, (req, res) => {
  const { assetId } = req.body;
  const userId = req.user.id;
  console.log(assetId,userId)

  // Find the user in the users array
  const userIndex = users.findIndex((user) => user.id === userId);
console.log(users)
  if (userIndex !== -1) {
    // Backup previous data before updating
    users[userIndex].backup.push({ assetId: users[userIndex].assetId, timestamp: new Date() });

    // Update user data
    users[userIndex].assetId = assetId;

    res.json({ message: 'Data updated successfully', user: users[userIndex] });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});
// Backup endpoint 
app.get('/backup', authenticateToken, (req, res) => {
  const backupList = req.user.backup.map((backup) => ({
    assetId: backup.assetId,
    timestamp: backup.timestamp,
  }));
  res.json(backupList);
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
