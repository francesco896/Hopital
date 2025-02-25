import React, { useState, useEffect } from 'react';
import './calendar.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Typography, Container, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Cookies from 'js-cookie';

const defaultTheme = createTheme();

const Calendar = () => {
  const [operators, setOperators] = useState([]);
  const [calendarData, setCalendarData] = useState({});
  const [repartoId, setRepartoId] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCurrentUser = () => {
    const token = Cookies.get('token');
    if (token) {
      return jwtDecode(token);
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        console.error('Nessun utente loggato');
        setError('Errore durante il caricamento dei dati: nessun utente loggato.');
        return;
      }

      const token = Cookies.get('token');
      console.log('caporepartoID: ', currentUser.id);

      try {
        console.log('Inizio chiamata API per ottenere il reparto...');

        const rispostaReparto = await axios.get('http://localhost:5001/api/reparto/trovareparto', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            caporepartoId: currentUser.id,
          },
        });

        console.log('Risposta API reparto:', rispostaReparto.data);

        const idReparto = rispostaReparto.data.repartoId;
        if (!idReparto) {
          throw new Error('Reparto non trovato');
        }

        setRepartoId(idReparto);

        console.log('ID reparto trovato:', idReparto);

        const rispostaDettagli = await axios.get('http://localhost:5001/api/reparto/dettagli', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            repartoId: idReparto,
          },
        });

        console.log('Risposta API dettagli:', rispostaDettagli.data);
        const operatori = rispostaDettagli.data.operatori || [];
        setOperators(operatori);

        console.log('Chiamata API per ottenere il calendario...');
        const rispostaCalendario = await axios.get('http://localhost:5001/api/calendario', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            repartoId: idReparto,
          },
        });

        console.log('Risposta API calendario:', rispostaCalendario.data);
        const calendario = rispostaCalendario.data;

        if (calendario && calendario.settimana) {
          const datiCalendarioIniziali = calendario.settimana.reduce((acc, giorno) => {
            acc[giorno.giorno] = giorno.turni.reduce((turniAcc, turno) => {
              turniAcc[turno.operatore._id] = turno.turno;
              return turniAcc;
            }, {});
            return acc;
          }, {});

          setCalendarData(datiCalendarioIniziali);
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

  const GiorniSettimana = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  const opzselezionabile = ['mattina', 'pomeriggio', 'sera'];

  const handleCalendarChange = (Giorno, ID_Operatore, event) => {
    const turno = event.target.value;

    setCalendarData((prevCalendarData) => ({
      ...prevCalendarData,
      [Giorno]: {
        ...prevCalendarData[Giorno],
        [ID_Operatore]: turno,
      },
    }));
  };

  const handleSave = async () => {
    if (!repartoId) {
      console.error('ID del reparto non trovato!');
      return;
    }

    const token = Cookies.get('token');

    try {
      await axios.post('http://localhost:5001/api/calendario/salva', {
        repartoId,
        settimana: Object.entries(calendarData).map(([giorno, turni]) => ({
          giorno,
          turni: Object.entries(turni).map(([operatoreId, turno]) => ({
            operatore: operatoreId,
            turno,
          })),
        })),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Calendario salvato con successo!');
    } catch (err) {
      console.error('Errore durante il salvataggio del calendario:', err);
    }
  };

  if (loading) {
    return <div>Caricamento...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
        <header className="senior-header">
          <Typography component="h1" variant="h3">
            Calendario
          </Typography>
        </header>
        <div className="calendar-container">
          <table className="calendar-table">
            <thead>
              <tr>
                <th>Operatore</th>
                {GiorniSettimana.map((Giorno) => (
                  <th key={Giorno}>{Giorno}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(operators) && operators.length > 0 ? (
                operators.map((operator) => (
                  <tr key={operator._id}>
                    <td>{operator.firstName} {operator.lastName}</td>
                    {GiorniSettimana.map((Giorno) => (
                      <td
                        key={Giorno}
                        className={`calendar-cell ${calendarData[Giorno]?.[operator._id] ? 'occupied' : ''}`}
                      >
                        {calendarData[Giorno]?.[operator._id] && (
                          <i className="fa-solid fa-calendar-check"></i>
                        )}
                        <FormControl fullWidth>
                          <InputLabel>inserisci</InputLabel>
                          <Select
                            value={(calendarData[Giorno] && calendarData[Giorno][operator._id]) || ''}
                            onChange={(e) => handleCalendarChange(Giorno, operator._id, e)}
                          >
                            {opzselezionabile.map((shift) => (
                              <MenuItem key={shift} value={shift}>
                                {shift}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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
          <Button variant="contained" color="primary" onClick={handleSave}>
            Salva Calendario
          </Button>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default Calendar;
