const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); 


const app = express();


app.use(express.json()); 
app.use(cors()); 


app.use('/api', authRoutes); 


const uri = 'mongodb+srv://';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connesso a MongoDB Atlas!'))
  .catch(err => console.log('Errore di connessione:', err));

app.listen(5001, () => {
  console.log('Server in ascolto sulla porta 5001');
});
