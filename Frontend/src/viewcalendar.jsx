import React, { useState, useEffect } from 'react';
import './calendar.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Typography, Container, CircularProgress, MenuItem, Select, FormControl, Button } from '@mui/material'; 
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Cookies from 'js-cookie'; 

const defaultTheme = createTheme();

const Calendar = () => {
  const [operators, setOperators] = useState([]);
  const [calendarData, setCalendarData] = useState({});
  const [caporeparto, setCaporeparto] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selezionati, setSelezionati] = useState({});  
  const [visualizza, setVisualizza] = useState(false);  

 
  const getCurrentUser = () => {
    const token = Cookies.get('token');  
    if (token) {
      return jwtDecode(token);
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const user = getCurrentUser();
      setCurrentUser(user);
      if (!user) {
        setError('Errore durante il caricamento dei dati: nessun utente loggato.');
        setLoading(false);
        return;
      }

      const token = Cookies.get('token');  
      
      try {
        const rispostaCaporeparto = await axios.get('http://localhost:5001/api/reparto/caporeparto', {
          headers: { Authorization: `Bearer ${token}` },
          params: { operatoreId: user.id },
        });

        const capoReparto = rispostaCaporeparto.data.caporeparto;
        setCaporeparto(capoReparto._id);
        if (!capoReparto || !capoReparto._id) {
          throw new Error('Caporeparto non trovato o la risposta non è valida');
        }

        const rispostaReparto = await axios.get('http://localhost:5001/api/reparto/trovareparto', {
          headers: { Authorization: `Bearer ${token}` },
          params: { caporepartoId: capoReparto._id },
        });

        const idReparto = rispostaReparto.data.repartoId;
        if (!idReparto) {
          throw new Error('Reparto non trovato');
        }

        const rispostaDettagli = await axios.get('http://localhost:5001/api/reparto/dettagli', {
          headers: { Authorization: `Bearer ${token}` },
          params: { repartoId: idReparto },
        });

        const operators = rispostaDettagli.data.operatori || [];
        setOperators(operators);

        const rispostaCalendario = await axios.get('http://localhost:5001/api/calendario', {
          headers: { Authorization: `Bearer ${token}` },
          params: { repartoId: idReparto },
        });

        const datiCalendario = rispostaCalendario.data;
        if (datiCalendario && datiCalendario.settimana) {
          const DATABASECalendarData = datiCalendario.settimana.reduce((acc, giorno) => {
            acc[giorno.giorno] = giorno.turni.reduce((turniAcc, turno) => {
              turniAcc[turno.operatore._id] = turno.turno;
              return turniAcc;
            }, {});
            return acc;
          }, {});
          setCalendarData(DATABASECalendarData);
        }
      } catch (err) {
        console.error('Errore durante il caricamento dei dati:', err);
        setError(`Errore durante il caricamento dei dati: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTurnChange = (operatorId, giorno, NuovoTurno) => {
    setSelezionati(prevSelected => ({
      ...prevSelected,
      [operatorId]: {
        ...prevSelected[operatorId],
        [giorno]: NuovoTurno 
      }
    }));
  };

  const handleRequest = async (operatorId, giorno) => {
    const token = Cookies.get('token');  

    const currentTurn = calendarData[giorno][operatorId]; 
    const NuovoTurno = selezionati[operatorId]?.[giorno] || currentTurn; 

    alert(`Hai chiesto un cambio turno\n Turno attuale: ${currentTurn}\n Turno richiesto: ${NuovoTurno}`);

    const body = {
      operatore: operatorId,
      giorno: giorno,
      capoOperatore: caporeparto,
      turnoAttuale: currentTurn,
      turnoRichiesto: NuovoTurno,
    };

    try {
      await axios.post('http://localhost:5001/api/richiesta', body, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Errore durante la richiesta di cambio turno:', error);
      setError('Errore durante la richiesta di cambio turno.');
    }
  };

  const GiorniSettimana = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  const opzselezionabile = ['mattina', 'pomeriggio', 'sera'];

  return (
    <div >
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="md" className="flex-grow">
          <header className="senior-header mb-4">
            <Typography component="h1" variant="h3">
              Calendario
            </Typography>
          </header>
  
          {loading ? (
            <div className="flex justify-center items-center h-60vh">
              <CircularProgress />
            </div>
          ) : error ? (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          ) : (
            <div className="calendar-wrapper flex justify-between items-start">
              <div className="calendar-container flex-grow">
                <table className="calendar-table w-full">
                  <thead>
                    <tr>
                      <th>Operatore</th>
                      {GiorniSettimana.map((giorno) => <th key={giorno}>{giorno}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(operators) && operators.length > 0 ? (
                      operators.map((operator) => (
                        <tr key={operator._id}>
                          <td>{operator.firstName} {operator.lastName}</td>
                          {GiorniSettimana.map((giorno) => (
                            <td key={giorno} className={`calendar-cell ${calendarData[giorno]?.[operator._id] ? 'occupied' : ''}`}>
                              {calendarData[giorno]?.[operator._id] ? (
                                <div>
                                  <Typography variant="body1">{calendarData[giorno][operator._id]}</Typography>
                                  {operator._id === currentUser?.id && visualizza && (
                                    <FormControl fullWidth variant="outlined" size="small" className="mt-2">
                                      <Select
                                        value={selezionati[operator._id]?.[giorno] || calendarData[giorno][operator._id]}
                                        onChange={(e) => handleTurnChange(operator._id, giorno, e.target.value)}
                                      >
                                        {opzselezionabile.map((shift) => (
                                          <MenuItem key={shift} value={shift}>
                                            {shift}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  )}
                                  
                                  {operator._id === currentUser?.id && visualizza && (
                                    <Button 
                                      onClick={() => handleRequest(operator._id, giorno)} 
                                      variant="contained" 
                                      color="primary" 
                                      size="small"
                                      className="mt-2"
                                    >
                                      Manda Richiesta
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <Typography variant="body1">Non assegnato</Typography>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={GiorniSettimana.length + 1}>Nessun operatore disponibile.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Container>
        <div className="center-button-container mt-4 mb-8">
          <Button 
            onClick={() => setVisualizza(!visualizza)}  
            variant="contained"
            color="secondary"
            size="large"
          >
            {visualizza ? 'VISUALIZZA CALENDARIO' : 'RICHIEDI CAMBIO TURNO'}  
          </Button>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default Calendar;
