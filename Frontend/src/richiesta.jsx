import React, { useState, useEffect } from 'react';
import './calendar.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Typography, Container, CircularProgress, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Cookies from 'js-cookie'; 

const defaultTheme = createTheme();

const Richiesta = () => {
  const [richieste, setRichieste] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [repartoId, setRepartoId] = useState(null);

  const getCurrentUser = () => {
    const token = Cookies.get('token');  
    if (token) {
      return jwtDecode(token);
    }
    return null;
  };

  const fetchRichieste = async (currentUser, token) => {
    try {
      const responseRichieste = await axios.get('http://localhost:5001/api/recupero', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          caporepartoID: currentUser.id,
        },
      });
  
      console.log('Risposta API richieste:', responseRichieste.data);
  
      if (responseRichieste.data.length === 0) {
        setError('Attualmente non ci sono richieste di cambio.');
      } else {
        setRichieste(responseRichieste.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Attualmente non ci sono richieste di cambio.');
      } else {
        console.error('Errore durante il recupero delle richieste:', err);
        setError(`Errore durante il recupero dei dati: ${err.message}`);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        console.error('Nessun utente loggato');
        setError('Errore durante il caricamento dei dati: nessun utente loggato.');
        setLoading(false);
        return;
      }
  
      const token = Cookies.get('token');  
      try {
        const responseReparto = await axios.get('http://localhost:5001/api/reparto/trovareparto', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            caporepartoId: currentUser.id,
          },
        });
  
        console.log('Risposta API reparto:', responseReparto.data);
  
        const repartoId = responseReparto.data.repartoId;
        if (!repartoId) {
          throw new Error('Reparto non trovato');
        }
  
        setRepartoId(repartoId);
  
        await fetchRichieste(currentUser, token);
      } catch (err) {
        console.error('Errore durante il recupero dei dati:', err);
        setError(`Errore durante il recupero dei dati: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleUpdateTurno = async (richiesta) => {
    const token = Cookies.get('token');  
    const currentUser = getCurrentUser();

    try {
      const responseTurno = await axios.post('http://localhost:5001/api/cambio', {
        repartoId,
        giorno: richiesta.giorno,
        operatoreId: richiesta.operatoreId,
        nuovoTurno: richiesta.turnoRichiesto
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Risposta API cambio turno:', responseTurno.data);

      const responseStato = await axios.post('http://localhost:5001/api/richiesta/statorichiesta', {
        operatore: richiesta.operatoreId,
        capoOperatore: currentUser.id, 
        turnoAttuale: richiesta.turnoAttuale,
        turnoRichiesto: richiesta.turnoRichiesto,
        giorno: richiesta.giorno,
        nuovoStato: 'accettata',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Risposta API cambio stato:', responseStato.data);

      setRichieste(prevRichieste => 
        prevRichieste.filter(r => r.operatoreId !== richiesta.operatoreId || 
                                   r.giorno !== richiesta.giorno ||
                                   r.turnoRichiesto !== richiesta.turnoRichiesto)
      );

      alert('Turno aggiornato e richiesta accettata con successo');
    } catch (error) {
      console.error('Errore durante l\'aggiornamento:', error);
      alert('Errore durante l\'aggiornamento');
    }
  };


  const handleRejectTurno = async (richiesta) => {
    const token = Cookies.get('token'); 
    const currentUser = getCurrentUser();

    try {
      const responseStato = await axios.post('http://localhost:5001/api/richiesta/statorichiesta', {
        operatore: richiesta.operatoreId,
        capoOperatore: currentUser.id, 
        turnoAttuale: richiesta.turnoAttuale,
        turnoRichiesto: richiesta.turnoRichiesto,
        giorno: richiesta.giorno,
        nuovoStato: 'rifiutato',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Risposta API rifiuto stato:', responseStato.data);

     
      setRichieste(prevRichieste => 
        prevRichieste.filter(r => r.operatoreId !== richiesta.operatoreId || 
                                   r.giorno !== richiesta.giorno ||
                                   r.turnoRichiesto !== richiesta.turnoRichiesto)
      );

      alert('Richiesta rifiutata con successo');
    } catch (error) {
      console.error('Errore durante il rifiuto:', error);
      alert('Errore durante il rifiuto');
    }
  };

  if (loading) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error" className="text-center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
        <header className="senior-header mb-4">
          <Typography component="h1" variant="h3">
            Richieste di Cambio Turno
          </Typography>
        </header>
        <div className="richieste-container">
          {richieste.length > 0 ? (
            <List>
              {richieste.map((richiesta, index) => (
                <React.Fragment key={richiesta.operatoreId + richiesta.giorno + richiesta.turnoRichiesto}>
                  <ListItem>
                    <ListItemText
                      primary={`Operatore: ${richiesta.operatoreNome} (ID: ${richiesta.operatoreId})`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textPrimary">
                            Turno Attuale: {richiesta.turnoAttuale}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="textPrimary">
                            Turno Richiesto: {richiesta.turnoRichiesto}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="textPrimary">
                            Giorno: {richiesta.giorno}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="textPrimary">
                            Data di Richiesta: {new Date(richiesta.dataRichiesta).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleUpdateTurno(richiesta)}
                    >
                      Approva
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleRejectTurno(richiesta)}
                      style={{ marginLeft: 10 }}
                    >
                      Rifiuta
                    </Button>
                  </ListItem>
                  {index < richieste.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body1">Nessuna richiesta trovata.</Typography>
          )}
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default Richiesta;
