import './login.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import calendario from './assets/images/calendario.jpg';
import team from './assets/images/team.jpg'; 
import profilo from './assets/images/profilo.jpg';
import CustomCard from './components/Card';
import Cookies from 'js-cookie'; 

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('token'); 
        if (!token) {
          throw new Error('Token mancante');
        }

        const response = await axios.get('http://localhost:5001/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Errore durante il recupero del profilo:', error);
        setError('Non è stato possibile caricare il profilo');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) return <div>Errore: {error}</div>;

  const firstName = user?.firstName || 'Utente';
  const lastName = user?.lastName || '';

  return (
    <div className="app-container">
      <header className="senior-type">
        <h1>Benvenuto {firstName} {lastName}!</h1>
        <h1>Sezione operatori senior</h1>
      </header>
      <section className="custom-paragraph-section">
        ESPLORA LE FUNZIONALITÀ:
      </section>
      <div className="card-container">
        <CustomCard 
          title="Calendario" 
          image={calendario}
          description="Assegna in tempo reale i turni ai tuoi subordinati di reparto"
          destinationUrl="/calendar"
        />
        <CustomCard 
          title="Il tuo Team" 
          image={team}
          description="Gestisci il tuo team, assegnando turni nel tuo reparto, o visualizzando le nuove aggiunte nel reparto"
          destinationUrl="/team"
        />
        <CustomCard 
          title="Profilo" 
          image={profilo}
          description="Visualizza le tue informazioni profilo, cambia password"
          destinationUrl="/profile"
        />
      </div>
    </div>
  );
}

export default App;
