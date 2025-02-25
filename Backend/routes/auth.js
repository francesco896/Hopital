const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const User = require('../models/users'); 
const { getJuniorsWithoutReparto } = require('../controller/controllerUser'); 
const { createReparto, getCapoRepartoByOperatore ,getRepartoByCapoReparto, getOperatorsByCapoReparto, getRepartoById, aggiungiJuniorToReparto} = require('../controller/controllerReparto'); 
const { salvaCalendario, getCalendario, updateTurno} = require('../controller/controllerCalendar'); 
const { createRichiesta, getRichiestePerCapoOperatore, updateRichiesta} = require('../controller/controllerRichiesta');



router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role, reparto } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utente già esistente' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      reparto: reparto || null, 
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, jwtSecret, { expiresIn: '1h' });

    res.status(200).json({ 
      token, 
      user: {
        id: newUser._id,
        role: newUser.role 
      } 
    });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.post('/accedi', async (req, res) => {
  const { email, password } = req.body;

  try {
   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email o password non valide' });
    }

  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password corrisponde:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email o password non valide' });
    }

 
    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });

  
    res.status(200).json({ 
      token,
      user: {
        id: user._id,
        role: user.role 
      }
    });
  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Accesso Negato' });
  }

  try {
    const decoded = jwt.verify(token,jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token non valido' });
  }
};




router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    res.json(user);
  } catch (error) {
    console.error('Errore durante il recupero del profilo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reparto/crea', authMiddleware, createReparto);
router.get('/reparto/caporeparto',authMiddleware, getCapoRepartoByOperatore);
router.get('/reparto/operatori', authMiddleware, getOperatorsByCapoReparto);
router.get('/reparto/trovareparto', authMiddleware, getRepartoByCapoReparto);
router.get('/reparto/dettagli', authMiddleware, getRepartoById);
router.post('/calendario/salva', authMiddleware, salvaCalendario);
router.get('/calendario', authMiddleware, getCalendario);
router.post('/team', authMiddleware, getJuniorsWithoutReparto);
router.post('/add', authMiddleware, aggiungiJuniorToReparto);
router.post('/richiesta', authMiddleware, createRichiesta);
router.get('/recupero', authMiddleware, getRichiestePerCapoOperatore);
router.post('/cambio', authMiddleware, updateTurno);
router.post('/richiesta/statorichiesta', authMiddleware, updateRichiesta);
module.exports = router;


  




