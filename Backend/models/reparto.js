const mongoose = require('mongoose');

const repartoSchema = new mongoose.Schema({

  caporeparto: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  operatori: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  calendario: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Calendario' 
  }],
}, { timestamps: true });

const Reparto = mongoose.model('Reparto', repartoSchema, 'repartos');
module.exports = Reparto;