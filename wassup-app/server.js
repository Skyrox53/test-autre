const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const upload = multer({ dest: 'public/uploads/' });

let profiles = [];

app.post('/api/save-profile', upload.single('photo'), (req, res) => {
  const { bio, citation, isPublic } = req.body;
  let photoUrl = '';

  if (req.file) {
    photoUrl = '/uploads/' + req.file.filename;
  }

  const newProfile = {
    id: Date.now(),
    bio,
    citation,
    isPublic: isPublic === 'true',
    photoUrl
  };

  const existing = profiles.findIndex(p => p.id === newProfile.id);
  if (existing >= 0) profiles[existing] = newProfile;
  else profiles.push(newProfile);

  res.status(200).json({ success: true });
});

app.get('/api/public-profiles', (req, res) => {
  const publicProfiles = profiles.filter(p => p.isPublic);
  res.json(publicProfiles);
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
