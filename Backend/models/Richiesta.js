const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const richiestaSchema = new Schema({
  operatore: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  capoOperatore: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  turnoAttuale: { 
    type: String, 
    enum: ['mattina', 'pomeriggio', 'sera'],
    required: true
  },
  turnoRichiesto: { 
    type: String, 
    enum: ['mattina', 'pomeriggio', 'sera'],
    required: true
  },
  giorno: { 
    type: String, 
    enum: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'], 
    required: true 
  },
  stato: { 
    type: String, 
    enum: ['in attesa', 'accettata', 'rifiutata'], 
    default: 'in attesa' 
  },
  dataRichiesta: { 
    type: Date, 
    default: Date.now 
  },
  dataAggiornamento: { 
    type: Date 
  }
});

const Richiesta = mongoose.model('Richiesta', richiestaSchema);

module.exports = Richiesta;
