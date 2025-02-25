const Reparto = require('../models/reparto');
const User = require('../models/users');

const createReparto = async (req, res) => {
  const { caporepartoId } = req.body;

  if (!caporepartoId) {
    return res.status(400).json({ message: 'ID del capo reparto non fornito' });
  }

  try {
    const reparto = await Reparto.findOneAndUpdate(
      { caporeparto: caporepartoId }, 
      { $setOnInsert: { caporeparto: caporepartoId } }, 
      { new: true, upsert: true } 
    );

    
    await User.findByIdAndUpdate(
      caporepartoId,
      { reparto: reparto._id } 
    );

   
    res.status(200).json(reparto);
  } catch (error) {
    console.error('Errore durante la creazione del reparto:', error);
    res.status(500).json({ message: 'Errore durante la creazione del reparto' });
  }
};



const getRepartoByCapoReparto = async (req, res) => {
    const { caporepartoId } = req.query;
    console.log(`Tentativo di recuperare il reparto per il caporeparto con ID: ${caporepartoId}`);
    try {
        const reparto = await Reparto.findOne({ caporeparto: caporepartoId });

        if (!reparto) {
            return res.status(404).json({ message: 'Reparto non trovato per questo caporeparto' });
        }
   
        res.status(200).json({ repartoId: reparto._id });
    } catch (error) {
        console.error('Errore nel recupero del reparto:', error);
        res.status(500).json({ message: 'Errore nel recupero del reparto' });
    }
};

const getCapoRepartoByOperatore = async (req, res) => {
  const { operatoreId } = req.query;

  console.log(`Tentativo di recuperare il caporeparto per l'operatore con ID: ${operatoreId}`);

  if (!operatoreId) {
      return res.status(400).json({ message: 'ID operatore non fornito' });
  }

  try {
      const reparto = await Reparto.findOne({ operatori: operatoreId })
        .populate('caporeparto');

      if (!reparto || !reparto.caporeparto) {
          return res.status(404).json({ message: 'Attualmente l\'utente non è in nessun reparto o capo reparto non trovato' });
      }

      console.log(`Capo reparto trovato con ID: ${reparto.caporeparto._id}`);
      console.log(`Capo reparto trovato con ID: ${reparto.caporeparto.lastName}`);
      res.status(200).json({ caporeparto: reparto.caporeparto });
  } catch (error) {
      console.error('Errore nel recupero del capo reparto:', error.message);
      res.status(500).json({ message: 'Errore nel recupero del capo reparto' });
  }
};


const getRepartoById = async (req, res) => {
  const { repartoId } = req.query;

  try {
    
 
    const reparto = await Reparto.findById(repartoId)
      .populate('operatori', 'firstName lastName') 
      .exec();

    if (!reparto) {
      return res.status(404).json({ message: 'Reparto non trovato' });
    }

    res.status(200).json(reparto);
  } catch (error) {
    console.error('Errore nel recupero del reparto:', error);
    res.status(500).json({ message: 'Errore nel recupero del reparto' });
  }
};



const getOperatorsByCapoReparto = async (req, res) => {
    const { caporepartoId } = req.query; 
  
    try {
      console.log(`Tentativo di recuperare il reparto per il caporeparto con ID: ${caporepartoId}`);
  
      const reparto = await Reparto.findOne({ caporeparto: caporepartoId })
        .populate('operatori', 'firstName lastName email role')
        .exec();
  
        
      if (!reparto) {
        console.log(`il reparto non esiste bisogna crearlo`);
        return res.status(404).json({ message: 'Reparto non trovato per il caporeparto specificato' });
      }
  
      res.status(200).json(reparto.operatori);
    } catch (error) {
        console.log(`sisi è qui l'errore`);
      console.error('Errore durante il recupero degli operatori:', error.message);
      res.status(500).json({ message: 'Errore del server' });
    }
};


const aggiungiJuniorToReparto = async (req, res) => {
    const { caporepartoId, juniorId } = req.body;

    try {
        const reparto = await Reparto.findOne({ caporeparto: caporepartoId });

        if (!reparto) {
            return res.status(404).json({ message: 'Reparto non trovato' });
        }

        const junior = await User.findById(juniorId);

        if (!junior) {
            return res.status(404).json({ message: 'Junior non trovato' });
        }

       
        if (!reparto.operatori.includes(juniorId)) {
            reparto.operatori.push(juniorId);
            await reparto.save();
        }
  
           junior.reparto = reparto._id;
           await junior.save();
   

        res.status(200).json({ junior });
    } catch (error) {
        console.error('Errore durante l\'aggiunta del junior al reparto:', error);
        res.status(500).json({ message: 'Errore durante l\'aggiunta del junior al reparto' });
    }
};


  

  
  module.exports = { createReparto, getCapoRepartoByOperatore, getRepartoByCapoReparto, getOperatorsByCapoReparto, getRepartoById, aggiungiJuniorToReparto };