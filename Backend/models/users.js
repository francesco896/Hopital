const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: [true, 'Il nome è un campo obbligatorio'] 
  },
  lastName: { 
    type: String, 
    required: [true, 'Il cognome è un campo obbligatorio'] 
  },
  role: { 
    type: String, 
    required: [true, 'Ruolo è un campo obbligatorio'] 
  },
  email: { 
    type: String, 
    unique: true, 
    required: [true, 'Email è un campo obbligatorio'], 
    match: [/.+@.+\..+/, 'Per favore inserisci una email valida!'] 
  },
  password: { 
    type: String, 
    required: [true, 'Password è un campo obbligatorio'] 
  },
  reparto: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Reparto', 
    required: false 
  },
  
}, { timestamps: true });



const User = mongoose.model('User', userSchema);
module.exports = User;