import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Avatar, Grid, Box } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'; 


const getCurrentUser = () => {
  const token = Cookies.get('token');  
  if (token) {
    return jwtDecode(token);  
  }
  return null;  
};

const Contatta = () => {
  const [capoReparto, setCapoReparto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCapoReparto = async () => {
      setLoading(true);
      setError(null);

      const currentUser = getCurrentUser();  
      if (!currentUser) {
        setError('Utente non autenticato');
        setLoading(false);
        return;
      }

      const token = Cookies.get('token');  

      try {
        const response = await axios.get('http://localhost:5001/api/reparto/caporeparto', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            operatoreId: currentUser.id,  
          },
        });

        setCapoReparto(response.data.caporeparto);  
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('Attualmente non sei stato assegnato a nessun reparto');
        } else {
          setError('Errore nel recupero del caporeparto');
        }
      } finally {
        setLoading(false);  
      }
    };

    fetchCapoReparto();
  }, []);

  if (loading) return <Typography>Caricamento...</Typography>;
  if (error) return <Typography>Errore: {error}</Typography>;

  return (
    <>
      <section className="custom-paragraph-section">
        INFORMAZIONI DI CONTATTO DEL TUO SUPERVISORE:
      </section>

      <Container component="main" maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            {capoReparto ? (
              <>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 100, height: 100 }}>
                  {capoReparto.firstName ? capoReparto.firstName[0] : 'N/A'}
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ marginTop: 2 }}>
                  {capoReparto.firstName || 'Nome non disponibile'} {capoReparto.lastName || 'Cognome non disponibile'}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {capoReparto.email || 'Email non disponibile'}
                </Typography>
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                  <Grid item xs={12}>
                    <Typography variant="body1">Nome: {capoReparto.firstName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">Cognome: {capoReparto.lastName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">Email: {capoReparto.email || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </>
            ) : (
              <div>Attualmente non sei in nessun reparto.</div>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Contatta;
