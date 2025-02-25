const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calendarioSchema = new Schema({
  reparto: { 
    type: Schema.Types.ObjectId, 
    ref: 'Reparto', 
    required: true 
  },
  settimana: [{
    giorno: { 
      type: String, 
      enum: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'], 
      required: true 
    },
    turni: [{
      operatore: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
      },
      turno: {
        type: String,
        enum: ['mattina', 'pomeriggio', 'sera'],
        required: true
      }
    }]
  }]
});

const Calendario = mongoose.model('Calendario', calendarioSchema);

module.exports = Calendario;
