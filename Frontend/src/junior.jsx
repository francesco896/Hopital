import './login.css';
import React from 'react';
import medici from './assets/images/medici.jpg'; 
import calendario from './assets/images/calendario.jpg';
import profilo from './assets/images/profilo.jpg';
import CustomCard from './components/Card';
import Cookies from 'js-cookie'; 

function App() {
  const user = JSON.parse(Cookies.get('user') || '{}'); 
  const firstName = user?.firstName || 'Utente';
  const lastName = user?.lastName || '';

  return (
    <div className="app">
      <header className="senior-type">
        <h1>
          Benvenuto {firstName} {lastName}!
        </h1>
        <h2>
          Sezione operatori junior
        </h2>
      </header>
      <section className="custom-paragraph-section">
        ESPLORA LE FUNZIONALITÀ:
      </section>
      <div className="card-container">
        <CustomCard 
          title="Contatta" 
          image={medici}
          description="Contatta il tuo Senior per ricevere chiarimenti riguardo i turni o qualsiasi dubbio"
          destinationUrl="/contatta"
        />
        <CustomCard 
          title="Calendario" 
          image={calendario}
          description="Puoi vedere in tempo reale i turni che il tuo Senior ti ha assegnato"
          destinationUrl="/viewcalendar"
        />
        <CustomCard 
          title="Profilo" 
          image={profilo}
          description="Visualizza le tuo informazioni profilo, cambia password"
          destinationUrl="/profile"
        />
      </div>
    </div>
  );
}

export default App;
