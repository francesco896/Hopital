import './App.css';
import React from 'react';
import medici from './assets/images/medici.jpg'; 
import calendario from './assets/images/calendario.jpg';
import team from './assets/images/team.jpg';   
import CustomCard from './components/Card';

function App() {
  return (
    <>
      <header className="app-header">
      </header>
     
      <section className="custom-paragraph-section">
     ESPLORA LE FUNZIONALITÀ:
      </section>
      <div className="card-container">
        <CustomCard 
          title="Contatta" 
          image={medici}
          description="Contatta il tuo Senior per ricevere chiarimenti riguardo i turni o qualsiasi dubbio"
         destinationUrl="/team"
        />
        <CustomCard 
          title="Calendario" 
          image={calendario}
          description="Puoi vedere in tempo reale i turni che il tuo Senior ti ha assegnato"
           destinationUrl="/calendar"
        />
        <CustomCard 
          title="Il tuo Team" 
          image={team}
          description="Gestisci il tuo team, assegnando turni o visualizzando le nuove aggiunte"
           destinationUrl="/team"
        />
      </div>

  
    </>
  );
}

export default App;