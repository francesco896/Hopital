const User = require('../models/users'); 

async function getJuniorsWithoutReparto(req, res) {
  try {
    const juniors = await User.find({
      role: 'junior',
      $or: [
        { reparto: null },
        { reparto: { $exists: false } }
      ]
    }).exec();


    res.status(200).json(juniors);
  } catch (error) {
    console.error('Errore durante la ricerca degli utenti junior senza reparto:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
}

module.exports = { getJuniorsWithoutReparto };