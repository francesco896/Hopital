const Richiesta = require('../models/Richiesta');

const createRichiesta = async (req, res) => {
    const { operatore, capoOperatore, turnoAttuale, turnoRichiesto, giorno } = req.body;
    try {
        
        if (!operatore || !capoOperatore || !turnoAttuale || !turnoRichiesto || !giorno) {
            return res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
        }

        
        const giorniValidi = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
        if (!giorniValidi.includes(giorno)) {
            return res.status(400).json({ error: 'Giorno non valido. Deve essere uno dei seguenti: ' + giorniValidi.join(', ') });
        }

       
        const nuovaRichiesta = new Richiesta({
            operatore,
            capoOperatore,
            turnoAttuale,
            turnoRichiesto,
            giorno, 
            stato: 'in attesa', 
        });

    
        const richiestaSalvata = await nuovaRichiesta.save();

        
        res.status(201).json(richiestaSalvata); 
    } catch (error) {
      
        console.error(error);
        res.status(500).json({ error: 'Si è verificato un errore durante la creazione della richiesta.' });
    }
}

const getRichiestePerCapoOperatore = async (req, res) => {
    const { caporepartoID } = req.query;
  
    if (!caporepartoID) {
      return res.status(400).json({ message: 'ID del caporeparto non presente.' });
    }
  
    try {
      const richieste = await Richiesta.find({ capoOperatore: caporepartoID, stato: 'in attesa' })
        .populate('operatore', 'firstName lastName _id')
        .select('_id turnoAttuale turnoRichiesto giorno operatore dataRichiesta');
  
      if (!richieste || richieste.length === 0) {
        return res.status(404).json({ message: 'Non ci sono nuove richieste per questo Capo_Operatore' });
      }
  
      const richiesteFormattate = richieste.map(richiesta => ({
        turnoAttuale: richiesta.turnoAttuale,
        turnoRichiesto: richiesta.turnoRichiesto,
        giorno: richiesta.giorno,
        operatoreId: richiesta.operatore._id,
        operatoreNome: `${richiesta.operatore.firstName} ${richiesta.operatore.lastName}`,
        dataRichiesta: richiesta.dataRichiesta
      }));
  
      res.status(200).json(richiesteFormattate);
    } catch (error) {
      console.error('Errore nel recuperare le richieste:', error);
      res.status(500).json({ message: 'Errore nel recuperare le richieste.' });
    }
};

  const updateRichiesta = async (req, res) => {
    const { operatore, capoOperatore, turnoAttuale, turnoRichiesto, giorno, nuovoStato } = req.body;

   
    if (!operatore || !capoOperatore || !turnoAttuale || !turnoRichiesto || !giorno || !nuovoStato) {
        return res.status(400).json({ message: 'Tutti i parametri sono obbligatori.' });
    }

    try {
        const richiesta = await Richiesta.findOneAndUpdate(
            { 
                operatore, 
                capoOperatore, 
                turnoAttuale, 
                turnoRichiesto, 
                giorno
            },
            { 
                stato: nuovoStato,
                dataAggiornamento: Date.now() 
            },
            { new: true } 
        );

        if (!richiesta) {
            return res.status(404).json({ message: 'Richiesta non trovata.' });
        }

        res.status(200).json({ message: 'Stato della richiesta aggiornato con successo.', richiesta });
    } catch (error) {
        console.error('Errore nell\'aggiornamento dello stato della richiesta:', error);
        res.status(500).json({ message: 'Errore nell\'aggiornamento dello stato della richiesta.' });
    }
};


  module.exports = { createRichiesta, getRichiestePerCapoOperatore, updateRichiesta};