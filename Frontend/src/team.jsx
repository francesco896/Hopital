import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';  
import { Select, MenuItem, CircularProgress, FormControl, InputLabel, Typography, Card, CardContent, Button } from '@mui/material';

const TeamPage = () => {
  const [operators, setOperators] = useState([]);
  const [juniors, setJuniors] = useState([]);
  const [caricamentoOperatori, setCaricamentoOp] = useState(true);
  const [caricamentoJunior, setCaricamentoJn] = useState(true);
  const [errorOperatori, setErrorOperatori] = useState(null);
  const [errorJunior, setErrorJunior] = useState(null);
  const [selezionOperatori, setSelezionOperatori] = useState('');
  const [selezionJunior, setSelezionJunior] = useState('');
  const [dettagliOperatori, setDettagliOperatori] = useState(null);
  const [dettJunior, setDettagliJunior] = useState(null);
  const [repartoCreato, setRepartoCreato] = useState(false);
  const [caricamentoReparto, setCaricamentoReparto] = useState(false);

  const getCurrentUser = () => {
    const token = Cookies.get('token'); 
    if (token) {
      return jwtDecode(token);  
    }
    return null;
  };

  useEffect(() => {
    const fetchOperators = async () => {
      setCaricamentoOp(true);
      setErrorOperatori(null);

      const currentUser = getCurrentUser();
      if (!currentUser) {
        setErrorOperatori('Utente non autenticato');
        setCaricamentoOp(false);
        return;
      }

      const token = Cookies.get('token');  

      try {
        const responseCheck = await axios.get('http://localhost:5001/api/reparto/operatori', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            caporepartoId: currentUser.id,
          }
        });

        setOperators(responseCheck.data);
        setRepartoCreato(true);

      } catch (err) {
        if (err.response && err.response.status === 404 && !caricamentoReparto) {
          setCaricamentoReparto(true);
          try {
            await axios.post('http://localhost:5001/api/reparto/crea', {
              caporepartoId: currentUser.id,
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            setOperators([]); 
            setRepartoCreato(true);
          } catch (creationError) {
            console.error('Errore durante la creazione del reparto:', creationError);
            setErrorOperatori('Errore durante la creazione del reparto');
          } finally {
            setCaricamentoReparto(false);
          }
        } else {
          console.error('Errore durante il recupero degli operatori:', err);
          setErrorOperatori('Errore durante il recupero degli operatori');
        }
      } finally {
        setCaricamentoOp(false);
      }
    };

    fetchOperators();
  }, [caricamentoReparto]);

  useEffect(() => {
    const fetchJuniors = async () => {
      setCaricamentoJn(true);
      setErrorJunior(null);

      const currentUser = getCurrentUser();
      if (!currentUser) {
        setErrorJunior('Utente non autenticato');
        setCaricamentoJn(false);
        return;
      }

      try {
        const token = Cookies.get('token');  
        const response = await axios.post('http://localhost:5001/api/team', {
          capoRepartoId: currentUser.id,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJuniors(response.data);
      } catch (err) {
        setErrorJunior('Errore durante il recupero degli utenti junior');
      } finally {
        setCaricamentoJn(false);
      }
    };

    fetchJuniors();
  }, []);

  const handleOperatorChange = (event) => {
    const operatorId = event.target.value;
    setSelezionOperatori(operatorId);
    const operator = operators.find(o => o._id === operatorId);
    setDettagliOperatori(operator);
  };

  const handleJuniorChange = (event) => {
    const juniorId = event.target.value;
    setSelezionJunior(juniorId);
    const junior = juniors.find(j => j._id === juniorId);
    setDettagliJunior(junior);
  };

  const handleAddJuniorToReparto = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser || !selezionJunior) return;

    const token = Cookies.get('token');  

    try {
      const response = await axios.post('http://localhost:5001/api/add', {
        caporepartoId: currentUser.id,
        juniorId: selezionJunior,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOperators(prevOperators => [...prevOperators, response.data.junior]);
      setJuniors(prevJuniors => prevJuniors.filter(j => j._id !== selezionJunior));
      setSelezionJunior('');
      setDettagliJunior(null);

    } catch (error) {
      console.error('Errore durante l\'aggiunta del junior al reparto:', error);
    }
  };

  if (caricamentoOperatori || caricamentoJunior) {
    return <div>Caricamento... <CircularProgress /></div>;
  }

  if (errorOperatori) {
    return <div>{errorOperatori}</div>;
  }

  if (errorJunior) {
    return <div>{errorJunior}</div>;
  }

  return (
    <div>
      {operators.length === 0 && repartoCreato && (
        <h1>Attualmente il tuo reparto è vuoto</h1>
      )}
      <br />
     
      <h2>Operatori nel Reparto</h2>
      <FormControl id="operatori" fullWidth>
        <InputLabel id="operator-select-label">Visualizza gli Operatori nel tuo reparto</InputLabel>
        <Select
          labelId="operator-select-label"
          value={selezionOperatori}
          onChange={handleOperatorChange}
          displayEmpty
        >
          {operators.map((operator) => (
            <MenuItem key={operator._id} value={operator._id}>
              {operator.firstName} {operator.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {dettagliOperatori && (
        <Card variant="outlined" sx={{ marginTop: 2 }}>
          <CardContent>
            <Typography variant="h6">Dettagli dell'Operatore</Typography>
            <Typography><strong>Nome:</strong> {dettagliOperatori.firstName} {dettagliOperatori.lastName}</Typography>
            <Typography><strong>Email:</strong> {dettagliOperatori.email}</Typography>
            <Typography><strong>Ruolo:</strong> {dettagliOperatori.role}</Typography>
          </CardContent>
        </Card>
      )}

      <h2>Operatori Junior attualmente senza Reparto</h2>
      <p>In questa sezione sono presenti gli operatori attualmente liberi e senza alcun reparto che potrai aggiungere in qualisasi momento al tuo team reparto</p>
      <FormControl fullWidth>
        <InputLabel id="junior-select-label">Seleziona un Junior</InputLabel>
        <Select
          labelId="junior-select-label"
          value={selezionJunior}
          onChange={handleJuniorChange}
          displayEmpty
        >
          {juniors.map((junior) => (
            <MenuItem key={junior._id} value={junior._id}>
              {junior.firstName} {junior.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {dettJunior && (
        <div>
          <Card variant="outlined" sx={{ marginTop: 2 }}>
            <CardContent>
              <Typography variant="h6">Dettagli dell'Utente Junior</Typography>
              <Typography><strong>Nome:</strong> {dettJunior.firstName} {dettJunior.lastName}</Typography>
              <Typography><strong>Email:</strong> {dettJunior.email}</Typography>
              <Typography><strong>Ruolo:</strong> {dettJunior.role}</Typography>
            </CardContent>
          </Card>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={handleAddJuniorToReparto}
          >
            Aggiungi al Reparto
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
