const Calendario = require('../models/Calendario');
const User = require('../models//users');

const salvaCalendario = async (req, res) => {
  const { repartoId, settimana} = req.body;

  try {
    let calendario = await Calendario.findOne({ reparto: repartoId });

    if (!calendario) {
      calendario = new Calendario({ reparto: repartoId, settimana: [] });
    }

  


    calendario.settimana = settimana;
    await calendario.save();

    res.status(200).json({ message: 'Calendario salvato con successo.' });
  } catch (error) {
    console.error('Errore nel salvare il calendario:', error);
    res.status(500).json({ message: 'Errore nel salvare il calendario.' });
  }
};



const getCalendario = async (req, res) => {
  const { repartoId } = req.query;

  if (!repartoId) {
    return res.status(400).json({ message: 'ID del reparto mancante.' });
  }

  try {
    let calendario = await Calendario.findOne({ reparto: repartoId })
      .populate({
        path: 'settimana.turni.operatore',
        select: 'firstName lastName'
      });

    if (!calendario) {
      calendario = new Calendario({
        reparto: repartoId,
        settimana: [] 
      });

      await calendario.save();
    }

    res.status(200).json(calendario);
  } catch (error) {
    console.error('Errore nel recuperare o creare il calendario:', error);
    res.status(500).json({ message: 'Errore nel recuperare o creare il calendario.' });
  }
};


const updateTurno = async (req, res) => {
  const { repartoId, giorno, operatoreId, nuovoTurno } = req.body;

  if (!repartoId || !giorno || !operatoreId || !nuovoTurno) {
    return res.status(400).json({ message: 'Non sono stati forniti sufficienti parametri per il cambio' });
  }

  try {
    const calendario = await Calendario.findOne({ reparto: repartoId });

    if (!calendario) {
      return res.status(404).json({ message: 'Calendario non trovato.' });
    }

    const giornoCalendario = calendario.settimana.find(g => g.giorno === giorno);

    if (!giornoCalendario) {
      return res.status(404).json({ message: 'Giorno non trovato nel calendario.' });
    }

    const turno = giornoCalendario.turni.find(t => t.operatore.toString() === operatoreId);

    if (!turno) {
      return res.status(404).json({ message: 'Operatore non trovato per il giorno specificato.' });
    }
    turno.turno = nuovoTurno;

    await calendario.save();

    res.status(200).json({ message: 'Turno aggiornato con successo.' });
  } catch (error) {
    console.error('Errore nell\'aggiornare il turno:', error);
    res.status(500).json({ message: 'Errore nell\'aggiornare il turno.' });
  }
};

module.exports = { salvaCalendario, getCalendario, updateTurno};